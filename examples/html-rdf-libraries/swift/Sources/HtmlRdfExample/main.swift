import Foundation
#if canImport(FoundationNetworking)
import FoundationNetworking
#endif
import SwiftSoup

let xsdString = "http://www.w3.org/2001/XMLSchema#string"
let rdfDirLangString = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString"

func resolve(_ base: String, _ reference: String) throws -> String {
    guard let baseUrl = URL(string: base),
          let result = URL(string: reference, relativeTo: baseUrl)?.absoluteURL else {
        throw URLError(.badURL)
    }
    return result.absoluteString
}

struct HtmlRdfExample {
    static func run() async throws {
        // Fetch and parse the document as HTML.
        let inputURL = URL(string: CommandLine.arguments[1])!
        let (data, response) = try await URLSession.shared.data(from: inputURL)
        guard let http = response as? HTTPURLResponse,
              (200..<300).contains(http.statusCode) else {
            throw URLError(.badServerResponse)
        }
        let retrievalIri = response.url!.absoluteString
        let document = try SwiftSoup.parseHTML(data, retrievalIri)

        // Resolve semantic references against the one canonical source IRI.
        let canonical = try document.select("head link[rel][href]").array().filter { link in
            try link.attr("rel")
                .split(whereSeparator: { $0.isWhitespace })
                .contains { $0.lowercased() == "canonical" }
        }
        guard canonical.count == 1 else {
            throw NSError(
                domain: "HtmlRdfExample",
                code: 1,
                userInfo: [NSLocalizedDescriptionKey: "Expected one canonical link"]
            )
        }
        let sourceIri = try resolve(retrievalIri, canonical[0].attr("href"))

        // A normal attribute selector finds every locally complete carrier.
        var rows: [[String]] = []
        for element in try document.select("[rdf-predicate]").array() {
            let insideTemplate = element.parents().array().contains { $0.tagName() == "template" }
            if insideTemplate { continue }
            let subject = try resolve(sourceIri, element.attr("rdf-subject"))
            let predicate = try resolve(sourceIri, element.attr("rdf-predicate"))

            // The generated profile identifies any native attribute carrying the value.
            let valueCarriers = CarrierProfile.rules.filter { rule in
                rule.element == element.tagName() && element.hasAttr(rule.attribute)
            }
            guard valueCarriers.count <= 1 else {
                throw NSError(
                    domain: "HtmlRdfExample",
                    code: 2,
                    userInfo: [NSLocalizedDescriptionKey:
                        "Conflicting value carriers on <\(element.tagName())>"]
                )
            }
            let carrier = valueCarriers.first

            // IRI carrier values are references; resolve them against the semantic source.
            if let carrier, carrier.kind == "iri" {
                let objectIri = try resolve(sourceIri, element.attr(carrier.attribute))
                rows.append([subject, predicate, "I", objectIri, "", "", ""])
                continue
            }

            // Literal carriers are exact strings. Other elements use normalized text.
            let value: String
            if let carrier, carrier.kind == "literal" {
                value = try element.attr(carrier.attribute)
            } else {
                value = try element.text()
            }

            // lang and dir apply only when directly present on this carrier.
            let language = try element.attr("lang")
            let rawDirection = try element.attr("dir").lowercased()
            let direction = ["ltr", "rtl"].contains(rawDirection) ? rawDirection : ""

            // An explicit datatype wins; direction otherwise selects rdf:dirLangString.
            let datatype: String
            if element.hasAttr("rdf-datatype") {
                datatype = try resolve(sourceIri, element.attr("rdf-datatype"))
            } else {
                datatype = direction.isEmpty ? xsdString : rdfDirLangString
            }
            rows.append([subject, predicate, "L", value, datatype, language, direction])
        }
        for row in rows.sorted(by: { $0[1] < $1[1] }) {
            print(row.joined(separator: "\t"))
        }
    }
}

try await HtmlRdfExample.run()
