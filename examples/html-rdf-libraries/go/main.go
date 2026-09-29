package main

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"golang.org/x/net/html/charset"
)

const xsdString = "http://www.w3.org/2001/XMLSchema#string"
const rdfDirLangString = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString"

func resolve(base, reference string) string {
	b, err := url.Parse(base)
	if err != nil {
		panic(err)
	}
	r, err := url.Parse(reference)
	if err != nil {
		panic(err)
	}
	return b.ResolveReference(r).String()
}

func main() {
	// Fetch and parse the document as HTML.
	response, err := http.Get(os.Args[1])
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		panic(response.Status)
	}
	reader, err := charset.NewReader(response.Body, response.Header.Get("Content-Type"))
	if err != nil {
		panic(err)
	}
	document, err := goquery.NewDocumentFromReader(reader)
	if err != nil {
		panic(err)
	}

	// Resolve semantic references against the one canonical source IRI.
	var canonical []string
	document.Find("head link[rel][href]").Each(func(_ int, selection *goquery.Selection) {
		rel, _ := selection.Attr("rel")
		for _, token := range strings.Fields(strings.ToLower(rel)) {
			if token == "canonical" {
				href, _ := selection.Attr("href")
				canonical = append(canonical, href)
			}
		}
	})
	if len(canonical) != 1 {
		panic("expected one canonical link")
	}
	sourceIRI := resolve(response.Request.URL.String(), canonical[0])

	// A normal attribute selector finds every locally complete carrier.
	rows := make([][]string, 0, 4)
	document.Find("[rdf-predicate]").Each(func(_ int, element *goquery.Selection) {
		if element.ParentsFiltered("template").Length() != 0 {
			return
		}
		subjectRef, _ := element.Attr("rdf-subject")
		predicateRef, _ := element.Attr("rdf-predicate")
		subject := resolve(sourceIRI, subjectRef)
		predicate := resolve(sourceIRI, predicateRef)

		// The generated profile identifies any native attribute carrying the value.
		var carriers []carrierRule
		for _, rule := range carrierRules {
			_, present := element.Attr(rule.attribute)
			if rule.element == goquery.NodeName(element) && present {
				carriers = append(carriers, rule)
			}
		}
		if len(carriers) > 1 {
			panic("conflicting value carriers on <" + goquery.NodeName(element) + ">")
		}
		var carrier *carrierRule
		if len(carriers) == 1 {
			carrier = &carriers[0]
		}

		// IRI carrier values are references; resolve them against the semantic source.
		if carrier != nil && carrier.kind == "iri" {
			value, _ := element.Attr(carrier.attribute)
			rows = append(rows, []string{subject, predicate, "I", resolve(sourceIRI, value), "", "", ""})
			return
		}

		// Literal carriers are exact strings. Other elements use normalized text.
		value := element.Text()
		if carrier != nil && carrier.kind == "literal" {
			value, _ = element.Attr(carrier.attribute)
		} else {
			value = strings.Join(strings.Fields(value), " ")
		}

		// lang and dir apply only when directly present on this carrier.
		language, _ := element.Attr("lang")
		direction, _ := element.Attr("dir")
		direction = strings.ToLower(direction)
		if direction != "ltr" && direction != "rtl" {
			direction = ""
		}

		// An explicit datatype wins; direction otherwise selects rdf:dirLangString.
		datatype := xsdString
		if declared, ok := element.Attr("rdf-datatype"); ok {
			datatype = resolve(sourceIRI, declared)
		} else if direction != "" {
			datatype = rdfDirLangString
		}
		rows = append(rows, []string{subject, predicate, "L", value, datatype, language, direction})
	})
	sort.Slice(rows, func(i, j int) bool { return rows[i][1] < rows[j][1] })
	for _, row := range rows {
		fmt.Println(strings.Join(row, "\t"))
	}
}
