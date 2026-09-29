using System.Text.RegularExpressions;
using AngleSharp.Dom;
using AngleSharp.Html.Parser;

const string XsdString = "http://www.w3.org/2001/XMLSchema#string";
const string RdfDirLangString = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString";

static string Resolve(string baseIri, string reference) =>
    new Uri(new Uri(baseIri), reference).AbsoluteUri;
static bool InsideTemplate(IElement element)
{
    for (var parent = element.ParentElement; parent is not null; parent = parent.ParentElement)
    {
        if (parent.LocalName == "template")
        {
            return true;
        }
    }
    return false;
}

// Fetch and parse the document as HTML.
using var client = new HttpClient(new HttpClientHandler { AllowAutoRedirect = true });
using var response = await client.GetAsync(args[0]);
response.EnsureSuccessStatusCode();
var retrievalIri = response.RequestMessage!.RequestUri!.AbsoluteUri;
var html = await response.Content.ReadAsStringAsync();
var document = await new HtmlParser().ParseDocumentAsync(html);

// Resolve semantic references against the one canonical source IRI.
var canonical = document.Head!.QuerySelectorAll("link[rel][href]")
    .Where(link => link.GetAttribute("rel")!
        .Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries)
        .Any(token => token.Equals("canonical", StringComparison.OrdinalIgnoreCase)))
    .ToList();
if (canonical.Count != 1)
{
    throw new InvalidOperationException("Expected one canonical link");
}
var sourceIri = Resolve(retrievalIri, canonical[0].GetAttribute("href")!);

// A normal attribute selector finds every locally complete carrier.
var rows = new List<string[]>();
var carriers = document.QuerySelectorAll("[rdf-predicate]")
    .Where(element => !InsideTemplate(element));
foreach (var element in carriers)
{
    var subject = Resolve(sourceIri, element.GetAttribute("rdf-subject")!);
    var predicate = Resolve(sourceIri, element.GetAttribute("rdf-predicate")!);

    // The generated profile identifies any native attribute that carries the value.
    var valueCarriers = CarrierProfile.Rules
        .Where(rule => rule.Element == element.LocalName && element.HasAttribute(rule.Attribute))
        .ToList();
    if (valueCarriers.Count > 1)
    {
        throw new InvalidOperationException($"Conflicting value carriers on <{element.LocalName}>");
    }
    CarrierRule? carrier = valueCarriers.Count == 0 ? null : valueCarriers[0];

    // IRI carrier values are references; resolve them against the semantic source.
    if (carrier is { Kind: "iri" } iriCarrier)
    {
        var objectIri = Resolve(sourceIri, element.GetAttribute(iriCarrier.Attribute)!);
        rows.Add([subject, predicate, "I", objectIri, "", "", ""]);
        continue;
    }

    // Literal carriers are exact strings. Other elements use normalized visible text.
    var value = carrier is { Kind: "literal" } literalCarrier
        ? element.GetAttribute(literalCarrier.Attribute)!
        : Regex.Replace(element.TextContent, "[\\t\\n\\f\\r ]+", " ").Trim();

    // lang and dir apply only when directly present on this carrier.
    var language = element.GetAttribute("lang") ?? "";
    var rawDirection = (element.GetAttribute("dir") ?? "").ToLowerInvariant();
    var direction = rawDirection is "ltr" or "rtl" ? rawDirection : "";

    // An explicit datatype wins; direction otherwise selects rdf:dirLangString.
    var datatype = direction.Length > 0 ? RdfDirLangString : XsdString;
    if (element.HasAttribute("rdf-datatype"))
    {
        datatype = Resolve(sourceIri, element.GetAttribute("rdf-datatype")!);
    }
    rows.Add([subject, predicate, "L", value, datatype, language, direction]);
}
foreach (var row in rows.OrderBy(row => row[1]))
{
    Console.WriteLine(string.Join('\t', row));
}
