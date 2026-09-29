mod carrier_profile;

use carrier_profile::CARRIER_RULES;
use scraper::{ElementRef, Html, Selector};
use std::error::Error;
use url::Url;

const XSD_STRING: &str = "http://www.w3.org/2001/XMLSchema#string";
const RDF_DIR_LANG_STRING: &str = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString";

fn normalize(value: &str) -> String {
    value.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn inside_template(element: &ElementRef<'_>) -> bool {
    element
        .ancestors()
        .skip(1)
        .filter_map(ElementRef::wrap)
        .any(|ancestor| ancestor.value().name() == "template")
}

fn main() -> Result<(), Box<dyn Error>> {
    // Fetch and parse the document as HTML.
    let response = reqwest::blocking::get(std::env::args().nth(1).ok_or("missing URL")?)?
        .error_for_status()?;
    let retrieval_iri = response.url().clone();
    let document = Html::parse_document(&response.text()?);

    // Resolve semantic references against the one canonical source IRI.
    let links = Selector::parse("head link[rel][href]").unwrap();
    let canonical: Vec<_> = document
        .select(&links)
        .filter(|element| {
            element
                .value()
                .attr("rel")
                .unwrap_or("")
                .split_ascii_whitespace()
                .any(|token| token.eq_ignore_ascii_case("canonical"))
        })
        .collect();
    if canonical.len() != 1 {
        return Err("expected one canonical link".into());
    }
    let source_iri = retrieval_iri.join(canonical[0].value().attr("href").unwrap())?;

    // A normal attribute selector finds every locally complete carrier.
    let statements = Selector::parse("[rdf-predicate]").unwrap();
    let mut rows: Vec<Vec<String>> = Vec::new();
    for element in document
        .select(&statements)
        .filter(|element| !inside_template(element))
    {
        let subject = source_iri
            .join(element.value().attr("rdf-subject").unwrap())?
            .to_string();
        let predicate = source_iri
            .join(element.value().attr("rdf-predicate").unwrap())?
            .to_string();

        // The generated profile identifies any native attribute carrying the value.
        let carriers: Vec<_> = CARRIER_RULES
            .iter()
            .filter(|rule| {
                rule.element == element.value().name()
                    && element.value().attr(rule.attribute).is_some()
            })
            .collect();
        if carriers.len() > 1 {
            return Err(
                format!("conflicting value carriers on <{}>", element.value().name()).into(),
            );
        }
        let carrier = carriers.first().copied();

        // IRI carrier values are references; resolve them against the semantic source.
        if let Some(rule) = carrier.filter(|rule| rule.kind == "iri") {
            let object = source_iri
                .join(element.value().attr(rule.attribute).unwrap())?
                .to_string();
            rows.push(vec![
                subject,
                predicate,
                "I".into(),
                object,
                "".into(),
                "".into(),
                "".into(),
            ]);
            continue;
        }

        // Literal carriers are exact strings. Other elements use normalized visible text.
        let value = if let Some(rule) = carrier.filter(|rule| rule.kind == "literal") {
            element.value().attr(rule.attribute).unwrap().to_owned()
        } else {
            normalize(&element.text().collect::<String>())
        };

        // lang and dir apply only when directly present on this carrier.
        let language = element.value().attr("lang").unwrap_or("").to_owned();
        let direction = match element
            .value()
            .attr("dir")
            .unwrap_or("")
            .to_ascii_lowercase()
            .as_str()
        {
            "ltr" => "ltr",
            "rtl" => "rtl",
            _ => "",
        }
        .to_owned();

        // An explicit datatype wins; direction otherwise selects rdf:dirLangString.
        let datatype = match element.value().attr("rdf-datatype") {
            Some(value) => source_iri.join(value)?.to_string(),
            None if !direction.is_empty() => RDF_DIR_LANG_STRING.into(),
            None => XSD_STRING.into(),
        };
        rows.push(vec![
            subject,
            predicate,
            "L".into(),
            value,
            datatype,
            language,
            direction,
        ]);
    }
    rows.sort_by(|left, right| left[1].cmp(&right[1]));
    for row in rows {
        println!("{}", row.join("\t"));
    }
    let _: Url = source_iri;
    Ok(())
}
