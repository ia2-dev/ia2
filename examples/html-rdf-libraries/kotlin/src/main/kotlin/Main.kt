import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import java.net.URI
import kotlinx.coroutines.runBlocking
import org.jsoup.Jsoup

private const val XSD_STRING = "http://www.w3.org/2001/XMLSchema#string"
private const val RDF_DIR_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString"
private fun resolve(base: String, reference: String) =
    URI.create(base).resolve(reference).toString()

fun main(args: Array<String>) = runBlocking {
    HttpClient(CIO) { followRedirects = true }.use { client ->
        // Fetch and parse the document as HTML.
        val response = client.get(args[0])
        val retrievalIri = response.call.request.url.toString()
        val document = Jsoup.parse(response.bodyAsText(), retrievalIri)

        // Resolve semantic references against the one canonical source IRI.
        val canonical = document.select("head link[rel][href]").filter {
            it.attr("rel").split(Regex("\\s+")).any { token ->
                token.equals("canonical", ignoreCase = true)
            }
        }
        require(canonical.size == 1) { "Expected one canonical link" }
        val sourceIri = resolve(retrievalIri, canonical.first()!!.attr("href"))

        // A normal attribute selector finds every locally complete carrier.
        val rows = document.select("[rdf-predicate]").asSequence()
            .filterNot { it.parents().any { parent -> parent.normalName() == "template" } }
            .map { element ->
                val subject = resolve(sourceIri, element.attr("rdf-subject"))
                val predicate = resolve(sourceIri, element.attr("rdf-predicate"))

                // The generated profile identifies any native attribute carrying the value.
                val valueCarriers = carrierRules.filter { rule ->
                    rule.element == element.normalName() && element.hasAttr(rule.attribute)
                }
                require(valueCarriers.size <= 1) {
                    "Conflicting value carriers on <${element.normalName()}>"
                }
                val carrier = valueCarriers.singleOrNull()

                // IRI carrier values are references; resolve them against the semantic source.
                if (carrier?.kind == "iri") {
                    val objectIri = resolve(sourceIri, element.attr(carrier.attribute))
                    listOf(subject, predicate, "I", objectIri, "", "", "")
                } else {
                    // Literal carriers are exact strings. Other elements use normalized text.
                    val value = carrier?.takeIf { it.kind == "literal" }
                        ?.let { element.attr(it.attribute) } ?: element.text()

                    // lang and dir apply only when directly present on this carrier.
                    val language = element.attr("lang")
                    val direction = element.attr("dir").lowercase()
                        .takeIf { it == "ltr" || it == "rtl" } ?: ""

                    // An explicit datatype wins; direction otherwise selects dirLangString.
                    val datatype = when {
                        element.hasAttr("rdf-datatype") ->
                            resolve(sourceIri, element.attr("rdf-datatype"))
                        direction.isNotEmpty() -> RDF_DIR_LANG_STRING
                        else -> XSD_STRING
                    }
                    listOf(subject, predicate, "L", value, datatype, language, direction)
                }
            }.sortedBy { it[1] }
        rows.forEach { println(it.joinToString("\t")) }
    }
}
