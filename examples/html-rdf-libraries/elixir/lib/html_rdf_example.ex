defmodule HtmlRdfExample do
  @xsd_string "http://www.w3.org/2001/XMLSchema#string"
  @rdf_dir_lang_string "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString"

  def main([url]) do
    # Fetch and parse the document as HTML5.
    response = Req.get!(url)
    {:ok, document} = Floki.parse_document(response.body, html_parser: Floki.HTMLParser.Html5ever)

    # Resolve semantic references against the one canonical source IRI.
    canonical =
      document
      |> Floki.find("head link[rel][href]")
      |> Enum.filter(fn {_tag, attrs, _children} ->
        attrs
        |> attr("rel")
        |> String.split()
        |> Enum.any?(fn token -> String.downcase(token) == "canonical" end)
      end)

    if length(canonical) != 1 do
      raise "Expected one canonical link"
    end

    {_tag, canonical_attrs, _children} = hd(canonical)
    source_iri = resolve(url, attr(canonical_attrs, "href"))

    # Attribute-name discovery finds every locally complete carrier.
    document
    |> collect_statements()
    |> Enum.map(&row(&1, source_iri))
    |> Enum.sort_by(&Enum.at(&1, 1))
    |> Enum.each(&IO.puts(Enum.join(&1, "\t")))
  end

  defp collect_statements(nodes) when is_list(nodes) do
    Enum.flat_map(nodes, &collect_statements/1)
  end

  defp collect_statements({"template", _attrs, _children}), do: []

  defp collect_statements({tag, attrs, children} = node) when is_binary(tag) do
    own = if attr(attrs, "rdf-predicate") == "", do: [], else: [node]
    own ++ collect_statements(children)
  end

  defp collect_statements(_node), do: []

  defp row({tag, attrs, _children} = node, source_iri) do
    subject = resolve(source_iri, attr(attrs, "rdf-subject"))
    predicate = resolve(source_iri, attr(attrs, "rdf-predicate"))

    # The generated profile identifies any native attribute carrying the value.
    carriers =
      CarrierProfile.rules()
      |> Enum.filter(fn {element, attribute, _kind, _operation} ->
        element == tag and has_attr?(attrs, attribute)
      end)

    if length(carriers) > 1 do
      raise "Conflicting value carriers on <#{tag}>"
    end

    carrier = List.first(carriers)

    # IRI carrier values are references; resolve them against the semantic source.
    if carrier != nil and elem(carrier, 2) == "iri" do
      attribute = elem(carrier, 1)
      [subject, predicate, "I", resolve(source_iri, attr(attrs, attribute)), "", "", ""]
    else
      # Literal carriers are exact strings. Other elements use normalized visible text.
      value =
        if carrier != nil and elem(carrier, 2) == "literal" do
          attr(attrs, elem(carrier, 1))
        else
          node |> Floki.text() |> normalize()
        end

      # lang and dir apply only when directly present on this carrier.
      language = attr(attrs, "lang")
      raw_direction = attrs |> attr("dir") |> String.downcase()
      direction = if raw_direction in ["ltr", "rtl"], do: raw_direction, else: ""

      # An explicit datatype wins; direction otherwise selects rdf:dirLangString.
      datatype =
        cond do
          attr(attrs, "rdf-datatype") != "" -> resolve(source_iri, attr(attrs, "rdf-datatype"))
          direction != "" -> @rdf_dir_lang_string
          true -> @xsd_string
        end

      [subject, predicate, "L", value, datatype, language, direction]
    end
  end

  defp attr(attrs, name) do
    Enum.find_value(attrs, "", fn {key, value} ->
      if key == name, do: value
    end)
  end

  defp has_attr?(attrs, name), do: Enum.any?(attrs, fn {key, _value} -> key == name end)

  defp normalize(value), do: value |> String.replace(~r/[\t\n\f\r ]+/, " ") |> String.trim()
  defp resolve(base, reference), do: base |> URI.parse() |> URI.merge(reference) |> to_string()
end
