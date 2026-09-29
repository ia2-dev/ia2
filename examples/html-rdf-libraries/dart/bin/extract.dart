import 'package:html/dom.dart';
import 'package:html/parser.dart' show parse;
import 'package:html_rdf_library_example/carrier_profile.dart';
import 'package:http/http.dart' as http;

const xsdString = 'http://www.w3.org/2001/XMLSchema#string';
const rdfDirLangString = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString';

bool insideTemplate(Element element) {
  for (var parent = element.parent; parent != null; parent = parent.parent) {
    if (parent.localName == 'template') {
      return true;
    }
  }
  return false;
}

Future<void> main(List<String> args) async {
  // Fetch and parse the document as HTML.
  final response = await http.get(Uri.parse(args[0]));
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw StateError('HTTP ${response.statusCode}');
  }
  final retrievalIri = response.request!.url;
  final document = parse(response.bodyBytes, sourceUrl: retrievalIri.toString());

  // Resolve semantic references against the one canonical source IRI.
  final canonical = document
      .querySelectorAll('head link[rel][href]')
      .where((link) => link.attributes['rel']!
          .split(RegExp(r'\s+'))
          .any((token) => token.toLowerCase() == 'canonical'))
      .toList();
  if (canonical.length != 1) {
    throw StateError('Expected one canonical link');
  }
  final sourceIri = retrievalIri.resolve(canonical.single.attributes['href']!);

  // A normal attribute selector finds every locally complete carrier.
  final rows = <List<String>>[];
  final carriers = document
      .querySelectorAll('[rdf-predicate]')
      .where((element) => !insideTemplate(element));
  for (final element in carriers) {
    final subject = sourceIri.resolve(element.attributes['rdf-subject']!).toString();
    final predicate = sourceIri.resolve(element.attributes['rdf-predicate']!).toString();

    // The generated profile identifies any native attribute carrying the value.
    final valueCarriers = carrierRules
        .where((rule) => rule.element == element.localName &&
            element.attributes.containsKey(rule.attribute))
        .toList();
    if (valueCarriers.length > 1) {
      throw StateError('Conflicting value carriers on <${element.localName}>');
    }
    final carrier = valueCarriers.isEmpty ? null : valueCarriers.first;

    // IRI carrier values are references; resolve them against the semantic source.
    if (carrier?.kind == 'iri') {
      final objectIri = sourceIri
          .resolve(element.attributes[carrier!.attribute]!)
          .toString();
      rows.add([subject, predicate, 'I', objectIri, '', '', '']);
      continue;
    }

    // Literal carriers are exact strings. Other elements use normalized visible text.
    final value = carrier?.kind == 'literal'
        ? element.attributes[carrier!.attribute]!
        : element.text.replaceAll(RegExp(r'[\t\n\f\r ]+'), ' ').trim();

    // lang and dir apply only when directly present on this carrier.
    final language = element.attributes['lang'] ?? '';
    final rawDirection = (element.attributes['dir'] ?? '').toLowerCase();
    final direction = rawDirection == 'ltr' || rawDirection == 'rtl' ? rawDirection : '';

    // An explicit datatype wins; direction otherwise selects rdf:dirLangString.
    final datatype = element.attributes.containsKey('rdf-datatype')
      ? sourceIri.resolve(element.attributes['rdf-datatype']!).toString()
      : direction.isNotEmpty ? rdfDirLangString : xsdString;
    rows.add([subject, predicate, 'L', value, datatype, language, direction]);
  }
  rows.sort((left, right) => left[1].compareTo(right[1]));
  for (final row in rows) {
    print(row.join('\t'));
  }
}
