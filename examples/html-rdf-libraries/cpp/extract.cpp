#include <algorithm>
#include <cctype>
#include <cstring>
#include <iostream>
#include <stdexcept>
#include <string>
#include <string_view>
#include <vector>
#include <curl/curl.h>
#include <lexbor/html/html.h>
#include "carrier_profile.hpp"

using Row = std::vector<std::string>;
constexpr auto XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
constexpr auto RDF_DIR_LANG_STRING =
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString";

static size_t receive(char *data, size_t size, size_t count, void *ctx) {
    static_cast<std::string *>(ctx)->append(data, size * count);
    return size * count;
}

static std::string attr(lxb_dom_element_t *element, const char *name) {
    size_t length = 0;
    auto value = lxb_dom_element_get_attribute(
        element, reinterpret_cast<const lxb_char_t *>(name), std::strlen(name), &length);
    return value == nullptr ? std::string()
                            : std::string(reinterpret_cast<const char *>(value), length);
}

static bool has_attr(lxb_dom_element_t *element, const char *name) {
    return lxb_dom_element_has_attribute(
        element, reinterpret_cast<const lxb_char_t *>(name), std::strlen(name));
}

static bool tag_is(lxb_dom_element_t *element, std::string_view expected) {
    size_t length = 0;
    auto name = lxb_dom_element_local_name(element, &length);
    return expected == std::string_view(reinterpret_cast<const char *>(name), length);
}

static std::string resolve(std::string base, const std::string &reference) {
    auto colon = reference.find(':');
    if (colon != std::string::npos && colon != 0)
        return reference;
    if (reference.starts_with('#')) {
        auto fragment = base.find('#');
        if (fragment != std::string::npos)
            base.resize(fragment);
        return base + reference;
    }
    auto scheme = base.find("://");
    auto slash = base.find('/', scheme == std::string::npos ? 0 : scheme + 3);
    auto origin = slash == std::string::npos ? base.size() : slash;
    if (reference.starts_with('/'))
        return base.substr(0, origin) + reference;
    return base.substr(0, base.rfind('/') + 1) + reference;
}

static std::string normalize(const lxb_char_t *value, size_t length) {
    std::string output;
    bool pending = false;
    for (size_t i = 0; i < length; i++) {
        unsigned char c = value[i];
        bool space = c == '\t' || c == '\n' || c == '\f' || c == '\r' || c == ' ';
        if (space) {
            pending = !output.empty();
            continue;
        }
        if (pending)
            output += ' ';
        pending = false;
        output += static_cast<char>(c);
    }
    return output;
}

static void find_canonical(lxb_dom_node_t *node, std::vector<std::string> &canonicals) {
    if (node->type == LXB_DOM_NODE_TYPE_ELEMENT) {
        auto element = lxb_dom_interface_element(node);
        if (tag_is(element, "link") && attr(element, "rel") == "canonical") {
            canonicals.push_back(attr(element, "href"));
        }
    }

    for (auto child = node->first_child; child != nullptr; child = child->next) {
        find_canonical(child, canonicals);
    }
}

static void collect(lxb_dom_node_t *node, const std::string &source,
                    std::vector<Row> &rows) {
    bool inside_template = false;
    if (node->type == LXB_DOM_NODE_TYPE_ELEMENT) {
        auto element = lxb_dom_interface_element(node);
        inside_template = tag_is(element, "template");

        if (has_attr(element, "rdf-predicate")) {
            auto subject = resolve(source, attr(element, "rdf-subject"));
            auto predicate = resolve(source, attr(element, "rdf-predicate"));

            // The generated profile identifies a native attribute carrying the value.
            const CarrierRule *carrier = nullptr;
            for (const auto &rule : CARRIER_RULES) {
                if (tag_is(element, rule.element) && has_attr(element, rule.attribute.data())) {
                    if (carrier != nullptr) {
                        throw std::runtime_error("Conflicting value carriers");
                    }
                    carrier = &rule;
                }
            }

            // IRI carrier values are references resolved against the semantic source.
            if (carrier != nullptr && carrier->kind == "iri") {
                auto object = resolve(source, attr(element, carrier->attribute.data()));
                rows.push_back({subject, predicate, "I", object, "", "", ""});
            } else {
                // Literal carriers are exact; other elements use normalized text.
                std::string value;
                if (carrier != nullptr && carrier->kind == "literal") {
                    value = attr(element, carrier->attribute.data());
                } else {
                    size_t length = 0;
                    auto text = lxb_dom_node_text_content(node, &length);
                    value = normalize(text, length);
                }

                // lang and dir apply only when directly present on this carrier.
                auto language = attr(element, "lang");
                auto direction = attr(element, "dir");
                std::ranges::transform(direction, direction.begin(),
                                       [](unsigned char c) { return std::tolower(c); });
                if (direction != "ltr" && direction != "rtl") {
                    direction.clear();
                }

                // Explicit datatype wins; direction otherwise selects dirLangString.
                std::string datatype = direction.empty() ? XSD_STRING : RDF_DIR_LANG_STRING;
                if (has_attr(element, "rdf-datatype")) {
                    datatype = resolve(source, attr(element, "rdf-datatype"));
                }
                rows.push_back(
                    {subject, predicate, "L", value, datatype, language, direction});
            }
        }
    }

    if (!inside_template) {
        for (auto child = node->first_child; child != nullptr; child = child->next) {
            collect(child, source, rows);
        }
    }
}

int main(int argc, char **argv) {
    if (argc != 2) {
        return 1;
    }

    // Fetch and parse the document as HTML.
    std::string html;
    auto curl = curl_easy_init();
    curl_easy_setopt(curl, CURLOPT_URL, argv[1]);
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, receive);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &html);
    if (curl_easy_perform(curl) != CURLE_OK) {
        return 1;
    }
    char *retrieval = nullptr;
    curl_easy_getinfo(curl, CURLINFO_EFFECTIVE_URL, &retrieval);
    auto document = lxb_html_document_create();
    if (document == nullptr ||
        lxb_html_document_parse(document, reinterpret_cast<const lxb_char_t *>(html.data()),
                                html.size()) != LXB_STATUS_OK) {
        return 1;
    }

    // Resolve semantic references against the one canonical source IRI.
    std::vector<std::string> canonicals;
    find_canonical(lxb_dom_interface_node(document), canonicals);
    if (canonicals.size() != 1) {
        throw std::runtime_error("Expected one canonical link");
    }
    auto source = resolve(retrieval, canonicals.front());

    // Walk the tree to find every locally complete statement carrier.
    std::vector<Row> rows;
    collect(lxb_dom_interface_node(document), source, rows);
    std::ranges::sort(rows, {}, [](const Row &row) { return row[1]; });

    for (const auto &row : rows) {
        for (size_t i = 0; i < row.size(); i++) {
            std::cout << row[i] << (i + 1 == row.size() ? '\n' : '\t');
        }
    }
    lxb_html_document_destroy(document);
    curl_easy_cleanup(curl);
    return 0;
}
