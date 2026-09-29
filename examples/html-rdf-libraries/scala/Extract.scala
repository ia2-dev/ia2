//> using scala "3.7.1"
//> using dep "com.softwaremill.sttp.client3::core:3.11.0"
//> using dep "org.jsoup:jsoup:1.22.2"

import java.net.URI
import org.jsoup.Jsoup
import scala.jdk.CollectionConverters.*
import sttp.client3.*

@main def extract(url: String): Unit =
  // Fetch and parse the document as HTML.
  val backend = HttpURLConnectionBackend()
  val response = basicRequest.get(uri"$url").send(backend)
  val body = response.body.fold(error => throw RuntimeException(error), identity)
  val retrievalIri = url
  val document = Jsoup.parse(body, retrievalIri)

  // Resolve semantic references against the one canonical source IRI.
  val canonical = document.select("head link[rel][href]").asScala.filter { link =>
    link.attr("rel").split("\\s+").exists(_.equalsIgnoreCase("canonical"))
  }
  require(canonical.size == 1, "Expected one canonical link")
  def resolve(base: String, reference: String) = URI.create(base).resolve(reference).toString
  val sourceIri = resolve(retrievalIri, canonical.head.attr("href"))
  val xsdString = "http://www.w3.org/2001/XMLSchema#string"
  val rdfDirLangString = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString"

  // A normal attribute selector finds every locally complete carrier.
  val rows = document.select("[rdf-predicate]").asScala
    .filterNot(_.parents().asScala.exists(_.normalName() == "template"))
    .map { element =>
      val subject = resolve(sourceIri, element.attr("rdf-subject"))
      val predicate = resolve(sourceIri, element.attr("rdf-predicate"))

      // The generated profile identifies any native attribute that carries the value.
      val carriers = carrierRules.filter { rule =>
        rule.element == element.normalName() && element.hasAttr(rule.attribute)
      }
      require(carriers.size <= 1, s"Conflicting value carriers on <${element.normalName()}>")
      val carrier = carriers.headOption

      // IRI carrier values are references; resolve them against the semantic source.
      if carrier.exists(_.kind == "iri") then
        val objectIri = resolve(sourceIri, element.attr(carrier.get.attribute))
        Seq(subject, predicate, "I", objectIri, "", "", "")
      else
        // Literal carriers are exact strings. Other elements use normalized visible text.
        val value = carrier.filter(_.kind == "literal")
          .map(rule => element.attr(rule.attribute))
          .getOrElse(element.text())

        // lang and dir apply only when directly present on this carrier.
        val language = element.attr("lang")
        val rawDirection = element.attr("dir").toLowerCase
        val direction = if rawDirection == "ltr" || rawDirection == "rtl" then rawDirection else ""

        // An explicit datatype wins; direction otherwise selects rdf:dirLangString.
        val datatype =
          if element.hasAttr("rdf-datatype") then
            resolve(sourceIri, element.attr("rdf-datatype"))
          else if direction.nonEmpty then
            rdfDirLangString
          else
            xsdString
        Seq(subject, predicate, "L", value, datatype, language, direction)
    }.sortBy(_(1))
  rows.foreach(row => println(row.mkString("\t")))
  backend.close()
