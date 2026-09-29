package dev.ia2.example;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public final class Extract {
  private static final String XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
  private static final String RDF_DIR_LANG_STRING =
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString";

  private static String resolve(String base, String reference) {
    return URI.create(base).resolve(reference).toString();
  }

  public static void main(String[] args) throws Exception {
    // Fetch and parse the document as HTML.
    var client = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NORMAL).build();
    var request = HttpRequest.newBuilder(URI.create(args[0])).GET().build();
    var response = client.send(request, HttpResponse.BodyHandlers.ofByteArray());
    if (response.statusCode() < 200 || response.statusCode() >= 300) {
      throw new IllegalStateException("HTTP " + response.statusCode());
    }
    var html = new String(response.body(), StandardCharsets.UTF_8);
    Document document = Jsoup.parse(html, response.uri().toString());

    // HTML/RDF resolves semantic references against one canonical source IRI.
    List<Element> canonical = document.select("head link[rel][href]").stream()
        .filter(link -> List.of(link.attr("rel").split("\\s+")).stream()
            .anyMatch("canonical"::equalsIgnoreCase))
        .toList();
    if (canonical.size() != 1) {
      throw new IllegalStateException("Expected one canonical link");
    }
    String sourceIri = resolve(response.uri().toString(), canonical.get(0).attr("href"));

    // A normal attribute selector finds every locally complete carrier.
    List<List<String>> rows = new ArrayList<>();
    for (Element element : document.select("[rdf-predicate]")) {
      boolean insideTemplate = element.parents().stream()
          .anyMatch(parent -> parent.normalName().equals("template"));
      if (insideTemplate) {
        continue;
      }
      String subject = resolve(sourceIri, element.attr("rdf-subject"));
      String predicate = resolve(sourceIri, element.attr("rdf-predicate"));

      // The generated profile identifies any native attribute that carries the value.
      List<CarrierRule> carriers = CarrierProfile.RULES.stream()
          .filter(rule -> rule.element().equals(element.normalName()))
          .filter(rule -> element.hasAttr(rule.attribute()))
          .toList();
      if (carriers.size() > 1) {
        throw new IllegalStateException("Conflicting value carriers on <"
            + element.normalName() + ">");
      }
      CarrierRule carrier = carriers.isEmpty() ? null : carriers.get(0);

      // IRI carrier values are references; resolve them against the semantic source.
      if (carrier != null && carrier.kind().equals("iri")) {
        String objectIri = resolve(sourceIri, element.attr(carrier.attribute()));
        rows.add(List.of(subject, predicate, "I", objectIri, "", "", ""));
        continue;
      }

      // Literal carriers are exact strings. Other elements use normalized visible text.
      String value = carrier != null && carrier.kind().equals("literal")
          ? element.attr(carrier.attribute())
          : element.text();

      // lang and dir apply only when directly present on this carrier.
      String language = element.attr("lang");
      String direction = element.attr("dir").toLowerCase();
      if (!direction.equals("ltr") && !direction.equals("rtl")) {
        direction = "";
      }

      // An explicit datatype wins; direction otherwise selects rdf:dirLangString.
      String datatype = direction.isEmpty() ? XSD_STRING : RDF_DIR_LANG_STRING;
      if (element.hasAttr("rdf-datatype")) {
        datatype = resolve(sourceIri, element.attr("rdf-datatype"));
      }
      rows.add(List.of(subject, predicate, "L", value, datatype, language, direction));
    }
    rows.sort(Comparator.comparing(row -> row.get(1)));
    rows.forEach(row -> System.out.println(String.join("\t", row)));
  }
}
