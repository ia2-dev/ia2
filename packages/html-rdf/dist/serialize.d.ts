import { type ExtractionResult, type GraphTerm, type ObjectTerm, type SubjectTerm } from "./model.js";
export declare const PREFIXES: Readonly<Record<string, string>>;
export declare function termToTurtle(term: SubjectTerm | ObjectTerm | GraphTerm): string;
/** Serialize the dataset as Turtle, or TriG when named graphs are present. */
export declare function serializeTurtle(result: ExtractionResult): string;
/**
 * Serialize a JSON-LD 1.1 view. RDF 1.2 triple terms are represented as JSON
 * literals because JSON-LD 1.1 has no native triple-term syntax.
 */
export declare function serializeJsonLd(result: ExtractionResult): string;
export declare function containsTripleTerms(result: ExtractionResult): boolean;
export declare function compactTerm(term: SubjectTerm | ObjectTerm | GraphTerm): string;
