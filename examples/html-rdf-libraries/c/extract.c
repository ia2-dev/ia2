#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>
#include <curl/curl.h>
#include <lexbor/html/html.h>
#include "carrier_profile.h"

#define FIELD 512
#define XSD_STRING "http://www.w3.org/2001/XMLSchema#string"
#define RDF_DIR_LANG_STRING "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString"

typedef struct {
    char *data;
    size_t length;
} buffer_t;

typedef struct {
    char field[7][FIELD];
} row_t;

typedef struct {
    const char *source;
    row_t rows[8];
    size_t length;
} extraction_t;

static size_t receive(char *data, size_t size, size_t count, void *ctx) {
    buffer_t *buffer = ctx;
    size_t length = size * count;
    char *next = realloc(buffer->data, buffer->length + length + 1);
    if (next == NULL)
        return 0;
    buffer->data = next;
    memcpy(buffer->data + buffer->length, data, length);
    buffer->length += length;
    buffer->data[buffer->length] = '\0';
    return length;
}

static int attribute(lxb_dom_element_t *element, const char *name, char *output) {
    size_t length = 0;
    const lxb_char_t *value = lxb_dom_element_get_attribute(
        element, (const lxb_char_t *)name, strlen(name), &length);
    if (value == NULL) {
        output[0] = '\0';
        return 0;
    }
    if (length >= FIELD)
        length = FIELD - 1;
    memcpy(output, value, length);
    output[length] = '\0';
    return 1;
}

static int tag_is(lxb_dom_element_t *element, const char *expected) {
    size_t length = 0;
    const lxb_char_t *name = lxb_dom_element_local_name(element, &length);
    return strlen(expected) == length && memcmp(name, expected, length) == 0;
}

static void resolve_iri(const char *base, const char *reference, char *output) {
    const char *colon = strchr(reference, ':');
    if (colon != NULL && colon != reference) {
        snprintf(output, FIELD, "%s", reference);
        return;
    }
    if (reference[0] == '#') {
        size_t length = strcspn(base, "#");
        snprintf(output, FIELD, "%.*s%s", (int)length, base, reference);
        return;
    }
    const char *scheme = strstr(base, "://");
    const char *path = scheme == NULL ? base : strchr(scheme + 3, '/');
    size_t origin = path == NULL ? strlen(base) : (size_t)(path - base);
    if (reference[0] == '/') {
        snprintf(output, FIELD, "%.*s%s", (int)origin, base, reference);
        return;
    }
    size_t directory = strlen(base);
    while (directory > origin && base[directory - 1] != '/')
        directory--;
    snprintf(output, FIELD, "%.*s%s", (int)directory, base, reference);
}

static void normalize(const lxb_char_t *input, size_t length, char *output) {
    size_t write = 0;
    int pending_space = 0;
    for (size_t read = 0; read < length && write + 1 < FIELD; read++) {
        unsigned char value = input[read];
        if (value == '\t' || value == '\n' || value == '\f' || value == '\r' ||
            value == ' ') {
            if (write > 0)
                pending_space = 1;
            continue;
        }
        if (pending_space && write + 1 < FIELD)
            output[write++] = ' ';
        pending_space = 0;
        output[write++] = (char)value;
    }
    output[write] = '\0';
}

static void find_canonical(lxb_dom_node_t *node, char *canonical, size_t *count) {
    if (node->type == LXB_DOM_NODE_TYPE_ELEMENT) {
        lxb_dom_element_t *element = lxb_dom_interface_element(node);
        char rel[FIELD], href[FIELD];
        if (tag_is(element, "link") && attribute(element, "rel", rel) &&
            attribute(element, "href", href) && strcasecmp(rel, "canonical") == 0) {
            snprintf(canonical, FIELD, "%s", href);
            (*count)++;
        }
    }
    for (lxb_dom_node_t *child = node->first_child; child != NULL; child = child->next)
        find_canonical(child, canonical, count);
}

