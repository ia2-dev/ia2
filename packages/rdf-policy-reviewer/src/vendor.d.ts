declare module "@rdfjs/data-model" {
  const factory: {
    blankNode(value?: string): any;
    defaultGraph(): any;
    literal(value: string, languageOrDatatype?: string | any): any;
    namedNode(value: string): any;
    quad(subject: any, predicate: any, object: any, graph?: any): any;
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
  export default class Validator {
    constructor(dataset: any, options: {
      details?: boolean;
      factory: any;
      targetResolvers?: any;
      validations?: any;
    });
    validate(data: { dataset: any; terms?: Iterable<any> }): Promise<any>;
  }
}

declare module "shacl-engine/sparql.js" {
  export const targetResolvers: any;
  export const validations: any;
}
