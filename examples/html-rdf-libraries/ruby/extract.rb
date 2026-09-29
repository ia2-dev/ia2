# frozen_string_literal: true

require "faraday"
require "nokogiri"
require "uri"
require_relative "carrier_profile"

XSD_STRING = "http://www.w3.org/2001/XMLSchema#string"
RDF_DIR_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString"

# Fetch and parse the document as HTML5.
response = Faraday.get(ARGV.fetch(0))
raise "HTTP #{response.status}" unless response.success?
retrieval_iri = response.env.url.to_s
document = Nokogiri::HTML5(response.body, url: retrieval_iri)

# Resolve semantic references against the one canonical source IRI.
canonical = document.css("head link[rel][href]").select do |link|
  link["rel"].split.any? { |token| token.casecmp?("canonical") }
end
raise "Expected one canonical link" unless canonical.one?
source_iri = URI.join(retrieval_iri, canonical.first["href"]).to_s

# A normal attribute selector finds every locally complete carrier.
carriers = document.css("[rdf-predicate]").reject do |element|
  element.ancestors("template").any?
end

rows = carriers.map do |element|
  subject = URI.join(source_iri, element["rdf-subject"]).to_s
  predicate = URI.join(source_iri, element["rdf-predicate"]).to_s

  # The generated profile identifies any native attribute carrying the value.
  value_carriers = CARRIER_RULES.select do |rule|
    rule[0] == element.name && element.key?(rule[1])
  end
  raise "Conflicting value carriers on <#{element.name}>" if value_carriers.length > 1
  carrier = value_carriers.first

  # IRI carrier values are references; resolve them against the semantic source.
  if carrier && carrier[2] == "iri"
    object_iri = URI.join(source_iri, element[carrier[1]]).to_s
    [subject, predicate, "I", object_iri, "", "", ""]
  else
    # Literal carriers are exact strings. Other elements use normalized visible text.
    value = if carrier && carrier[2] == "literal"
              element[carrier[1]]
            else
              element.text.gsub(/[\t\n\f\r ]+/, " ").strip
            end

    # lang and dir apply only when directly present on this carrier.
    language = element["lang"] || ""
    raw_direction = (element["dir"] || "").downcase
    direction = %w[ltr rtl].include?(raw_direction) ? raw_direction : ""

    # An explicit datatype wins; direction otherwise selects rdf:dirLangString.
    datatype = direction.empty? ? XSD_STRING : RDF_DIR_LANG_STRING
    if element.key?("rdf-datatype")
      datatype = URI.join(source_iri, element["rdf-datatype"]).to_s
    end
    [subject, predicate, "L", value, datatype, language, direction]
  end
end
rows.sort_by { |row| row[1] }.each do |row|
  puts row.join("\t")
end