static void collect(lxb_dom_node_t *node, extraction_t *ctx) {
    int template = 0;
    if (node->type == LXB_DOM_NODE_TYPE_ELEMENT) {
        lxb_dom_element_t *element = lxb_dom_interface_element(node);
        template = tag_is(element, "template");
        char predicate_ref[FIELD];
        if (attribute(element, "rdf-predicate", predicate_ref)) {
            row_t *row = &ctx->rows[ctx->length++];
            char subject_ref[FIELD], carrier_value[FIELD], datatype_ref[FIELD], language[FIELD],
                direction[FIELD];
            attribute(element, "rdf-subject", subject_ref);
            resolve_iri(ctx->source, subject_ref, row->field[0]);
            resolve_iri(ctx->source, predicate_ref, row->field[1]);

            /* The generated profile identifies a native attribute carrying the value. */
            const carrier_rule_t *carrier = NULL;
            for (size_t i = 0; i < CARRIER_RULE_COUNT; i++) {
                if (tag_is(element, CARRIER_RULES[i].element) &&
                    attribute(element, CARRIER_RULES[i].attribute, carrier_value)) {
                    if (carrier != NULL)
                        abort();
                    carrier = &CARRIER_RULES[i];
                }
            }

            /* IRI carrier values are references resolved against the semantic source. */
            if (carrier != NULL && strcmp(carrier->kind, "iri") == 0) {
                strcpy(row->field[2], "I");
                resolve_iri(ctx->source, carrier_value, row->field[3]);
                row->field[4][0] = row->field[5][0] = row->field[6][0] = '\0';
            } else {
                strcpy(row->field[2], "L");

                /* Literal carriers are exact; other elements use normalized text. */
                if (carrier != NULL && strcmp(carrier->kind, "literal") == 0) {
                    strcpy(row->field[3], carrier_value);
                } else {
                    size_t length = 0;
                    lxb_char_t *text = lxb_dom_node_text_content(node, &length);
                    normalize(text, length, row->field[3]);
                }

                /* lang and dir apply only when directly present on this carrier. */
                attribute(element, "lang", language);
                strcpy(row->field[5], language);
                attribute(element, "dir", direction);
                for (char *p = direction; *p; p++)
                    *p = (char)tolower((unsigned char)*p);
                if (strcmp(direction, "ltr") != 0 && strcmp(direction, "rtl") != 0)
                    direction[0] = '\0';
                strcpy(row->field[6], direction);

                /* Explicit datatype wins; direction otherwise means dirLangString. */
                if (attribute(element, "rdf-datatype", datatype_ref))
                    resolve_iri(ctx->source, datatype_ref, row->field[4]);
                else
                    strcpy(row->field[4], direction[0] ? RDF_DIR_LANG_STRING : XSD_STRING);
            }
        }
    }
    if (!template)
        for (lxb_dom_node_t *child = node->first_child; child != NULL; child = child->next)
            collect(child, ctx);
}

static int compare_rows(const void *left, const void *right) {
    return strcmp(((const row_t *)left)->field[1], ((const row_t *)right)->field[1]);
}

int main(int argc, char **argv) {
    if (argc != 2)
        return EXIT_FAILURE;

    /* Fetch and parse the document as HTML. */
    CURL *curl = curl_easy_init();
    buffer_t html = {0};
    curl_easy_setopt(curl, CURLOPT_URL, argv[1]);
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, receive);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &html);
    if (curl_easy_perform(curl) != CURLE_OK)
        return EXIT_FAILURE;
    char *retrieval = NULL;
    curl_easy_getinfo(curl, CURLINFO_EFFECTIVE_URL, &retrieval);
    lxb_html_document_t *document = lxb_html_document_create();
    if (document == NULL || lxb_html_document_parse(document, (lxb_char_t *)html.data,
                                                    html.length) != LXB_STATUS_OK)
        return EXIT_FAILURE;

    /* Resolve semantic references against the one canonical source IRI. */
    char canonical[FIELD];
    size_t canonical_count = 0;
    find_canonical(lxb_dom_interface_node(document), canonical, &canonical_count);
    if (canonical_count != 1)
        return EXIT_FAILURE;
    char source[FIELD];
    resolve_iri(retrieval, canonical, source);

    /* Walk the tree to find every locally complete statement carrier. */
    extraction_t extraction = {.source = source, .length = 0};
    collect(lxb_dom_interface_node(document), &extraction);
    qsort(extraction.rows, extraction.length, sizeof(row_t), compare_rows);
    for (size_t i = 0; i < extraction.length; i++) {
        for (size_t field = 0; field < 7; field++)
            printf("%s%c", extraction.rows[i].field[field], field == 6 ? '\n' : '\t');
    }
    lxb_html_document_destroy(document);
    curl_easy_cleanup(curl);
    free(html.data);
    return EXIT_SUCCESS;
}
