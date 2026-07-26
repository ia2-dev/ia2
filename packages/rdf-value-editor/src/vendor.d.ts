declare module "@rdfjs/data-model" {
  const factory: {
    blankNode(value?: string): any;
    defaultGraph(): any;
    literal(value: string, languageOrDatatype?: string | any): any;
    namedNode(value: string): any;
    quad(subject: any, predicate: any, object: any, graph?: any): any;
    variable(value: string): any;
  };
  export default factory;
}

declare module "@rdfjs/dataset" {
  const factory: {
    dataset(quads?: Iterable<any>): any;
  };
  export default factory;
}

declare module "shacl-engine/Validator.js" {
  export interface ShaclEngineResult {
    constraintComponent?: { value: string };
    focusNode: { term?: { value: string }; terms: Array<{ value: string }> };
    message: Array<{ value: string }>;
    results: ShaclEngineResult[];
    severity: { value: string };
    shape: { ptr: { term?: { value: string }; terms: Array<{ value: string }> } };
  }

  export interface ShaclEngineReport {
    conforms: boolean;
    results: ShaclEngineResult[];
  }

  export default class Validator {
    constructor(dataset: any, options: { details?: boolean; factory: any });
    validate(
      data: { dataset: any; terms?: Iterable<any> },
      shapes?: Array<{ terms: Iterable<any> }>,
    ): Promise<ShaclEngineReport>;
  }
}
