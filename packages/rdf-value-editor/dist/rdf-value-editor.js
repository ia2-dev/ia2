import {
  __commonJS,
  __export,
  __toESM
} from "./chunks/chunk-W7NC74ZX.js";

// ../../node_modules/lodash/_trimmedEndIndex.js
var require_trimmedEndIndex = __commonJS({
  "../../node_modules/lodash/_trimmedEndIndex.js"(exports, module) {
    var reWhitespace = /\s/;
    function trimmedEndIndex(string2) {
      var index = string2.length;
      while (index-- && reWhitespace.test(string2.charAt(index))) {
      }
      return index;
    }
    module.exports = trimmedEndIndex;
  }
});

// ../../node_modules/lodash/_baseTrim.js
var require_baseTrim = __commonJS({
  "../../node_modules/lodash/_baseTrim.js"(exports, module) {
    var trimmedEndIndex = require_trimmedEndIndex();
    var reTrimStart = /^\s+/;
    function baseTrim(string2) {
      return string2 ? string2.slice(0, trimmedEndIndex(string2) + 1).replace(reTrimStart, "") : string2;
    }
    module.exports = baseTrim;
  }
});

// ../../node_modules/lodash/isObject.js
var require_isObject = __commonJS({
  "../../node_modules/lodash/isObject.js"(exports, module) {
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    module.exports = isObject;
  }
});

// ../../node_modules/lodash/_freeGlobal.js
var require_freeGlobal = __commonJS({
  "../../node_modules/lodash/_freeGlobal.js"(exports, module) {
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    module.exports = freeGlobal;
  }
});

// ../../node_modules/lodash/_root.js
var require_root = __commonJS({
  "../../node_modules/lodash/_root.js"(exports, module) {
    var freeGlobal = require_freeGlobal();
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    module.exports = root;
  }
});

// ../../node_modules/lodash/_Symbol.js
var require_Symbol = __commonJS({
  "../../node_modules/lodash/_Symbol.js"(exports, module) {
    var root = require_root();
    var Symbol2 = root.Symbol;
    module.exports = Symbol2;
  }
});

// ../../node_modules/lodash/_getRawTag.js
var require_getRawTag = __commonJS({
  "../../node_modules/lodash/_getRawTag.js"(exports, module) {
    var Symbol2 = require_Symbol();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeObjectToString = objectProto.toString;
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    module.exports = getRawTag;
  }
});

// ../../node_modules/lodash/_objectToString.js
var require_objectToString = __commonJS({
  "../../node_modules/lodash/_objectToString.js"(exports, module) {
    var objectProto = Object.prototype;
    var nativeObjectToString = objectProto.toString;
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    module.exports = objectToString;
  }
});

// ../../node_modules/lodash/_baseGetTag.js
var require_baseGetTag = __commonJS({
  "../../node_modules/lodash/_baseGetTag.js"(exports, module) {
    var Symbol2 = require_Symbol();
    var getRawTag = require_getRawTag();
    var objectToString = require_objectToString();
    var nullTag = "[object Null]";
    var undefinedTag = "[object Undefined]";
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    module.exports = baseGetTag;
  }
});

// ../../node_modules/lodash/isObjectLike.js
var require_isObjectLike = __commonJS({
  "../../node_modules/lodash/isObjectLike.js"(exports, module) {
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    module.exports = isObjectLike;
  }
});

// ../../node_modules/lodash/isSymbol.js
var require_isSymbol = __commonJS({
  "../../node_modules/lodash/isSymbol.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var symbolTag = "[object Symbol]";
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
    }
    module.exports = isSymbol;
  }
});

// ../../node_modules/lodash/toNumber.js
var require_toNumber = __commonJS({
  "../../node_modules/lodash/toNumber.js"(exports, module) {
    var baseTrim = require_baseTrim();
    var isObject = require_isObject();
    var isSymbol = require_isSymbol();
    var NAN = 0 / 0;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    module.exports = toNumber;
  }
});

// ../../node_modules/lodash/toFinite.js
var require_toFinite = __commonJS({
  "../../node_modules/lodash/toFinite.js"(exports, module) {
    var toNumber = require_toNumber();
    var INFINITY = 1 / 0;
    var MAX_INTEGER = 17976931348623157e292;
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }
    module.exports = toFinite;
  }
});

// ../../node_modules/lodash/toInteger.js
var require_toInteger = __commonJS({
  "../../node_modules/lodash/toInteger.js"(exports, module) {
    var toFinite = require_toFinite();
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    module.exports = toInteger;
  }
});

// ../../node_modules/lodash/before.js
var require_before = __commonJS({
  "../../node_modules/lodash/before.js"(exports, module) {
    var toInteger = require_toInteger();
    var FUNC_ERROR_TEXT = "Expected a function";
    function before(n, func) {
      var result;
      if (typeof func != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = void 0;
        }
        return result;
      };
    }
    module.exports = before;
  }
});

// ../../node_modules/lodash/once.js
var require_once = __commonJS({
  "../../node_modules/lodash/once.js"(exports, module) {
    var before = require_before();
    function once5(func) {
      return before(2, func);
    }
    module.exports = once5;
  }
});

// ../../node_modules/rdf-data-factory/lib/BlankNode.js
var require_BlankNode = __commonJS({
  "../../node_modules/rdf-data-factory/lib/BlankNode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BlankNode = void 0;
    var BlankNode2 = class {
      constructor(value) {
        this.termType = "BlankNode";
        this.value = value;
      }
      equals(other) {
        return !!other && other.termType === "BlankNode" && other.value === this.value;
      }
    };
    exports.BlankNode = BlankNode2;
  }
});

// ../../node_modules/rdf-data-factory/lib/DefaultGraph.js
var require_DefaultGraph = __commonJS({
  "../../node_modules/rdf-data-factory/lib/DefaultGraph.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultGraph = void 0;
    var DefaultGraph2 = class {
      constructor() {
        this.termType = "DefaultGraph";
        this.value = "";
      }
      equals(other) {
        return !!other && other.termType === "DefaultGraph";
      }
    };
    exports.DefaultGraph = DefaultGraph2;
    DefaultGraph2.INSTANCE = new DefaultGraph2();
  }
});

// ../../node_modules/rdf-data-factory/lib/NamedNode.js
var require_NamedNode = __commonJS({
  "../../node_modules/rdf-data-factory/lib/NamedNode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NamedNode = void 0;
    var NamedNode2 = class {
      constructor(value) {
        this.termType = "NamedNode";
        this.value = value;
      }
      equals(other) {
        return !!other && other.termType === "NamedNode" && other.value === this.value;
      }
    };
    exports.NamedNode = NamedNode2;
  }
});

// ../../node_modules/rdf-data-factory/lib/Literal.js
var require_Literal = __commonJS({
  "../../node_modules/rdf-data-factory/lib/Literal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Literal = void 0;
    var NamedNode_1 = require_NamedNode();
    var Literal2 = class _Literal {
      constructor(value, languageOrDatatype) {
        this.termType = "Literal";
        this.value = value;
        if (typeof languageOrDatatype === "string") {
          this.language = languageOrDatatype;
          this.datatype = _Literal.RDF_LANGUAGE_STRING;
          this.direction = "";
        } else if (languageOrDatatype) {
          if ("termType" in languageOrDatatype) {
            this.language = "";
            this.datatype = languageOrDatatype;
            this.direction = "";
          } else {
            this.language = languageOrDatatype.language;
            this.datatype = languageOrDatatype.direction ? _Literal.RDF_DIRECTIONAL_LANGUAGE_STRING : _Literal.RDF_LANGUAGE_STRING;
            this.direction = languageOrDatatype.direction || "";
          }
        } else {
          this.language = "";
          this.datatype = _Literal.XSD_STRING;
          this.direction = "";
        }
      }
      equals(other) {
        return !!other && other.termType === "Literal" && other.value === this.value && other.language === this.language && (other.direction === this.direction || !other.direction && this.direction === "") && this.datatype.equals(other.datatype);
      }
    };
    exports.Literal = Literal2;
    Literal2.RDF_LANGUAGE_STRING = new NamedNode_1.NamedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#langString");
    Literal2.RDF_DIRECTIONAL_LANGUAGE_STRING = new NamedNode_1.NamedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString");
    Literal2.XSD_STRING = new NamedNode_1.NamedNode("http://www.w3.org/2001/XMLSchema#string");
  }
});

// ../../node_modules/rdf-data-factory/lib/Quad.js
var require_Quad = __commonJS({
  "../../node_modules/rdf-data-factory/lib/Quad.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Quad = void 0;
    var Quad2 = class {
      constructor(subject, predicate, object, graph) {
        this.termType = "Quad";
        this.value = "";
        this.subject = subject;
        this.predicate = predicate;
        this.object = object;
        this.graph = graph;
      }
      equals(other) {
        return !!other && (other.termType === "Quad" || !other.termType) && this.subject.equals(other.subject) && this.predicate.equals(other.predicate) && this.object.equals(other.object) && this.graph.equals(other.graph);
      }
    };
    exports.Quad = Quad2;
  }
});

// ../../node_modules/rdf-data-factory/lib/Variable.js
var require_Variable = __commonJS({
  "../../node_modules/rdf-data-factory/lib/Variable.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Variable = void 0;
    var Variable2 = class {
      constructor(value) {
        this.termType = "Variable";
        this.value = value;
      }
      equals(other) {
        return !!other && other.termType === "Variable" && other.value === this.value;
      }
    };
    exports.Variable = Variable2;
  }
});

// ../../node_modules/rdf-data-factory/lib/DataFactory.js
var require_DataFactory = __commonJS({
  "../../node_modules/rdf-data-factory/lib/DataFactory.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataFactory = void 0;
    var BlankNode_1 = require_BlankNode();
    var DefaultGraph_1 = require_DefaultGraph();
    var Literal_1 = require_Literal();
    var NamedNode_1 = require_NamedNode();
    var Quad_1 = require_Quad();
    var Variable_1 = require_Variable();
    var dataFactoryCounter = 0;
    var DataFactory2 = class {
      constructor(options) {
        this.blankNodeCounter = 0;
        options = options || {};
        this.blankNodePrefix = options.blankNodePrefix || `df_${dataFactoryCounter++}_`;
      }
      /**
       * @param value The IRI for the named node.
       * @return A new instance of NamedNode.
       * @see NamedNode
       */
      namedNode(value) {
        return new NamedNode_1.NamedNode(value);
      }
      /**
       * @param value The optional blank node identifier.
       * @return A new instance of BlankNode.
       *         If the `value` parameter is undefined a new identifier
       *         for the blank node is generated for each call.
       * @see BlankNode
       */
      blankNode(value) {
        return new BlankNode_1.BlankNode(value || `${this.blankNodePrefix}${this.blankNodeCounter++}`);
      }
      /**
       * @param value              The literal value.
       * @param languageOrDatatype The optional language, datatype, or directional language.
       *                           If `languageOrDatatype` is a NamedNode,
       *                           then it is used for the value of `NamedNode.datatype`.
       *                           If `languageOrDatatype` is a NamedNode, it is used for the value
       *                           of `NamedNode.language`.
       *                           Otherwise, it is used as a directional language,
       *                           from which the language is set to `languageOrDatatype.language`
       *                           and the direction to `languageOrDatatype.direction`.
       * @return A new instance of Literal.
       * @see Literal
       */
      literal(value, languageOrDatatype) {
        return new Literal_1.Literal(value, languageOrDatatype);
      }
      /**
       * This method is optional.
       * @param value The variable name
       * @return A new instance of Variable.
       * @see Variable
       */
      variable(value) {
        return new Variable_1.Variable(value);
      }
      /**
       * @return An instance of DefaultGraph.
       */
      defaultGraph() {
        return DefaultGraph_1.DefaultGraph.INSTANCE;
      }
      /**
       * @param subject   The quad subject term.
       * @param predicate The quad predicate term.
       * @param object    The quad object term.
       * @param graph     The quad graph term.
       * @return A new instance of Quad.
       * @see Quad
       */
      quad(subject, predicate, object, graph) {
        return new Quad_1.Quad(subject, predicate, object, graph || this.defaultGraph());
      }
      /**
       * Create a deep copy of the given term using this data factory.
       * @param original An RDF term.
       * @return A deep copy of the given term.
       */
      fromTerm(original) {
        switch (original.termType) {
          case "NamedNode":
            return this.namedNode(original.value);
          case "BlankNode":
            return this.blankNode(original.value);
          case "Literal":
            if (original.language) {
              return this.literal(original.value, original.language);
            }
            if (!original.datatype.equals(Literal_1.Literal.XSD_STRING)) {
              return this.literal(original.value, this.fromTerm(original.datatype));
            }
            return this.literal(original.value);
          case "Variable":
            return this.variable(original.value);
          case "DefaultGraph":
            return this.defaultGraph();
          case "Quad":
            return this.quad(this.fromTerm(original.subject), this.fromTerm(original.predicate), this.fromTerm(original.object), this.fromTerm(original.graph));
        }
      }
      /**
       * Create a deep copy of the given quad using this data factory.
       * @param original An RDF quad.
       * @return A deep copy of the given quad.
       */
      fromQuad(original) {
        return this.fromTerm(original);
      }
      /**
       * Reset the internal blank node counter.
       */
      resetBlankNodeCounter() {
        this.blankNodeCounter = 0;
      }
    };
    exports.DataFactory = DataFactory2;
  }
});

// ../../node_modules/rdf-data-factory/index.js
var require_rdf_data_factory = __commonJS({
  "../../node_modules/rdf-data-factory/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_BlankNode(), exports);
    __exportStar(require_DataFactory(), exports);
    __exportStar(require_DefaultGraph(), exports);
    __exportStar(require_Literal(), exports);
    __exportStar(require_NamedNode(), exports);
    __exportStar(require_Quad(), exports);
    __exportStar(require_Variable(), exports);
  }
});

// ../../node_modules/rdf-literal/lib/Translator.js
var require_Translator = __commonJS({
  "../../node_modules/rdf-literal/lib/Translator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Translator = void 0;
    var Translator = class {
      constructor() {
        this.supportedRdfDatatypes = [];
        this.fromRdfHandlers = {};
        this.toRdfHandlers = {};
      }
      static incorrectRdfDataType(literal3) {
        throw new Error(`Invalid RDF ${literal3.datatype.value} value: '${literal3.value}'`);
      }
      registerHandler(handler2, rdfDatatypes, javaScriptDataTypes) {
        for (const rdfDatatype of rdfDatatypes) {
          this.supportedRdfDatatypes.push(rdfDatatype);
          this.fromRdfHandlers[rdfDatatype.value] = handler2;
        }
        for (const javaScriptDataType of javaScriptDataTypes) {
          let existingToRdfHandlers = this.toRdfHandlers[javaScriptDataType];
          if (!existingToRdfHandlers) {
            this.toRdfHandlers[javaScriptDataType] = existingToRdfHandlers = [];
          }
          existingToRdfHandlers.push(handler2);
        }
      }
      fromRdf(literal3, validate) {
        const handler2 = this.fromRdfHandlers[literal3.datatype.value];
        if (handler2) {
          return handler2.fromRdf(literal3, validate);
        } else {
          return literal3.value;
        }
      }
      toRdf(value, options) {
        const handlers = this.toRdfHandlers[typeof value];
        if (handlers) {
          for (const handler2 of handlers) {
            const ret = handler2.toRdf(value, options);
            if (ret) {
              return ret;
            }
          }
        }
        throw new Error(`Invalid JavaScript value: '${value}'`);
      }
      /**
       * @return {NamedNode[]} An array of all supported RDF datatypes.
       */
      getSupportedRdfDatatypes() {
        return this.supportedRdfDatatypes;
      }
      /**
       * @return {string[]} An array of all supported JavaScript types.
       */
      getSupportedJavaScriptPrimitives() {
        return Object.keys(this.toRdfHandlers);
      }
    };
    exports.Translator = Translator;
  }
});

// ../../node_modules/rdf-literal/lib/handler/TypeHandlerBoolean.js
var require_TypeHandlerBoolean = __commonJS({
  "../../node_modules/rdf-literal/lib/handler/TypeHandlerBoolean.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypeHandlerBoolean = void 0;
    var Translator_1 = require_Translator();
    var TypeHandlerBoolean = class _TypeHandlerBoolean {
      fromRdf(literal3, validate) {
        switch (literal3.value) {
          case "true":
            return true;
          case "false":
            return false;
          case "1":
            return true;
          case "0":
            return false;
        }
        if (validate) {
          Translator_1.Translator.incorrectRdfDataType(literal3);
        }
        return false;
      }
      toRdf(value, { datatype, dataFactory }) {
        return dataFactory.literal(value ? "true" : "false", datatype || dataFactory.namedNode(_TypeHandlerBoolean.TYPE));
      }
    };
    exports.TypeHandlerBoolean = TypeHandlerBoolean;
    TypeHandlerBoolean.TYPE = "http://www.w3.org/2001/XMLSchema#boolean";
  }
});

// ../../node_modules/rdf-literal/lib/handler/TypeHandlerDate.js
var require_TypeHandlerDate = __commonJS({
  "../../node_modules/rdf-literal/lib/handler/TypeHandlerDate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypeHandlerDate = void 0;
    var Translator_1 = require_Translator();
    var TypeHandlerDate = class _TypeHandlerDate {
      fromRdf(literal3, validate) {
        if (validate && !literal3.value.match(_TypeHandlerDate.VALIDATORS[literal3.datatype.value.substr(33, literal3.datatype.value.length)])) {
          Translator_1.Translator.incorrectRdfDataType(literal3);
        }
        switch (literal3.datatype.value) {
          case "http://www.w3.org/2001/XMLSchema#gDay":
            return new Date(0, 0, parseInt(literal3.value, 10));
          case "http://www.w3.org/2001/XMLSchema#gMonthDay":
            const partsMonthDay = literal3.value.split("-");
            return new Date(0, parseInt(partsMonthDay[0], 10) - 1, parseInt(partsMonthDay[1], 10));
          case "http://www.w3.org/2001/XMLSchema#gYear":
            return /* @__PURE__ */ new Date(literal3.value + "-01-01");
          case "http://www.w3.org/2001/XMLSchema#gYearMonth":
            return /* @__PURE__ */ new Date(literal3.value + "-01");
          default:
            return new Date(literal3.value);
        }
      }
      toRdf(value, { datatype, dataFactory }) {
        datatype = datatype || dataFactory.namedNode(_TypeHandlerDate.TYPES[0]);
        if (!(value instanceof Date)) {
          return null;
        }
        const date2 = value;
        let valueString;
        switch (datatype.value) {
          case "http://www.w3.org/2001/XMLSchema#gDay":
            valueString = String(date2.getUTCDate());
            break;
          case "http://www.w3.org/2001/XMLSchema#gMonthDay":
            valueString = date2.getUTCMonth() + 1 + "-" + date2.getUTCDate();
            break;
          case "http://www.w3.org/2001/XMLSchema#gYear":
            valueString = String(date2.getUTCFullYear());
            break;
          case "http://www.w3.org/2001/XMLSchema#gYearMonth":
            valueString = date2.getUTCFullYear() + "-" + (date2.getUTCMonth() + 1);
            break;
          case "http://www.w3.org/2001/XMLSchema#date":
            valueString = date2.toISOString().replace(/T.*$/, "");
            break;
          default:
            valueString = date2.toISOString();
        }
        return dataFactory.literal(valueString, datatype);
      }
    };
    exports.TypeHandlerDate = TypeHandlerDate;
    TypeHandlerDate.TYPES = [
      "http://www.w3.org/2001/XMLSchema#dateTime",
      "http://www.w3.org/2001/XMLSchema#date",
      "http://www.w3.org/2001/XMLSchema#gDay",
      "http://www.w3.org/2001/XMLSchema#gMonthDay",
      "http://www.w3.org/2001/XMLSchema#gYear",
      "http://www.w3.org/2001/XMLSchema#gYearMonth"
    ];
    TypeHandlerDate.VALIDATORS = {
      date: /^[0-9]+-[0-9][0-9]-[0-9][0-9]Z?$/,
      dateTime: /^[0-9]+-[0-9][0-9]-[0-9][0-9]T[0-9][0-9]:[0-9][0-9]:[0-9][0-9](\.[0-9][0-9][0-9])?((Z?)|([\+-][0-9][0-9]:[0-9][0-9]))$/,
      gDay: /^[0-9]+$/,
      gMonthDay: /^[0-9]+-[0-9][0-9]$/,
      gYear: /^[0-9]+$/,
      gYearMonth: /^[0-9]+-[0-9][0-9]$/
    };
  }
});

// ../../node_modules/rdf-literal/lib/handler/TypeHandlerNumberDouble.js
var require_TypeHandlerNumberDouble = __commonJS({
  "../../node_modules/rdf-literal/lib/handler/TypeHandlerNumberDouble.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypeHandlerNumberDouble = void 0;
    var Translator_1 = require_Translator();
    var TypeHandlerNumberDouble = class _TypeHandlerNumberDouble {
      fromRdf(literal3, validate) {
        const parsed = parseFloat(literal3.value);
        if (validate) {
          if (isNaN(parsed)) {
            Translator_1.Translator.incorrectRdfDataType(literal3);
          }
        }
        return parsed;
      }
      toRdf(value, { datatype, dataFactory }) {
        datatype = datatype || dataFactory.namedNode(_TypeHandlerNumberDouble.TYPES[0]);
        if (isNaN(value)) {
          return dataFactory.literal("NaN", datatype);
        }
        if (!isFinite(value)) {
          return dataFactory.literal(value > 0 ? "INF" : "-INF", datatype);
        }
        if (value % 1 === 0) {
          return null;
        }
        return dataFactory.literal(value.toExponential(15).replace(/(\d)0*e\+?/, "$1E"), datatype);
      }
    };
    exports.TypeHandlerNumberDouble = TypeHandlerNumberDouble;
    TypeHandlerNumberDouble.TYPES = [
      "http://www.w3.org/2001/XMLSchema#double",
      "http://www.w3.org/2001/XMLSchema#decimal",
      "http://www.w3.org/2001/XMLSchema#float"
    ];
  }
});

// ../../node_modules/rdf-literal/lib/handler/TypeHandlerNumberInteger.js
var require_TypeHandlerNumberInteger = __commonJS({
  "../../node_modules/rdf-literal/lib/handler/TypeHandlerNumberInteger.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypeHandlerNumberInteger = void 0;
    var Translator_1 = require_Translator();
    var TypeHandlerNumberInteger = class _TypeHandlerNumberInteger {
      fromRdf(literal3, validate) {
        const parsed = parseInt(literal3.value, 10);
        if (validate) {
          if (isNaN(parsed) || literal3.value.indexOf(".") >= 0) {
            Translator_1.Translator.incorrectRdfDataType(literal3);
          }
        }
        return parsed;
      }
      toRdf(value, { datatype, dataFactory }) {
        return dataFactory.literal(String(value), datatype || (value <= _TypeHandlerNumberInteger.MAX_INT && value >= _TypeHandlerNumberInteger.MIN_INT ? dataFactory.namedNode(_TypeHandlerNumberInteger.TYPES[0]) : dataFactory.namedNode(_TypeHandlerNumberInteger.TYPES[1])));
      }
    };
    exports.TypeHandlerNumberInteger = TypeHandlerNumberInteger;
    TypeHandlerNumberInteger.TYPES = [
      "http://www.w3.org/2001/XMLSchema#integer",
      "http://www.w3.org/2001/XMLSchema#long",
      "http://www.w3.org/2001/XMLSchema#int",
      "http://www.w3.org/2001/XMLSchema#byte",
      "http://www.w3.org/2001/XMLSchema#short",
      "http://www.w3.org/2001/XMLSchema#negativeInteger",
      "http://www.w3.org/2001/XMLSchema#nonNegativeInteger",
      "http://www.w3.org/2001/XMLSchema#nonPositiveInteger",
      "http://www.w3.org/2001/XMLSchema#positiveInteger",
      "http://www.w3.org/2001/XMLSchema#unsignedByte",
      "http://www.w3.org/2001/XMLSchema#unsignedInt",
      "http://www.w3.org/2001/XMLSchema#unsignedLong",
      "http://www.w3.org/2001/XMLSchema#unsignedShort"
    ];
    TypeHandlerNumberInteger.MAX_INT = 2147483647;
    TypeHandlerNumberInteger.MIN_INT = -2147483648;
  }
});

// ../../node_modules/rdf-literal/lib/handler/TypeHandlerString.js
var require_TypeHandlerString = __commonJS({
  "../../node_modules/rdf-literal/lib/handler/TypeHandlerString.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypeHandlerString = void 0;
    var TypeHandlerString = class {
      fromRdf(literal3) {
        return literal3.value;
      }
      toRdf(value, { datatype, dataFactory }) {
        return dataFactory.literal(value, datatype);
      }
    };
    exports.TypeHandlerString = TypeHandlerString;
    TypeHandlerString.TYPES = [
      "http://www.w3.org/2001/XMLSchema#string",
      "http://www.w3.org/2001/XMLSchema#normalizedString",
      "http://www.w3.org/2001/XMLSchema#anyURI",
      "http://www.w3.org/2001/XMLSchema#base64Binary",
      "http://www.w3.org/2001/XMLSchema#language",
      "http://www.w3.org/2001/XMLSchema#Name",
      "http://www.w3.org/2001/XMLSchema#NCName",
      "http://www.w3.org/2001/XMLSchema#NMTOKEN",
      "http://www.w3.org/2001/XMLSchema#token",
      "http://www.w3.org/2001/XMLSchema#hexBinary",
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString",
      "http://www.w3.org/2001/XMLSchema#time",
      "http://www.w3.org/2001/XMLSchema#duration"
    ];
  }
});

// ../../node_modules/rdf-literal/lib/handler/index.js
var require_handler = __commonJS({
  "../../node_modules/rdf-literal/lib/handler/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_TypeHandlerBoolean(), exports);
    __exportStar(require_TypeHandlerDate(), exports);
    __exportStar(require_TypeHandlerNumberDouble(), exports);
    __exportStar(require_TypeHandlerNumberInteger(), exports);
    __exportStar(require_TypeHandlerString(), exports);
  }
});

// ../../node_modules/rdf-literal/lib/ITypeHandler.js
var require_ITypeHandler = __commonJS({
  "../../node_modules/rdf-literal/lib/ITypeHandler.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/rdf-literal/index.js
var require_rdf_literal = __commonJS({
  "../../node_modules/rdf-literal/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromRdf = fromRdf5;
    exports.toRdf = toRdf;
    exports.getTermRaw = getTermRaw;
    exports.getSupportedRdfDatatypes = getSupportedRdfDatatypes;
    exports.getSupportedJavaScriptPrimitives = getSupportedJavaScriptPrimitives;
    var rdf_data_factory_1 = require_rdf_data_factory();
    var handler_1 = require_handler();
    var Translator_1 = require_Translator();
    __exportStar(require_handler(), exports);
    __exportStar(require_ITypeHandler(), exports);
    __exportStar(require_Translator(), exports);
    var DF = new rdf_data_factory_1.DataFactory();
    var translator = new Translator_1.Translator();
    translator.registerHandler(new handler_1.TypeHandlerString(), handler_1.TypeHandlerString.TYPES.map((t) => DF.namedNode(t)), ["string"]);
    translator.registerHandler(new handler_1.TypeHandlerBoolean(), [handler_1.TypeHandlerBoolean.TYPE].map((t) => DF.namedNode(t)), ["boolean"]);
    translator.registerHandler(new handler_1.TypeHandlerNumberDouble(), handler_1.TypeHandlerNumberDouble.TYPES.map((t) => DF.namedNode(t)), ["number"]);
    translator.registerHandler(new handler_1.TypeHandlerNumberInteger(), handler_1.TypeHandlerNumberInteger.TYPES.map((t) => DF.namedNode(t)), ["number"]);
    translator.registerHandler(new handler_1.TypeHandlerDate(), handler_1.TypeHandlerDate.TYPES.map((t) => DF.namedNode(t)), ["object"]);
    function fromRdf5(literal3, validate) {
      return translator.fromRdf(literal3, validate);
    }
    function toRdf(value, options) {
      if (options && "namedNode" in options) {
        options = { dataFactory: options };
      }
      options = options || {};
      if (options && !options.dataFactory) {
        options.dataFactory = DF;
      }
      return translator.toRdf(value, options);
    }
    function getTermRaw(term, validate) {
      if (term.termType === "Literal") {
        return fromRdf5(term, validate);
      }
      return term.value;
    }
    function getSupportedRdfDatatypes() {
      return translator.getSupportedRdfDatatypes();
    }
    function getSupportedJavaScriptPrimitives() {
      return translator.getSupportedJavaScriptPrimitives();
    }
  }
});

// ../html-rdf/dist/index.js
var namedNode = (value) => ({ termType: "NamedNode", value });
var blankNode = (value) => ({ termType: "BlankNode", value });
var XSD_STRING = "http://www.w3.org/2001/XMLSchema#string";
var RDF_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString";
var RDF_DIR_LANG_STRING = "http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString";
var CORE_ATTRIBUTES = /* @__PURE__ */ new Set([
  "rdf-version",
  "rdf-subject",
  "rdf-subject-key",
  "rdf-predicate",
  "rdf-object-key",
  "rdf-datatype",
  "rdf-graph",
  "rdf-graph-key"
]);
var IRI_CARRIERS = {
  a: ["href"],
  area: ["href"],
  link: ["href"],
  audio: ["src"],
  embed: ["src"],
  iframe: ["src"],
  img: ["src"],
  input: ["src", "formaction"],
  script: ["src"],
  source: ["src"],
  track: ["src"],
  video: ["src", "poster"],
  blockquote: ["cite"],
  del: ["cite"],
  ins: ["cite"],
  q: ["cite"],
  form: ["action"],
  button: ["formaction"],
  object: ["data"]
};
var InvalidStatement = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
};
function ownerDocument(root) {
  if (root.nodeType === Node.DOCUMENT_NODE) return root;
  const document2 = root.ownerDocument;
  if (!document2) throw new Error("The extraction root has no owner document.");
  return document2;
}
function hasLinkRelation(element, relation) {
  return (element.getAttribute("rel") ?? "").split(/[\t\n\f\r ]+/).some((token2) => token2.toLowerCase() === relation);
}
function establishDocumentIris(doc, diagnostics) {
  const retrievalDocumentIri = doc.URL || doc.baseURI;
  const htmlBaseIri = doc.baseURI || retrievalDocumentIri;
  const canonicalLinks = Array.from(doc.head?.querySelectorAll("link[rel][href]") ?? []).filter((link) => hasLinkRelation(link, "canonical"));
  let sourceDocumentIri = retrievalDocumentIri;
  if (canonicalLinks.length > 1) {
    diagnostics.push({
      severity: "warning",
      code: "multiple-canonical-links",
      message: "More than one canonical link was declared; the retrieval IRI remains the source document IRI.",
      source: canonicalLinks[0]
    });
  } else if (canonicalLinks.length === 1) {
    const canonicalLink = canonicalLinks[0];
    try {
      const canonicalIri = new URL(canonicalLink.getAttribute("href") ?? "", htmlBaseIri).href;
      if (canonicalIri.includes("#")) {
        diagnostics.push({
          severity: "warning",
          code: "canonical-iri-has-fragment",
          message: "The canonical document IRI cannot contain a fragment; the retrieval IRI remains the source document IRI.",
          source: canonicalLink
        });
      } else {
        sourceDocumentIri = canonicalIri;
      }
    } catch {
      diagnostics.push({
        severity: "warning",
        code: "invalid-canonical-iri",
        message: "The canonical link does not resolve to an absolute IRI; the retrieval IRI remains the source document IRI.",
        source: canonicalLink
      });
    }
  }
  const hasExplicitBase = Boolean(doc.head?.querySelector("base[href]"));
  return {
    retrievalDocumentIri,
    sourceDocumentIri,
    baseIri: hasExplicitBase ? htmlBaseIri : sourceDocumentIri
  };
}
function resolveIri(reference, ctx, subjectFragment = false) {
  try {
    const base = subjectFragment && reference.startsWith("#") ? ctx.sourceDocumentIri : ctx.baseIri;
    const iri2 = new URL(reference, base).href;
    if (!/^[A-Za-z][A-Za-z0-9+.-]*:/.test(iri2)) {
      throw new Error("The result is not absolute.");
    }
    return iri2;
  } catch {
    throw new InvalidStatement("invalid-iri", `Cannot resolve IRI reference \u201C${reference}\u201D.`);
  }
}
function keyNode(key, ctx) {
  if (!key || /[\t\n\f\r ]/.test(key)) {
    throw new InvalidStatement("invalid-key", "Local RDF keys must be non-empty and contain no ASCII whitespace.");
  }
  let node = ctx.keys.get(key);
  if (!node) {
    node = blankNode(`b${ctx.nextBlank++}`);
    ctx.keys.set(key, node);
  }
  return node;
}
function elementNode(element, ctx) {
  let node = ctx.elementNodes.get(element);
  if (!node) {
    node = blankNode(`b${ctx.nextBlank++}`);
    ctx.elementNodes.set(element, node);
  }
  return node;
}
function encodeFragment(value) {
  return Array.from(value, (character) => {
    if (character === "%") return "%25";
    return encodeURIComponent(character).replace(/%[0-9a-f]{2}/gi, (octet) => octet.toUpperCase());
  }).join("");
}
function subjectFor(element, ctx) {
  const hasIri = element.hasAttribute("rdf-subject");
  const hasKey = element.hasAttribute("rdf-subject-key");
  if (hasIri && hasKey) {
    throw new InvalidStatement("competing-subjects", "A statement cannot carry both rdf-subject and rdf-subject-key.");
  }
  if (hasIri) {
    const value = element.getAttribute("rdf-subject") ?? "";
    return namedNode(resolveIri(value, ctx, true));
  }
  if (hasKey) return keyNode(element.getAttribute("rdf-subject-key") ?? "", ctx);
  const id = element.getAttribute("id");
  if (id) {
    const withoutFragment = ctx.sourceDocumentIri.replace(/#.*$/s, "");
    return namedNode(`${withoutFragment}#${encodeFragment(id)}`);
  }
  return elementNode(element, ctx);
}
function directTemplates(element) {
  return Array.from(element.children).filter(
    (child) => child.localName === "template"
  );
}
function iriCarriers(element) {
  const attributes = IRI_CARRIERS[element.localName] ?? [];
  return attributes.flatMap((attribute) => {
    const value = element.getAttribute(attribute);
    return value === null ? [] : [{ attribute, value }];
  });
}
function textWithoutTemplates(element) {
  const chunks = [];
  const visit = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      chunks.push(node.nodeValue ?? "");
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const child = node;
    if (child.localName === "template") return;
    child.childNodes.forEach(visit);
  };
  element.childNodes.forEach(visit);
  return chunks.join("").replace(/[\t\n\f\r ]+/g, " ").replace(/^ | $/g, "");
}
function isLanguageTag(value) {
  if (!/^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/.test(value)) return false;
  try {
    new Intl.Locale(value);
    return true;
  } catch {
    return false;
  }
}
function literalFor(element, lexical, ctx) {
  const datatype = element.getAttribute("rdf-datatype");
  const directLanguage = element.getAttribute("lang");
  const documentLanguage = ctx.document.documentElement?.getAttribute("lang") ?? "";
  const language2 = directLanguage ?? documentLanguage;
  const directionSource = element.getAttribute("dir");
  const direction = directionSource?.toLowerCase();
  if (datatype !== null) {
    const datatypeIri = resolveIri(datatype, ctx);
    if (datatypeIri === RDF_LANG_STRING || datatypeIri === RDF_DIR_LANG_STRING) {
      throw new InvalidStatement("invalid-literal-metadata", "rdf-datatype cannot explicitly select an RDF language-string datatype.");
    }
    if (directLanguage || direction === "ltr" || direction === "rtl") {
      throw new InvalidStatement("competing-literal-metadata", "A typed literal cannot also carry RDF language or direction.");
    }
    return { termType: "Literal", value: lexical, datatype: namedNode(datatypeIri), language: "" };
  }
  if (directionSource !== null && direction !== "ltr" && direction !== "rtl" && direction !== "auto") {
    throw new InvalidStatement("invalid-direction", `Unsupported RDF base direction \u201C${directionSource}\u201D.`);
  }
  const rdfDirection = direction === "ltr" || direction === "rtl" ? direction : void 0;
  if (rdfDirection && !language2) {
    throw new InvalidStatement("direction-without-language", "RDF base direction requires a non-empty language tag.");
  }
  if (language2 && !isLanguageTag(language2)) {
    throw new InvalidStatement("invalid-language", `\u201C${language2}\u201D is not a supported BCP 47 language tag.`);
  }
  if (language2 && rdfDirection) {
    return {
      termType: "Literal",
      value: lexical,
      datatype: namedNode(RDF_DIR_LANG_STRING),
      language: language2,
      direction: rdfDirection
    };
  }
  if (language2) {
    return { termType: "Literal", value: lexical, datatype: namedNode(RDF_LANG_STRING), language: language2 };
  }
  return { termType: "Literal", value: lexical, datatype: namedNode(XSD_STRING), language: "" };
}
function parseTermTemplate(template, ctx) {
  if (Array.from(template.attributes).some((attribute) => CORE_ATTRIBUTES.has(attribute.name))) {
    throw new InvalidStatement("annotated-term-template", "An object-position template cannot carry Core rdf-* attributes.");
  }
  const elementChildren = Array.from(template.content.children);
  const nonWhitespaceText = Array.from(template.content.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && /\S/.test(node.nodeValue ?? "")
  );
  const statements = template.content.querySelectorAll("[rdf-predicate]");
  if (elementChildren.length !== 1 || nonWhitespaceText || statements.length !== 1) {
    throw new InvalidStatement("invalid-term-fragment", "A triple-term template must contain exactly one statement element and no other non-whitespace content.");
  }
  const inner = statements[0];
  if (!inner || inner !== elementChildren[0]) {
    throw new InvalidStatement("nested-term-statement", "The triple-term statement must be the template's sole top-level element.");
  }
  if (inner.hasAttribute("rdf-graph") || inner.hasAttribute("rdf-graph-key")) {
    throw new InvalidStatement("graphed-triple-term", "A triple term cannot carry graph membership.");
  }
  const parsed = parseStatement(inner, ctx);
  return { termType: "Triple", subject: parsed.subject, predicate: parsed.predicate, object: parsed.object };
}
function objectFor(element, ctx) {
  const templates = directTemplates(element);
  const hasKey = element.hasAttribute("rdf-object-key");
  const iris = iriCarriers(element);
  const literalCarrier = element.localName === "meta" && element.hasAttribute("content") || element.localName === "data" && element.hasAttribute("value") || element.localName === "time" && element.hasAttribute("datetime");
  const carrierCount = (templates.length ? 1 : 0) + (hasKey ? 1 : 0) + iris.length + (literalCarrier ? 1 : 0);
  if (templates.length > 1 || carrierCount > 1) {
    throw new InvalidStatement("competing-objects", "A statement must have exactly one unambiguous object carrier.");
  }
  if (templates.length === 1) {
    if (element.hasAttribute("rdf-datatype") || element.hasAttribute("lang") || element.hasAttribute("dir")) {
      throw new InvalidStatement("metadata-on-nonliteral", "Literal metadata cannot be applied to a triple-term object.");
    }
    return parseTermTemplate(templates[0], ctx);
  }
  if (hasKey) {
    if (element.hasAttribute("rdf-datatype") || element.hasAttribute("lang") || element.hasAttribute("dir")) {
      throw new InvalidStatement("metadata-on-nonliteral", "Literal metadata cannot be applied to a blank-node object.");
    }
    return keyNode(element.getAttribute("rdf-object-key") ?? "", ctx);
  }
  if (iris.length === 1) {
    if (element.hasAttribute("rdf-datatype") || element.hasAttribute("lang") || element.hasAttribute("dir")) {
      throw new InvalidStatement("metadata-on-nonliteral", "Literal metadata cannot be applied to an IRI object.");
    }
    return namedNode(resolveIri(iris[0].value, ctx));
  }
  let lexical;
  if (element.localName === "meta" && element.hasAttribute("content")) lexical = element.getAttribute("content") ?? "";
  else if (element.localName === "data" && element.hasAttribute("value")) lexical = element.getAttribute("value") ?? "";
  else if (element.localName === "time" && element.hasAttribute("datetime")) lexical = element.getAttribute("datetime") ?? "";
  else {
    if (element.querySelector("[rdf-predicate]")) {
      throw new InvalidStatement("nested-statement-in-literal", "A text literal carrier cannot contain another asserted statement.");
    }
    lexical = textWithoutTemplates(element);
  }
  return literalFor(element, lexical, ctx);
}
function parseStatement(element, ctx) {
  const predicateValue = element.getAttribute("rdf-predicate");
  if (predicateValue === null) throw new InvalidStatement("missing-predicate", "The statement has no rdf-predicate.");
  return {
    subject: subjectFor(element, ctx),
    predicate: namedNode(resolveIri(predicateValue, ctx)),
    object: objectFor(element, ctx)
  };
}
function graphFor(element, ctx) {
  const iri2 = element.getAttribute("rdf-graph");
  const key = element.getAttribute("rdf-graph-key");
  if (iri2 !== null && key !== null) {
    throw new InvalidStatement("competing-graphs", "An RDF statement cannot carry both rdf-graph and rdf-graph-key.");
  }
  if (iri2 !== null) return namedNode(resolveIri(iri2, ctx));
  if (key !== null) return keyNode(key, ctx);
  return null;
}
function report(ctx, error, source) {
  const invalid = error instanceof InvalidStatement ? error : new InvalidStatement("extractor-error", String(error));
  ctx.diagnostics.push({ severity: "error", code: invalid.code, message: invalid.message, source });
}
function graphKey(graph) {
  return `${graph.termType}:${graph.value}`;
}
function extractDataset(root = document) {
  const doc = ownerDocument(root);
  const diagnostics = [];
  const { retrievalDocumentIri, sourceDocumentIri, baseIri } = establishDocumentIris(doc, diagnostics);
  const ctx = {
    document: doc,
    sourceDocumentIri,
    baseIri,
    diagnostics,
    keys: /* @__PURE__ */ new Map(),
    elementNodes: /* @__PURE__ */ new WeakMap(),
    nextBlank: 0
  };
  const html = doc.documentElement;
  const version = html?.getAttribute("rdf-version");
  if (version === null) {
    ctx.diagnostics.push({ severity: "warning", code: "missing-version", message: "No rdf-version was declared; IA2 Core 0.1 defaults to RDF 1.2." });
  } else if (version !== "1.2") {
    ctx.diagnostics.push({ severity: "error", code: "unsupported-version", message: `Unsupported rdf-version \u201C${version}\u201D.` });
    return { version: "1.2", quads: [], graphs: [], diagnostics: ctx.diagnostics, retrievalDocumentIri, sourceDocumentIri, baseIri };
  }
  const quads = [];
  const graphs = /* @__PURE__ */ new Map();
  root.querySelectorAll("[rdf-predicate]").forEach((element) => {
    try {
      const parsed = parseStatement(element, ctx);
      const graph = graphFor(element, ctx);
      quads.push({ ...parsed, graph, source: element });
      if (graph) graphs.set(graphKey(graph), graph);
    } catch (error) {
      report(ctx, error, element);
    }
  });
  root.querySelectorAll("[rdf-graph]:not([rdf-predicate]), [rdf-graph-key]:not([rdf-predicate])").forEach((element) => {
    const parent = element.parentElement;
    if (element.localName === "template" && parent?.hasAttribute("rdf-predicate") && directTemplates(parent).includes(element)) return;
    try {
      const coreAttributes = Array.from(element.attributes).filter((attribute) => CORE_ATTRIBUTES.has(attribute.name));
      if (coreAttributes.length !== 1) {
        throw new InvalidStatement("invalid-graph-declaration", "A graph declaration can carry exactly one graph attribute and no other Core rdf-* attribute.");
      }
      const graph = graphFor(element, ctx);
      if (!graph) throw new InvalidStatement("missing-graph", "The graph declaration has no graph name.");
      graphs.set(graphKey(graph), graph);
    } catch (error) {
      report(ctx, error, element);
    }
  });
  doc.querySelectorAll("[rdf-version]:not(html)").forEach((source) => {
    ctx.diagnostics.push({ severity: "warning", code: "misplaced-version", message: "rdf-version only has processing effect on the html element.", source });
  });
  return {
    version: "1.2",
    quads,
    graphs: Array.from(graphs.values()),
    diagnostics: ctx.diagnostics,
    retrievalDocumentIri,
    sourceDocumentIri,
    baseIri
  };
}
var PREFIXES = {
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  owl: "http://www.w3.org/2002/07/owl#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
  schema: "https://schema.org/",
  dcterms: "http://purl.org/dc/terms/",
  dcat: "http://www.w3.org/ns/dcat#",
  skos: "http://www.w3.org/2004/02/skos/core#",
  prov: "http://www.w3.org/ns/prov#",
  odrl: "http://www.w3.org/ns/odrl/2/",
  sh: "http://www.w3.org/ns/shacl#",
  c4o: "http://purl.org/spar/c4o/",
  cito: "http://purl.org/spar/cito/",
  deo: "http://purl.org/spar/deo/",
  doco: "http://purl.org/spar/doco/",
  pattern: "http://www.essepuntato.it/2008/12/pattern#",
  decision: "https://ontology.inferal.com/modules/decision/",
  ord: "https://ontology.inferal.com/modules/ordering/",
  htmlrdf: "https://ia2.dev/spec/html-rdf#",
  rdfhtml: "https://ia2.dev/spec/rdf-html#",
  de: "https://ia2.dev/spec/discovery-enrichment#"
};
function escaped(value) {
  return value.replace(/\\/g, "\\\\").replace(/\"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}
function prefixed(iri2) {
  for (const [prefix, namespace2] of Object.entries(PREFIXES)) {
    if (!iri2.startsWith(namespace2)) continue;
    const local = iri2.slice(namespace2.length);
    if (/^[A-Za-z_][A-Za-z0-9._-]*$/.test(local)) return `${prefix}:${local}`;
  }
  return null;
}
function iri(iriValue) {
  return prefixed(iriValue) ?? `<${iriValue.replace(/>/g, "\\>")}>`;
}
function literal(term) {
  const lexical = `"${escaped(term.value)}"`;
  if (term.language && term.direction) return `${lexical}@${term.language}--${term.direction}`;
  if (term.language) return `${lexical}@${term.language}`;
  if (term.datatype.value !== XSD_STRING && term.datatype.value !== RDF_LANG_STRING && term.datatype.value !== RDF_DIR_LANG_STRING) {
    return `${lexical}^^${iri(term.datatype.value)}`;
  }
  return lexical;
}
function termToTurtle(term) {
  switch (term.termType) {
    case "NamedNode":
      return iri(term.value);
    case "BlankNode":
      return `_:${term.value}`;
    case "Literal":
      return literal(term);
    case "Triple":
      return `<<( ${termToTurtle(term.subject)} ${termToTurtle(term.predicate)} ${termToTurtle(term.object)} )>>`;
  }
}
var HTML_RDF_DATASET_CHANGE_EVENT = "ia2-rdf-dataset-change";
var DEFAULT_LABEL_PREDICATES = [
  "http://www.w3.org/2000/01/rdf-schema#label",
  "http://www.w3.org/2004/02/skos/core#prefLabel",
  "http://purl.org/dc/terms/title",
  "https://schema.org/name"
];
var OA_HAS_SOURCE = "http://www.w3.org/ns/oa#hasSource";
var OA_HAS_TARGET = "http://www.w3.org/ns/oa#hasTarget";
function sameResource(left, right) {
  return (left.termType === "NamedNode" || left.termType === "BlankNode") && left.termType === right.termType && left.value === right.value;
}
function resourceTerm(value) {
  return typeof value === "string" ? { termType: "NamedNode", value } : value;
}
function labelFor(quads, resource, options = {}) {
  const subject = resourceTerm(resource);
  const predicates = options.predicates ?? DEFAULT_LABEL_PREDICATES;
  const languages = options.languages?.map((language2) => language2.toLowerCase()) ?? [];
  for (const predicate of predicates) {
    const candidates = quads.filter((quad2) => sameResource(quad2.subject, subject) && quad2.predicate.value === predicate && quad2.object.termType === "Literal");
    for (const language2 of languages) {
      const match = candidates.find(({ object }) => object.termType === "Literal" && object.language.toLowerCase() === language2);
      if (match?.object.termType === "Literal") return match.object.value;
    }
    const languageNeutral = candidates.find(({ object }) => object.termType === "Literal" && !object.language);
    if (languageNeutral?.object.termType === "Literal") return languageNeutral.object.value;
    const first = candidates[0]?.object;
    if (first?.termType === "Literal") return first.value;
  }
  return void 0;
}
function annotationTargetIrisForAnnotation(quads, annotation) {
  const annotationTerm = resourceTerm(annotation);
  const targets = quads.flatMap((quad2) => sameResource(quad2.subject, annotationTerm) && quad2.predicate.value === OA_HAS_TARGET && (quad2.object.termType === "NamedNode" || quad2.object.termType === "BlankNode") ? [quad2.object] : []);
  return Array.from(new Set(targets.flatMap((target) => {
    const sources = quads.flatMap((quad2) => sameResource(quad2.subject, target) && quad2.predicate.value === OA_HAS_SOURCE && quad2.object.termType === "NamedNode" ? [quad2.object.value] : []);
    if (sources.length > 0) return sources;
    return target.termType === "NamedNode" ? [target.value] : [];
  })));
}
function selectedGraph(graph, selected) {
  if (!graph) return selected.includes(null);
  return selected.includes(graph.value);
}
function projectQuadsToDefaultGraph(quads, options = {}) {
  const selected = options.graphs;
  return quads.filter((quad2) => !selected || selectedGraph(quad2.graph, selected)).map((quad2) => ({ ...quad2, graph: null }));
}
function toRdfJsTerm(term, factory3) {
  if (term.termType === "NamedNode") return factory3.namedNode(term.value);
  if (term.termType === "BlankNode") return factory3.blankNode(term.value);
  if (term.termType === "Literal") return toRdfJsLiteral(term, factory3);
  return toRdfJsTriple(term, factory3);
}
function toRdfJsLiteral(term, factory3) {
  if (term.language || term.direction) {
    return factory3.literal(term.value, {
      language: term.language,
      ...term.direction ? { direction: term.direction } : {}
    });
  }
  return factory3.literal(term.value, factory3.namedNode(term.datatype.value));
}
function toRdfJsTriple(term, factory3) {
  return factory3.quad(
    toRdfJsTerm(term.subject, factory3),
    factory3.namedNode(term.predicate.value),
    toRdfJsTerm(term.object, factory3)
  );
}
function toRdfJsGraph(term, factory3) {
  return term ? toRdfJsTerm(term, factory3) : factory3.defaultGraph();
}
function toRdfJsQuad(quad2, factory3) {
  return factory3.quad(
    toRdfJsTerm(quad2.subject, factory3),
    factory3.namedNode(quad2.predicate.value),
    toRdfJsTerm(quad2.object, factory3),
    toRdfJsGraph(quad2.graph, factory3)
  );
}
function toRdfJsDataset(quads, factory3, datasetFactory) {
  return datasetFactory.dataset(quads.map((quad2) => toRdfJsQuad(quad2, factory3)));
}

// ../ui-primitives/dist/index.js
function escapeMarkup(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
var IA2_WINDOW_ACTIVATE_EVENT = "ia2:window-activate";
function activateWindow(activeWindow) {
  const { source } = activeWindow;
  const EventConstructor = source.ownerDocument.defaultView?.CustomEvent ?? globalThis.CustomEvent;
  const detail = {
    source,
    windows: [activeWindow]
  };
  source.ownerDocument.dispatchEvent(new EventConstructor(
    IA2_WINDOW_ACTIVATE_EVENT,
    { detail }
  ));
  const view = source.ownerDocument.defaultView;
  if (!view || view.innerWidth <= 760) {
    for (const window of detail.windows) {
      if (window.source !== source) window.close();
    }
    return;
  }
  if (windowPositionsAreCompatible(detail.windows, view.innerWidth, view.innerHeight)) return;
  const arranged = arrangeWindowPositions(detail.windows, view.innerWidth, view.innerHeight);
  for (const window of detail.windows) {
    const position = arranged.get(window.source);
    if (position && position !== window.position) window.setPosition(position);
  }
}
var WINDOW_RESIZE_DIRECTIONS = [
  "n",
  "ne",
  "e",
  "se",
  "s",
  "sw",
  "w",
  "nw"
];
var WINDOW_RESIZE_DIRECTIONS_BY_POSITION = {
  right: ["w"],
  "right-top": ["w", "s", "sw"],
  "right-bottom": ["n", "w", "nw"],
  bottom: ["n"],
  floating: WINDOW_RESIZE_DIRECTIONS,
  top: ["s"],
  left: ["e"],
  "left-bottom": ["n", "e", "ne"],
  "left-top": ["e", "s", "se"]
};
function windowRect(window, position, viewportWidth, viewportHeight) {
  if (position === "floating") return null;
  const measuredWidth = window.surface.getBoundingClientRect().width;
  const width = Math.min(measuredWidth || window.preferredWidth, viewportWidth);
  const halfHeight = viewportHeight / 2;
  if (position === "top") {
    return { bottom: halfHeight, left: 0, right: viewportWidth, top: 0 };
  }
  if (position === "bottom") {
    return { bottom: viewportHeight, left: 0, right: viewportWidth, top: halfHeight };
  }
  const left = position.startsWith("left") ? 0 : viewportWidth - width;
  const right = left + width;
  if (position.endsWith("-top")) {
    return { bottom: halfHeight, left, right, top: 0 };
  }
  if (position.endsWith("-bottom")) {
    return { bottom: viewportHeight, left, right, top: halfHeight };
  }
  return { bottom: viewportHeight, left, right, top: 0 };
}
function rectanglesOverlap(left, right) {
  if (!left || !right) return false;
  return left.left < right.right && left.right > right.left && left.top < right.bottom && left.bottom > right.top;
}
function positionsAreCompatible(windows, positions, viewportWidth, viewportHeight) {
  for (let leftIndex = 0; leftIndex < windows.length; leftIndex += 1) {
    const leftWindow = windows[leftIndex];
    const leftPosition = positions.get(leftWindow.source) ?? leftWindow.position;
    const leftRect = windowRect(leftWindow, leftPosition, viewportWidth, viewportHeight);
    for (let rightIndex = leftIndex + 1; rightIndex < windows.length; rightIndex += 1) {
      const rightWindow = windows[rightIndex];
      const rightPosition = positions.get(rightWindow.source) ?? rightWindow.position;
      if (rectanglesOverlap(
        leftRect,
        windowRect(rightWindow, rightPosition, viewportWidth, viewportHeight)
      )) return false;
    }
  }
  return true;
}
function windowPositionsAreCompatible(windows, viewportWidth, viewportHeight) {
  return positionsAreCompatible(
    windows,
    new Map(windows.map((window) => [window.source, window.position])),
    viewportWidth,
    viewportHeight
  );
}
function positionCandidates(window) {
  const allowed = new Set(window.allowedPositions);
  return Array.from(/* @__PURE__ */ new Set([...window.preferredPositions, window.position, ...window.allowedPositions])).filter((position) => allowed.has(position));
}
function arrangeWindowPositions(windows, viewportWidth, viewportHeight) {
  const ordered = [...windows].sort((left, right) => right.priority - left.priority);
  const selected = /* @__PURE__ */ new Map();
  const choose = (index) => {
    if (index >= ordered.length) return true;
    const window = ordered[index];
    for (const position of positionCandidates(window)) {
      selected.set(window.source, position);
      if (positionsAreCompatible(ordered.slice(0, index + 1), selected, viewportWidth, viewportHeight) && choose(index + 1)) return true;
    }
    selected.delete(window.source);
    return false;
  };
  if (choose(0)) return selected;
  return new Map(windows.map((window) => [window.source, window.position]));
}
var WINDOW_POSITIONS = [
  { position: "right", label: "Right, full height", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v12h-5z"/></svg>' },
  { position: "right-top", label: "Right, top half", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 2h5v5.5h-5z"/></svg>' },
  { position: "right-bottom", label: "Right, bottom half", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M13 8.5h5V14h-5z"/></svg>' },
  { position: "bottom", label: "Bottom, full width", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 9h16v5H2z"/></svg>' },
  { position: "floating", label: "Floating, centered", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><rect class="position-region" x="5" y="4.5" width="10" height="7" rx="1"/></svg>' },
  { position: "top", label: "Top, full width", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h16v5H2z"/></svg>' },
  { position: "left", label: "Left, full height", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v12H2z"/></svg>' },
  { position: "left-bottom", label: "Left, bottom half", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 8.5h5V14H2z"/></svg>' },
  { position: "left-top", label: "Left, top half", icon: '<svg class="position-icon" viewBox="0 0 20 16" aria-hidden="true" focusable="false"><rect x=".75" y=".75" width="18.5" height="14.5" rx="2"/><path class="position-region" d="M2 2h5v5.5H2z"/></svg>' }
];
var WINDOW_PLACEMENT_CSS = `
  .ia2-window-launcher {
    z-index: var(--ia2-window-launcher-layer, 2147483020);
  }
  .ia2-window-surface {
    border-left: 1px solid var(--ia2-window-rule, currentColor);
    bottom: 0;
    box-shadow: -12px 0 48px oklch(20% 0.03 286 / 18%);
    max-width: 100vw;
    position: fixed;
    right: 0;
    top: 0;
    transform: translateX(105%);
    transition:
      opacity 180ms ease,
      transform var(--ia2-window-transition-duration, 220ms) cubic-bezier(.22, 1, .36, 1),
      visibility var(--ia2-window-transition-duration, 220ms);
    visibility: hidden;
    width: var(--ia2-window-width, min(760px, 72vw));
    z-index: var(--ia2-window-surface-layer, 2147483000);
  }
  .ia2-window-surface[data-open=""],
  .ia2-window-surface[data-open="true"] {
    transform: translateX(0);
    visibility: visible;
  }
  .ia2-window-surface[data-position^="left"] {
    border-left: 0;
    border-right: 1px solid var(--ia2-window-rule, currentColor);
    box-shadow: 12px 0 48px oklch(20% 0.03 286 / 18%);
    left: 0;
    right: auto;
    transform: translateX(-105%);
  }
  .ia2-window-surface[data-position^="left"][data-open=""],
  .ia2-window-surface[data-position^="left"][data-open="true"] {
    transform: translateX(0);
  }
  .ia2-window-surface[data-position$="-top"] {
    bottom: auto;
    border-bottom: 1px solid var(--ia2-window-rule, currentColor);
    height: var(--ia2-window-half-height, 50vh);
    top: 0;
  }
  .ia2-window-surface[data-position$="-bottom"] {
    border-top: 1px solid var(--ia2-window-rule, currentColor);
    bottom: 0;
    height: var(--ia2-window-half-height, 50vh);
    top: auto;
  }
  .ia2-window-surface[data-position="top"],
  .ia2-window-surface[data-position="bottom"] {
    border: 0;
    height: var(--ia2-window-horizontal-height, 50vh);
    left: 0;
    max-width: none;
    right: 0;
    width: 100vw;
  }
  .ia2-window-surface[data-position="top"] {
    border-bottom: 1px solid var(--ia2-window-rule, currentColor);
    bottom: auto;
    box-shadow: 0 12px 48px oklch(20% 0.03 286 / 18%);
    top: 0;
    transform: translateY(-105%);
  }
  .ia2-window-surface[data-position="bottom"] {
    border-top: 1px solid var(--ia2-window-rule, currentColor);
    bottom: 0;
    box-shadow: 0 -12px 48px oklch(20% 0.03 286 / 18%);
    top: auto;
    transform: translateY(105%);
  }
  .ia2-window-surface[data-position="top"][data-open=""],
  .ia2-window-surface[data-position="top"][data-open="true"],
  .ia2-window-surface[data-position="bottom"][data-open=""],
  .ia2-window-surface[data-position="bottom"][data-open="true"] {
    transform: translateY(0);
  }
  .ia2-window-surface[data-position="floating"] {
    border: 1px solid var(--ia2-window-rule, currentColor);
    border-radius: var(--ia2-window-floating-radius, 14px);
    bottom: auto;
    box-shadow: 0 18px 64px oklch(20% 0.03 286 / 24%);
    height: var(--ia2-window-floating-height, min(860px, calc(100vh - 48px)));
    left: var(--ia2-window-floating-left, 50%);
    opacity: 0;
    overflow: hidden;
    right: auto;
    top: var(--ia2-window-floating-top, 50%);
    transform: var(--ia2-window-floating-closed-transform, translate(-50%, -48%) scale(.985));
    width: var(--ia2-window-floating-width, min(760px, calc(100vw - 48px)));
  }
  .ia2-window-surface[data-position="floating"][data-open=""],
  .ia2-window-surface[data-position="floating"][data-open="true"] {
    opacity: 1;
    transform: var(--ia2-window-floating-open-transform, translate(-50%, -50%) scale(1));
  }
  .ia2-window-surface[data-position="floating"][data-dragged="true"] {
    transform: none;
  }
  .ia2-window-resize-handles { display: contents; }
  .ia2-window-resize-handle {
    display: none;
    position: absolute;
    touch-action: none;
    z-index: 12;
  }
  .ia2-window-surface[data-position="floating"] .ia2-window-resize-handle,
  .ia2-window-surface[data-position="right"] .ia2-window-resize-handle[data-resize="w"],
  .ia2-window-surface[data-position="right-top"] .ia2-window-resize-handle[data-resize="w"],
  .ia2-window-surface[data-position="right-top"] .ia2-window-resize-handle[data-resize="s"],
  .ia2-window-surface[data-position="right-top"] .ia2-window-resize-handle[data-resize="sw"],
  .ia2-window-surface[data-position="right-bottom"] .ia2-window-resize-handle[data-resize="n"],
  .ia2-window-surface[data-position="right-bottom"] .ia2-window-resize-handle[data-resize="w"],
  .ia2-window-surface[data-position="right-bottom"] .ia2-window-resize-handle[data-resize="nw"],
  .ia2-window-surface[data-position="bottom"] .ia2-window-resize-handle[data-resize="n"],
  .ia2-window-surface[data-position="top"] .ia2-window-resize-handle[data-resize="s"],
  .ia2-window-surface[data-position="left"] .ia2-window-resize-handle[data-resize="e"],
  .ia2-window-surface[data-position="left-bottom"] .ia2-window-resize-handle[data-resize="n"],
  .ia2-window-surface[data-position="left-bottom"] .ia2-window-resize-handle[data-resize="e"],
  .ia2-window-surface[data-position="left-bottom"] .ia2-window-resize-handle[data-resize="ne"],
  .ia2-window-surface[data-position="left-top"] .ia2-window-resize-handle[data-resize="e"],
  .ia2-window-surface[data-position="left-top"] .ia2-window-resize-handle[data-resize="s"],
  .ia2-window-surface[data-position="left-top"] .ia2-window-resize-handle[data-resize="se"] {
    display: block;
  }
  .ia2-window-resize-handle[data-resize="n"],
  .ia2-window-resize-handle[data-resize="s"] {
    height: 10px;
    left: 18px;
    right: 18px;
  }
  .ia2-window-resize-handle[data-resize="n"] {
    cursor: ns-resize;
    top: 0;
  }
  .ia2-window-resize-handle[data-resize="s"] {
    bottom: 0;
    cursor: ns-resize;
  }
  .ia2-window-resize-handle[data-resize="e"],
  .ia2-window-resize-handle[data-resize="w"] {
    bottom: 18px;
    top: 18px;
    width: 10px;
  }
  .ia2-window-resize-handle[data-resize="e"] {
    cursor: ew-resize;
    right: 0;
  }
  .ia2-window-resize-handle[data-resize="w"] {
    cursor: ew-resize;
    left: 0;
  }
  .ia2-window-resize-handle[data-resize="ne"],
  .ia2-window-resize-handle[data-resize="nw"],
  .ia2-window-resize-handle[data-resize="se"],
  .ia2-window-resize-handle[data-resize="sw"] {
    height: 20px;
    width: 20px;
  }
  .ia2-window-resize-handle[data-resize="ne"] {
    cursor: nesw-resize;
    right: 0;
    top: 0;
  }
  .ia2-window-resize-handle[data-resize="nw"] {
    cursor: nwse-resize;
    left: 0;
    top: 0;
  }
  .ia2-window-resize-handle[data-resize="se"] {
    bottom: 0;
    cursor: nwse-resize;
    right: 0;
  }
  .ia2-window-resize-handle[data-resize="sw"] {
    bottom: 0;
    cursor: nesw-resize;
    left: 0;
  }
  .ia2-window-resize-handle[data-resize="se"]::after {
    border-bottom: 2px solid color-mix(in oklch, currentColor, transparent 68%);
    border-right: 2px solid color-mix(in oklch, currentColor, transparent 68%);
    bottom: 5px;
    content: "";
    height: 6px;
    position: absolute;
    right: 5px;
    width: 6px;
  }
  .ia2-window-surface.is-resizing {
    transition: none;
    user-select: none;
  }
  @media (max-width: 760px) {
    .ia2-window-surface,
    .ia2-window-surface[data-position] {
      border: 0;
      border-radius: 0;
      bottom: 0;
      height: 100vh;
      left: auto;
      max-width: none;
      opacity: 1;
      right: 0;
      top: 0;
      transform: translateX(105%);
      width: 100%;
    }
    .ia2-window-surface[data-position][data-open=""],
    .ia2-window-surface[data-position][data-open="true"] {
      transform: translateX(0);
    }
    .ia2-window-surface[data-position^="left"] {
      left: 0;
      right: auto;
      transform: translateX(-105%);
    }
    .ia2-window-surface[data-position] .ia2-window-resize-handles { display: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .ia2-window-surface { transition: none; }
  }
`;
function isWindowPosition(value) {
  return typeof value === "string" && WINDOW_POSITIONS.some(({ position }) => position === value);
}
function parseWindowPositions(value, fallback = "right") {
  if (!value) return WINDOW_POSITIONS.map(({ position }) => position);
  const positions = value.split(/\s+/).filter(isWindowPosition);
  return positions.length > 0 ? Array.from(new Set(positions)) : [fallback];
}
function windowResizeDirections(position) {
  return WINDOW_RESIZE_DIRECTIONS_BY_POSITION[position];
}
function windowResizeHandlesMarkup() {
  return `<div class="ia2-window-resize-handles" aria-hidden="true">${WINDOW_RESIZE_DIRECTIONS.map((direction) => `<span class="ia2-window-resize-handle" data-resize="${direction}"></span>`).join("")}</div>`;
}
function positionControlsMarkup({
  allowed = WINDOW_POSITIONS.map(({ position }) => position),
  ariaLabel,
  current,
  groupClass = "",
  optionClass = ""
}) {
  const safeGroupClass = escapeMarkup(groupClass);
  const safeOptionClass = escapeMarkup(optionClass);
  const allowedSet = new Set(allowed);
  const currentDefinition = WINDOW_POSITIONS.find(({ position }) => position === current) ?? WINDOW_POSITIONS[0];
  const options = WINDOW_POSITIONS.filter(({ position }) => allowedSet.has(position)).map(({ icon, label, position }) => `<button class="ia2-position-option ${safeOptionClass}" type="button" role="radio" data-position="${position}" aria-checked="${current === position}" aria-label="${escapeMarkup(label)}" title="${escapeMarkup(label)}" tabindex="${current === position ? "0" : "-1"}">${icon}<span class="ia2-position-label">${escapeMarkup(label)}</span></button>`).join("");
  const triggerLabel = `${ariaLabel}: ${currentDefinition.label}. Choose another position`;
  return `<div class="ia2-position-control" data-expanded="false"><button class="ia2-position-trigger" type="button" data-position="${current}" aria-expanded="false" aria-label="${escapeMarkup(triggerLabel)}" title="${escapeMarkup(currentDefinition.label)}">${currentDefinition.icon}</button><div class="ia2-position-switch ${safeGroupClass}" role="radiogroup" aria-label="${escapeMarkup(ariaLabel)}">${options}</div></div>`;
}
function updateWindowPositionControls(root, position, focus = false) {
  const control = root instanceof Element ? root.matches(".ia2-position-control") ? root : root.closest(".ia2-position-control") ?? root.querySelector(".ia2-position-control") : root.querySelector(".ia2-position-control");
  const scope = control ?? root;
  const options = Array.from(scope.querySelectorAll(".ia2-position-option"));
  for (const option of options) {
    const selected = option.dataset.position === position;
    option.setAttribute("aria-checked", String(selected));
    option.tabIndex = selected ? 0 : -1;
    if (selected && focus) option.focus();
  }
  const trigger = control?.querySelector(".ia2-position-trigger");
  const group = control?.querySelector(".ia2-position-switch");
  const definition = WINDOW_POSITIONS.find((candidate) => candidate.position === position);
  if (trigger && group && definition) {
    trigger.dataset.position = position;
    trigger.innerHTML = definition.icon;
    trigger.setAttribute(
      "aria-label",
      `${group.getAttribute("aria-label") ?? "Window position"}: ${definition.label}. Choose another position`
    );
    trigger.title = definition.label;
  }
}
function bindWindowPositionControls(root, applyPosition) {
  const group = root instanceof HTMLElement && root.matches(".ia2-position-switch") ? root : root.querySelector(".ia2-position-switch");
  const control = group?.closest(".ia2-position-control") ?? null;
  const trigger = control?.querySelector(".ia2-position-trigger") ?? null;
  const options = Array.from((control ?? root).querySelectorAll(".ia2-position-option"));
  const cleanups = [];
  const setExpanded = (expanded, focusOption = false) => {
    if (!control || !trigger) return;
    control.dataset.expanded = String(expanded);
    trigger.setAttribute("aria-expanded", String(expanded));
    if (expanded && focusOption) {
      options.find((option) => option.getAttribute("aria-checked") === "true")?.focus();
    }
  };
  if (trigger) {
    const click = () => setExpanded(control?.dataset.expanded !== "true", true);
    const keydown2 = (event) => {
      if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      setExpanded(true, true);
    };
    trigger.addEventListener("click", click);
    trigger.addEventListener("keydown", keydown2);
    cleanups.push(() => trigger.removeEventListener("click", click));
    cleanups.push(() => trigger.removeEventListener("keydown", keydown2));
  }
  for (const option of options) {
    const click = () => {
      if (!isWindowPosition(option.dataset.position)) return;
      if (applyPosition(option.dataset.position, false) !== false) {
        updateWindowPositionControls(root, option.dataset.position);
        setExpanded(false);
      }
    };
    option.addEventListener("click", click);
    cleanups.push(() => option.removeEventListener("click", click));
  }
  const keydown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = event.target instanceof HTMLButtonElement ? options.indexOf(event.target) : options.findIndex((option) => option.getAttribute("aria-checked") === "true");
    let next = current;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = options.length - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % options.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (current - 1 + options.length) % options.length;
    }
    const nextPosition = options[next]?.dataset.position;
    if (!isWindowPosition(nextPosition)) return;
    if (applyPosition(nextPosition, true) !== false) {
      updateWindowPositionControls(root, nextPosition, true);
    }
  };
  group?.addEventListener("keydown", keydown);
  cleanups.push(() => group?.removeEventListener("keydown", keydown));
  const escape = (event) => {
    if (event.key !== "Escape" || control?.dataset.expanded !== "true") return;
    event.preventDefault();
    event.stopPropagation();
    setExpanded(false);
    trigger?.focus();
  };
  control?.addEventListener("keydown", escape);
  cleanups.push(() => control?.removeEventListener("keydown", escape));
  const dismiss = (event) => {
    if (control?.dataset.expanded !== "true" || event.composedPath().includes(control)) return;
    setExpanded(false);
  };
  control?.ownerDocument.addEventListener("pointerdown", dismiss);
  cleanups.push(() => control?.ownerDocument.removeEventListener("pointerdown", dismiss));
  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
function windowViewport(document2) {
  const view = document2.defaultView;
  return {
    height: Math.max(document2.documentElement?.clientHeight || view?.innerHeight || 768, 1),
    width: Math.max(document2.documentElement?.clientWidth || view?.innerWidth || 1024, 1)
  };
}
function constrainDockedWindowDimensions(document2, dimensions, {
  minHeight = 280,
  minWidth = 320,
  mobileBreakpoint = 760
} = {}) {
  const viewport = windowViewport(document2);
  if (viewport.width <= mobileBreakpoint) return { ...dimensions };
  const minimumWidth = Math.min(minWidth, viewport.width);
  const minimumHeight = Math.min(minHeight, viewport.height);
  const constrained = {};
  if (dimensions.halfHeight !== void 0) {
    constrained.halfHeight = Math.min(Math.max(dimensions.halfHeight, minimumHeight), viewport.height);
  }
  if (dimensions.horizontalHeight !== void 0) {
    constrained.horizontalHeight = Math.min(Math.max(dimensions.horizontalHeight, minimumHeight), viewport.height);
  }
  if (dimensions.width !== void 0) {
    constrained.width = Math.min(Math.max(dimensions.width, minimumWidth), viewport.width);
  }
  return constrained;
}
function startFloatingWindowDrag(event, element, { disabled = false, margin = 8 } = {}) {
  if (disabled || event.button !== 0 || event.target instanceof Element && event.target.closest("button")) return;
  const start = element.getBoundingClientRect();
  const view = element.ownerDocument.defaultView;
  if (!view) return;
  const startX = event.clientX;
  const startY = event.clientY;
  const move = (moveEvent) => {
    const maxX = Math.max(margin, view.innerWidth - start.width - margin);
    const maxY = Math.max(margin, view.innerHeight - start.height - margin);
    const left = Math.min(maxX, Math.max(margin, start.left + moveEvent.clientX - startX));
    const top = Math.min(maxY, Math.max(margin, start.top + moveEvent.clientY - startY));
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
    element.dataset.dragged = "true";
  };
  const stop = () => {
    view.removeEventListener("pointermove", move);
    view.removeEventListener("pointerup", stop);
    view.removeEventListener("pointercancel", stop);
    element.classList.remove("is-dragging");
  };
  element.classList.add("is-dragging");
  view.addEventListener("pointermove", move);
  view.addEventListener("pointerup", stop, { once: true });
  view.addEventListener("pointercancel", stop, { once: true });
  event.preventDefault();
}
function startWindowResize(event, element, position, direction, {
  disabled = false,
  initialRect,
  margin = 8,
  minHeight = 280,
  minWidth = 320,
  mobileBreakpoint = 760,
  onChange,
  onEnd
} = {}) {
  if (disabled || event.button !== 0 || !windowResizeDirections(position).includes(direction)) return null;
  const view = element.ownerDocument.defaultView;
  const viewport = windowViewport(element.ownerDocument);
  if (!view || viewport.width <= mobileBreakpoint) return null;
  const measured = element.getBoundingClientRect();
  const start = initialRect ? {
    bottom: initialRect.y + initialRect.height,
    height: initialRect.height,
    left: initialRect.x,
    right: initialRect.x + initialRect.width,
    top: initialRect.y,
    width: initialRect.width
  } : measured;
  const startX = event.clientX;
  const startY = event.clientY;
  const availableWidth = Math.max(viewport.width - margin * 2, 1);
  const availableHeight = Math.max(viewport.height - margin * 2, 1);
  const minimumWidth = Math.min(minWidth, availableWidth);
  const minimumHeight = Math.min(minHeight, availableHeight);
  let currentRect = {
    height: start.height,
    width: start.width,
    x: start.left,
    y: start.top
  };
  const apply = (moveEvent) => {
    const deltaX = moveEvent.clientX - startX;
    const deltaY = moveEvent.clientY - startY;
    if (position !== "floating") {
      const dimensions = {};
      if (direction.includes("e")) dimensions.width = start.width + deltaX;
      if (direction.includes("w")) dimensions.width = start.width - deltaX;
      if (direction.includes("n") || direction.includes("s")) {
        const height2 = direction.includes("s") ? start.height + deltaY : start.height - deltaY;
        if (position === "top" || position === "bottom") dimensions.horizontalHeight = height2;
        else dimensions.halfHeight = height2;
      }
      const constrained = constrainDockedWindowDimensions(
        element.ownerDocument,
        dimensions,
        { minHeight, minWidth, mobileBreakpoint }
      );
      const width = constrained.width ?? start.width;
      const height = position === "top" || position === "bottom" ? constrained.horizontalHeight ?? start.height : constrained.halfHeight ?? start.height;
      if (constrained.width !== void 0) {
        element.style.setProperty("--ia2-window-width", `${constrained.width}px`);
      }
      if (constrained.halfHeight !== void 0) {
        element.style.setProperty("--ia2-window-half-height", `${constrained.halfHeight}px`);
      }
      if (constrained.horizontalHeight !== void 0) {
        element.style.setProperty("--ia2-window-horizontal-height", `${constrained.horizontalHeight}px`);
      }
      currentRect = {
        height,
        width,
        x: position.startsWith("right") ? viewport.width - width : 0,
        y: position === "bottom" || position.endsWith("-bottom") ? viewport.height - height : 0
      };
      onChange?.(currentRect);
      return;
    }
    let left = start.left;
    let top = start.top;
    let right = start.right;
    let bottom = start.bottom;
    if (direction.includes("e")) {
      right = Math.min(viewport.width - margin, Math.max(start.left + minimumWidth, start.right + deltaX));
    }
    if (direction.includes("s")) {
      bottom = Math.min(viewport.height - margin, Math.max(start.top + minimumHeight, start.bottom + deltaY));
    }
    if (direction.includes("w")) {
      left = Math.max(margin, Math.min(start.right - minimumWidth, start.left + deltaX));
    }
    if (direction.includes("n")) {
      top = Math.max(margin, Math.min(start.bottom - minimumHeight, start.top + deltaY));
    }
    currentRect = {
      height: bottom - top,
      width: right - left,
      x: left,
      y: top
    };
    element.style.height = `${currentRect.height}px`;
    element.style.left = `${currentRect.x}px`;
    element.style.top = `${currentRect.y}px`;
    element.style.width = `${currentRect.width}px`;
    element.dataset.dragged = "true";
    onChange?.(currentRect);
  };
  const stop = () => {
    view.removeEventListener("pointermove", apply);
    view.removeEventListener("pointerup", stop);
    view.removeEventListener("pointercancel", stop);
    element.classList.remove("is-resizing");
    onEnd?.(currentRect);
  };
  element.classList.add("is-resizing");
  view.addEventListener("pointermove", apply);
  view.addEventListener("pointerup", stop);
  view.addEventListener("pointercancel", stop);
  event.preventDefault();
  return stop;
}
var SCROLL_SYNC_MODES = [
  {
    mode: "off",
    label: "Scroll synchronization off",
    icon: `<svg class="sync-icon" viewBox="0 0 32 16" aria-hidden="true" focusable="false">
      <path d="M16 2v5" />
      <path d="M11.7 4.4a6 6 0 1 0 8.6 0" />
    </svg>`
  },
  {
    mode: "page",
    label: "Follow page viewport in panel",
    icon: `<svg class="sync-icon" viewBox="0 0 34 16" aria-hidden="true" focusable="false">
      <rect x="1" y="2" width="8" height="12" rx="1.5" />
      <path d="M3.5 5h3M3.5 8h3M3.5 11h3M11.5 8h9m-3-3 3 3-3 3" />
      <circle cx="24" cy="4" r=".8" fill="currentColor" stroke="none" />
      <circle cx="24" cy="8" r=".8" fill="currentColor" stroke="none" />
      <circle cx="24" cy="12" r=".8" fill="currentColor" stroke="none" />
      <path d="M27 4h6M27 8h6M27 12h6" />
    </svg>`
  },
  {
    mode: "panel",
    label: "Follow panel in page",
    icon: `<svg class="sync-icon" viewBox="0 0 34 16" aria-hidden="true" focusable="false">
      <circle cx="2" cy="4" r=".8" fill="currentColor" stroke="none" />
      <circle cx="2" cy="8" r=".8" fill="currentColor" stroke="none" />
      <circle cx="2" cy="12" r=".8" fill="currentColor" stroke="none" />
      <path d="M5 4h6M5 8h6M5 12h6M22.5 8h-9m3-3-3 3 3 3" />
      <rect x="25" y="2" width="8" height="12" rx="1.5" />
      <path d="M27.5 5h3M27.5 8h3M27.5 11h3" />
    </svg>`
  }
];
function isScrollSyncMode(value) {
  return typeof value === "string" && SCROLL_SYNC_MODES.some(({ mode }) => mode === value);
}
function scrollSyncControlsMarkup({
  ariaLabel = "Scroll synchronization",
  controlClass = "",
  current,
  label = "Sync",
  labels = {},
  optionClass = "",
  switchClass = ""
}) {
  const safeControlClass = escapeMarkup(controlClass);
  const safeOptionClass = escapeMarkup(optionClass);
  const safeSwitchClass = escapeMarkup(switchClass);
  const options = SCROLL_SYNC_MODES.map(({ icon, label: defaultLabel, mode }) => {
    const accessibleLabel = labels[mode] ?? defaultLabel;
    return `<button class="ia2-sync-option ${safeOptionClass}" type="button" role="radio" data-sync-mode="${mode}" aria-checked="${current === mode}" aria-label="${escapeMarkup(accessibleLabel)}" title="${escapeMarkup(accessibleLabel)}" tabindex="${current === mode ? "0" : "-1"}">${icon}</button>`;
  }).join("");
  return `<div class="ia2-sync-control ${safeControlClass}"><span class="ia2-sync-label sync-label">${escapeMarkup(label)}</span><div class="ia2-sync-switch ${safeSwitchClass}" role="radiogroup" aria-label="${escapeMarkup(ariaLabel)}">${options}</div></div>`;
}
function updateScrollSyncControls(root, mode, focus = false) {
  const options = Array.from(root.querySelectorAll(".ia2-sync-option"));
  for (const option of options) {
    const selected = option.dataset.syncMode === mode;
    option.setAttribute("aria-checked", String(selected));
    option.tabIndex = selected ? 0 : -1;
    if (selected && focus) option.focus();
  }
}
function bindScrollSyncControls(root, applyMode) {
  const group = root instanceof HTMLElement && root.matches(".ia2-sync-switch") ? root : root.querySelector(".ia2-sync-switch");
  const options = Array.from(root.querySelectorAll(".ia2-sync-option"));
  const cleanups = [];
  for (const option of options) {
    const click = () => {
      if (!isScrollSyncMode(option.dataset.syncMode)) return;
      if (applyMode(option.dataset.syncMode, false) !== false) {
        updateScrollSyncControls(root, option.dataset.syncMode);
      }
    };
    option.addEventListener("click", click);
    cleanups.push(() => option.removeEventListener("click", click));
  }
  const keydown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = event.target instanceof HTMLButtonElement ? options.indexOf(event.target) : options.findIndex((option) => option.getAttribute("aria-checked") === "true");
    let next = current;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = options.length - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % options.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (current - 1 + options.length) % options.length;
    }
    const nextMode = options[next]?.dataset.syncMode;
    if (!isScrollSyncMode(nextMode)) return;
    if (applyMode(nextMode, true) !== false) {
      updateScrollSyncControls(root, nextMode, true);
    }
  };
  group?.addEventListener("keydown", keydown);
  cleanups.push(() => group?.removeEventListener("keydown", keydown));
  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}

// src/completion.ts
var RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
var DCTERMS_CREATED = "http://purl.org/dc/terms/created";
var DCTERMS_CONFORMS_TO = "http://purl.org/dc/terms/conformsTo";
var PROV_ENTITY = "http://www.w3.org/ns/prov#Entity";
var PROV_WAS_DERIVED_FROM = "http://www.w3.org/ns/prov#wasDerivedFrom";
var XSD_DATE_TIME = "http://www.w3.org/2001/XMLSchema#dateTime";
var XSD_STRING2 = "http://www.w3.org/2001/XMLSchema#string";
var COMPLETION_VALUES_PROFILE = "https://ia2.dev/spec/html-rdf#completion-values-profile";
function escapedHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function literalTerm(object) {
  return {
    termType: "Literal",
    value: object.value,
    datatype: {
      termType: "NamedNode",
      value: object.datatype ?? XSD_STRING2
    },
    language: object.language ?? "",
    ...object.direction ? { direction: object.direction } : {}
  };
}
function turtleRecord(record) {
  const subject = termToTurtle({ termType: "NamedNode", value: record.subject });
  const predicate = termToTurtle({ termType: "NamedNode", value: record.predicate });
  const object = record.object.termType === "NamedNode" ? termToTurtle({ termType: "NamedNode", value: record.object.value }) : termToTurtle(literalTerm(record.object));
  return `${subject} ${predicate} ${object} .`;
}
function serializeTurtle(document2) {
  const state = termToTurtle({ termType: "NamedNode", value: document2.stateIri });
  const source = termToTurtle({
    termType: "NamedNode",
    value: document2.sourceDocumentIri
  });
  const created = termToTurtle({
    termType: "Literal",
    value: document2.createdAt,
    datatype: { termType: "NamedNode", value: XSD_DATE_TIME },
    language: ""
  });
  return [
    ...Object.entries(PREFIXES).map(([prefix, namespace2]) => `@prefix ${prefix}: <${namespace2}> .`),
    "",
    `${state} rdf:type prov:Entity ;`,
    `  prov:wasDerivedFrom ${source} ;`,
    `  dcterms:conformsTo <${COMPLETION_VALUES_PROFILE}> ;`,
    `  dcterms:created ${created} .`,
    "",
    ...document2.records.map(turtleRecord),
    ""
  ].join("\n");
}
function htmlRecord(record) {
  const subject = escapedHtml(record.subject);
  const predicate = escapedHtml(record.predicate);
  const label = escapedHtml(record.label);
  const object = escapedHtml(record.object.value);
  const carrier = record.object.termType === "NamedNode" ? `<a href="${object}" rdf-subject="${subject}" rdf-predicate="${predicate}">${object}</a>` : record.object.language ? `<span lang="${escapedHtml(record.object.language)}"${record.object.direction ? ` dir="${record.object.direction}"` : ""} rdf-subject="${subject}" rdf-predicate="${predicate}">${object}</span>` : `<data value="${object}" rdf-subject="${subject}" rdf-predicate="${predicate}"${record.object.datatype ? ` rdf-datatype="${escapedHtml(record.object.datatype)}"` : ""}>${object}</data>`;
  return `<tr><th scope="row">${label}</th><td>${carrier}</td></tr>`;
}
function serializeHtml(document2) {
  const title = escapedHtml(document2.title);
  const source = escapedHtml(document2.sourceDocumentIri);
  const state = escapedHtml(document2.stateIri);
  const created = escapedHtml(document2.createdAt);
  const rows = document2.records.length > 0 ? document2.records.map(htmlRecord).join("\n          ") : '<tr><td colspan="2">No accepted values were saved.</td></tr>';
  return `<!doctype html>
<html lang="en" rdf-version="1.2">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    :root { color-scheme: light; font-family: "Avenir Next", Avenir, "Segoe UI", sans-serif; }
    body { background: oklch(96% 0.012 80); color: oklch(24% 0.025 286); margin: 0; padding: clamp(1rem, 5vw, 4rem); }
    main { background: oklch(99% 0.006 80); border: 1px solid oklch(84% 0.025 80); box-shadow: 0 18px 48px oklch(25% 0.02 286 / 12%); margin: auto; max-width: 52rem; padding: clamp(1.3rem, 5vw, 3.5rem); }
    .kicker { color: oklch(48% 0.16 294); font-size: .72rem; font-weight: 750; letter-spacing: .08em; text-transform: uppercase; }
    h1 { font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.8rem, 5vw, 3rem); line-height: 1.05; margin: .45rem 0 1rem; }
    .source { color: oklch(46% 0.025 286); line-height: 1.55; }
    table { border-collapse: collapse; margin-top: 2rem; width: 100%; }
    th, td { border-top: 1px solid oklch(86% 0.02 80); padding: .8rem .35rem; text-align: left; vertical-align: top; }
    th { font-size: .78rem; width: 42%; }
    td { font-family: Georgia, "Times New Roman", serif; overflow-wrap: anywhere; }
    a { color: oklch(44% 0.15 294); }
    footer { color: oklch(50% 0.02 286); font-size: .7rem; margin-top: 2rem; }
  </style>
</head>
<body>
  <main>
    <p class="kicker">RDF completion values</p>
    <h1>${title}</h1>
    <p class="source">Values for <a href="${source}" rdf-subject="${state}" rdf-predicate="${PROV_WAS_DERIVED_FROM}">${source}</a></p>
    <a hidden href="${PROV_ENTITY}" rdf-subject="${state}" rdf-predicate="${RDF_TYPE}"></a>
    <a hidden href="${COMPLETION_VALUES_PROFILE}" rdf-subject="${state}" rdf-predicate="${DCTERMS_CONFORMS_TO}"></a>
    <time hidden datetime="${created}" rdf-subject="${state}" rdf-predicate="${DCTERMS_CREATED}" rdf-datatype="${XSD_DATE_TIME}">${created}</time>
    <table>
      <tbody>
          ${rows}
      </tbody>
    </table>
    <footer>Saved ${created}. This companion contains accepted values, not the source document.</footer>
  </main>
</body>
</html>
`;
}
function serializeCompletionDocument(document2, format) {
  return format === "html" ? serializeHtml(document2) : serializeTurtle(document2);
}
function statementFromQuad(quad2) {
  if (quad2.subject.termType !== "NamedNode" || quad2.object.termType === "Triple") return void 0;
  if (quad2.object.termType !== "NamedNode" && quad2.object.termType !== "Literal") return void 0;
  return {
    subject: quad2.subject.value,
    predicate: quad2.predicate.value,
    object: quad2.object.termType === "NamedNode" ? { termType: "NamedNode", value: quad2.object.value } : {
      termType: "Literal",
      value: quad2.object.value,
      datatype: quad2.object.datatype.value,
      ...quad2.object.language ? { language: quad2.object.language } : {},
      ...quad2.object.direction ? { direction: quad2.object.direction } : {}
    }
  };
}
function isHtml(contentType, source) {
  if (contentType?.toLowerCase().includes("html")) return true;
  return /^\s*(?:<!doctype\s+html|<html\b)/i.test(source);
}
function completionEntityIris(statements) {
  const entities = new Set(statements.flatMap((statement) => statement.predicate === RDF_TYPE && statement.object.termType === "NamedNode" && statement.object.value === PROV_ENTITY ? [statement.subject] : []));
  return Array.from(entities).filter((subject) => statements.some((statement) => statement.subject === subject && statement.predicate === PROV_WAS_DERIVED_FROM && statement.object.termType === "NamedNode") && statements.some((statement) => statement.subject === subject && statement.predicate === DCTERMS_CONFORMS_TO && statement.object.termType === "NamedNode" && statement.object.value === COMPLETION_VALUES_PROFILE));
}
async function parseCompletionDocument(source, options) {
  if (isHtml(options.contentType, source)) {
    const Parser2 = options.document.defaultView?.DOMParser;
    if (!Parser2) throw new Error("This browser does not provide an HTML parser.");
    const parsed = new Parser2().parseFromString(source, "text/html");
    const result = extractDataset(parsed);
    const runtimeCarriers = Array.from(
      parsed.querySelectorAll("[data-ia2-rdf-value-editor-runtime]")
    );
    if (runtimeCarriers.length > 0) {
      const runtimes = runtimeCarriers.map((carrier) => extractDataset(carrier));
      return {
        issues: runtimes.flatMap(({ diagnostics }) => diagnostics).filter(({ severity }) => severity === "error").map(({ message }) => message),
        sourceDocumentIris: Array.from(new Set(
          runtimes.map(({ sourceDocumentIri }) => sourceDocumentIri)
        )),
        statements: runtimes.flatMap(({ quads }) => quads).map(statementFromQuad).filter((statement) => Boolean(statement))
      };
    }
    const statements2 = result.quads.map(statementFromQuad).filter((statement) => Boolean(statement));
    const stateIris2 = completionEntityIris(statements2);
    const issues2 = result.diagnostics.filter(({ severity }) => severity === "error").map(({ message }) => message);
    if (stateIris2.length !== 1) {
      issues2.push(
        `A values document must identify exactly one prov:Entity derived from its source and conforming to ${COMPLETION_VALUES_PROFILE}.`
      );
    }
    return {
      issues: issues2,
      sourceDocumentIris: statements2.flatMap((statement) => stateIris2.includes(statement.subject) && statement.predicate === PROV_WAS_DERIVED_FROM && statement.object.termType === "NamedNode" ? [statement.object.value] : []),
      statements: statements2
    };
  }
  const { Parser } = await import("./chunks/src-NMCCU22N.js");
  const parser = new Parser({
    baseIRI: options.baseIri,
    ...options.contentType ? { format: options.contentType } : {}
  });
  const statements = parser.parse(source).flatMap((quad2) => {
    const statement = statementFromQuad(quad2);
    return statement ? [statement] : [];
  });
  const stateIris = completionEntityIris(statements);
  const issues = stateIris.length === 1 ? [] : [
    `A values document must identify exactly one prov:Entity derived from its source and conforming to ${COMPLETION_VALUES_PROFILE}.`
  ];
  return {
    issues,
    sourceDocumentIris: statements.flatMap((statement) => stateIris.includes(statement.subject) && statement.predicate === PROV_WAS_DERIVED_FROM && statement.object.termType === "NamedNode" ? [statement.object.value] : []),
    statements
  };
}

// ../../node_modules/@rdfjs/data-model/lib/BlankNode.js
var BlankNode = class {
  constructor(id) {
    this.value = id;
  }
  equals(other) {
    return !!other && other.termType === this.termType && other.value === this.value;
  }
};
BlankNode.prototype.termType = "BlankNode";
var BlankNode_default = BlankNode;

// ../../node_modules/@rdfjs/data-model/lib/DefaultGraph.js
var DefaultGraph = class {
  equals(other) {
    return !!other && other.termType === this.termType;
  }
};
DefaultGraph.prototype.termType = "DefaultGraph";
DefaultGraph.prototype.value = "";
var DefaultGraph_default = DefaultGraph;

// ../../node_modules/@rdfjs/data-model/lib/fromTerm.js
function fromTerm(factory3, original) {
  if (!original) {
    return null;
  }
  if (original.termType === "BlankNode") {
    return factory3.blankNode(original.value);
  }
  if (original.termType === "DefaultGraph") {
    return factory3.defaultGraph();
  }
  if (original.termType === "Literal") {
    return factory3.literal(original.value, original.language ? { language: original.language, direction: original.direction } : factory3.namedNode(original.datatype.value));
  }
  if (original.termType === "NamedNode") {
    return factory3.namedNode(original.value);
  }
  if (original.termType === "Quad") {
    const subject = factory3.fromTerm(original.subject);
    const predicate = factory3.fromTerm(original.predicate);
    const object = factory3.fromTerm(original.object);
    const graph = factory3.fromTerm(original.graph);
    return factory3.quad(subject, predicate, object, graph);
  }
  if (original.termType === "Variable") {
    return factory3.variable(original.value);
  }
  throw new Error(`unknown termType ${original.termType}`);
}
var fromTerm_default = fromTerm;

// ../../node_modules/@rdfjs/data-model/lib/Literal.js
var Literal = class {
  constructor(value, language2, datatype, direction = "") {
    this.value = value;
    this.language = language2;
    this.datatype = datatype;
    this.direction = direction;
  }
  equals(other) {
    return !!other && other.termType === this.termType && other.value === this.value && other.language === this.language && other.datatype.equals(this.datatype) && (other.direction || "") === this.direction;
  }
};
Literal.prototype.termType = "Literal";
var Literal_default = Literal;

// ../../node_modules/@rdfjs/data-model/lib/NamedNode.js
var NamedNode = class {
  constructor(iri2) {
    this.value = iri2;
  }
  equals(other) {
    return !!other && other.termType === this.termType && other.value === this.value;
  }
};
NamedNode.prototype.termType = "NamedNode";
var NamedNode_default = NamedNode;

// ../../node_modules/@rdfjs/data-model/lib/Quad.js
var Quad = class {
  constructor(subject, predicate, object, graph) {
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
    this.graph = graph;
  }
  equals(other) {
    return !!other && (other.termType === "Quad" || !other.termType) && other.subject.equals(this.subject) && other.predicate.equals(this.predicate) && other.object.equals(this.object) && other.graph.equals(this.graph);
  }
};
Quad.prototype.termType = "Quad";
Quad.prototype.value = "";
var Quad_default = Quad;

// ../../node_modules/@rdfjs/data-model/lib/Variable.js
var Variable = class {
  constructor(name) {
    this.value = name;
  }
  equals(other) {
    return !!other && other.termType === this.termType && other.value === this.value;
  }
};
Variable.prototype.termType = "Variable";
var Variable_default = Variable;

// ../../node_modules/@rdfjs/data-model/Factory.js
var dirLangStringDatatype = new NamedNode_default("http://www.w3.org/1999/02/22-rdf-syntax-ns#dirLangString");
var langStringDatatype = new NamedNode_default("http://www.w3.org/1999/02/22-rdf-syntax-ns#langString");
var stringDatatype = new NamedNode_default("http://www.w3.org/2001/XMLSchema#string");
var DataFactory = class {
  constructor() {
    this.init();
  }
  init() {
    this._data = {
      blankNodeCounter: 0,
      defaultGraph: new DefaultGraph_default()
    };
  }
  namedNode(value) {
    return new NamedNode_default(value);
  }
  blankNode(value) {
    value = value || "b" + ++this._data.blankNodeCounter;
    return new BlankNode_default(value);
  }
  literal(value, languageOrDatatype) {
    if (typeof languageOrDatatype === "string") {
      return new Literal_default(value, languageOrDatatype, langStringDatatype);
    } else if (typeof languageOrDatatype?.language === "string") {
      return new Literal_default(
        value,
        languageOrDatatype.language,
        languageOrDatatype.direction ? dirLangStringDatatype : langStringDatatype,
        languageOrDatatype.direction
      );
    } else {
      return new Literal_default(value, "", languageOrDatatype || stringDatatype);
    }
  }
  variable(value) {
    return new Variable_default(value);
  }
  defaultGraph() {
    return this._data.defaultGraph;
  }
  quad(subject, predicate, object, graph = this.defaultGraph()) {
    return new Quad_default(subject, predicate, object, graph);
  }
  fromTerm(original) {
    return fromTerm_default(this, original);
  }
  fromQuad(original) {
    return fromTerm_default(this, original);
  }
};
DataFactory.exports = [
  "blankNode",
  "defaultGraph",
  "fromQuad",
  "fromTerm",
  "literal",
  "namedNode",
  "quad",
  "variable"
];
var Factory_default = DataFactory;

// ../../node_modules/@rdfjs/data-model/index.js
var factory = new Factory_default();
var data_model_default = factory;

// ../../node_modules/@rdfjs/dataset/DatasetCore.js
function isString(s) {
  return typeof s === "string" || s instanceof String;
}
var xsdString = "http://www.w3.org/2001/XMLSchema#string";
function termToId(term) {
  if (typeof term === "string") {
    return term;
  }
  if (!term) {
    return "";
  }
  if (typeof term.id !== "undefined" && term.termType !== "Quad") {
    return term.id;
  }
  let subject, predicate, object, graph;
  switch (term.termType) {
    case "NamedNode":
      return term.value;
    case "BlankNode":
      return `_:${term.value}`;
    case "Variable":
      return `?${term.value}`;
    case "DefaultGraph":
      return "";
    case "Literal":
      if (term.language) {
        return `"${term.value}"@${term.language}${term.direction ? `--${term.direction}` : ""}`;
      }
      return `"${term.value}"${term.datatype && term.datatype.value !== xsdString ? `^^${term.datatype.value}` : ""}`;
    case "Quad":
      subject = escapeQuotes(termToId(term.subject));
      predicate = escapeQuotes(termToId(term.predicate));
      object = escapeQuotes(termToId(term.object));
      graph = term.graph.termType === "DefaultGraph" ? "" : ` ${termToId(term.graph)}`;
      return `<<${subject} ${predicate} ${object}${graph}>>`;
    default:
      throw new Error(`Unexpected termType: ${term.termType}`);
  }
}
var escapedLiteral = /^"(.*".*)(?="[^"]*$)/;
function escapeQuotes(id) {
  return id.replace(escapedLiteral, (_, quoted) => `"${quoted.replace(/"/g, '""')}`);
}
var DatasetCore = class {
  constructor(quads) {
    this._size = 0;
    this._graphs = /* @__PURE__ */ Object.create(null);
    this._id = 0;
    this._ids = /* @__PURE__ */ Object.create(null);
    this._ids["><"] = 0;
    this._entities = /* @__PURE__ */ Object.create(null);
    this._quads = /* @__PURE__ */ new Map();
    if (quads) {
      for (const quad2 of quads) {
        this.add(quad2);
      }
    }
  }
  get size() {
    let size = this._size;
    if (size !== null) {
      return size;
    }
    size = 0;
    const graphs = this._graphs;
    let subjects, subject;
    for (const graphKey2 in graphs) {
      for (const subjectKey in subjects = graphs[graphKey2].subjects) {
        for (const predicateKey in subject = subjects[subjectKey]) {
          size += Object.keys(subject[predicateKey]).length;
        }
      }
    }
    this._size = size;
    return this._size;
  }
  add(quad2) {
    let subject = termToId(quad2.subject);
    let predicate = termToId(quad2.predicate);
    let object = termToId(quad2.object);
    const graph = termToId(quad2.graph);
    let graphItem = this._graphs[graph];
    if (!graphItem) {
      graphItem = this._graphs[graph] = { subjects: {}, predicates: {}, objects: {} };
      Object.freeze(graphItem);
    }
    const ids = this._ids;
    const entities = this._entities;
    subject = ids[subject] || (ids[entities[++this._id] = subject] = this._id);
    predicate = ids[predicate] || (ids[entities[++this._id] = predicate] = this._id);
    object = ids[object] || (ids[entities[++this._id] = object] = this._id);
    this._addToIndex(graphItem.subjects, subject, predicate, object);
    this._addToIndex(graphItem.predicates, predicate, object, subject);
    this._addToIndex(graphItem.objects, object, subject, predicate);
    this._setQuad(subject, predicate, object, graph, quad2);
    this._size = null;
    return this;
  }
  delete(quad2) {
    let subject = termToId(quad2.subject);
    let predicate = termToId(quad2.predicate);
    let object = termToId(quad2.object);
    const graph = termToId(quad2.graph);
    const ids = this._ids;
    const graphs = this._graphs;
    let graphItem, subjects, predicates;
    if (!(subject = ids[subject]) || !(predicate = ids[predicate]) || !(object = ids[object]) || !(graphItem = graphs[graph]) || !(subjects = graphItem.subjects[subject]) || !(predicates = subjects[predicate]) || !(object in predicates)) {
      return this;
    }
    this._removeFromIndex(graphItem.subjects, subject, predicate, object);
    this._removeFromIndex(graphItem.predicates, predicate, object, subject);
    this._removeFromIndex(graphItem.objects, object, subject, predicate);
    if (this._size !== null) {
      this._size--;
    }
    this._deleteQuad(subject, predicate, object, graph);
    for (subject in graphItem.subjects) {
      return this;
    }
    delete graphs[graph];
    return this;
  }
  has(quad2) {
    const subject = termToId(quad2.subject);
    const predicate = termToId(quad2.predicate);
    const object = termToId(quad2.object);
    const graph = termToId(quad2.graph);
    const graphItem = this._graphs[graph];
    if (!graphItem) {
      return false;
    }
    const ids = this._ids;
    let subjectId, predicateId, objectId;
    if (isString(subject) && !(subjectId = ids[subject]) || isString(predicate) && !(predicateId = ids[predicate]) || isString(object) && !(objectId = ids[object])) {
      return false;
    }
    return this._countInIndex(graphItem.objects, objectId, subjectId, predicateId) === 1;
  }
  match(subject, predicate, object, graph) {
    return this._createDataset(this._match(subject, predicate, object, graph));
  }
  [Symbol.iterator]() {
    return this._match()[Symbol.iterator]();
  }
  // ## Private methods
  // ### `_addToIndex` adds a quad to a three-layered index.
  // Returns if the index has changed, if the entry did not already exist.
  _addToIndex(index0, key0, key1, key2) {
    const index1 = index0[key0] || (index0[key0] = {});
    const index2 = index1[key1] || (index1[key1] = {});
    const existed = key2 in index2;
    if (!existed) {
      index2[key2] = null;
    }
    return !existed;
  }
  // ### `_removeFromIndex` removes a quad from a three-layered index
  _removeFromIndex(index0, key0, key1, key2) {
    const index1 = index0[key0];
    const index2 = index1[key1];
    delete index2[key2];
    for (const key in index2) {
      return;
    }
    delete index1[key1];
    for (const key in index1) {
      return;
    }
    delete index0[key0];
  }
  // ### `_findInIndex` finds a set of quads in a three-layered index.
  // The index base is `index0` and the keys at each level are `key0`, `key1`, and `key2`.
  // Any of these keys can be undefined, which is interpreted as a wildcard.
  // `name0`, `name1`, and `name2` are the names of the keys at each level,
  // used when reconstructing the resulting quad
  // (for instance: _subject_, _predicate_, and _object_).
  // Finally, `graph` will be the graph of the created quads.
  // If `callback` is given, each result is passed through it
  // and iteration halts when it returns truthy for any quad.
  // If instead `array` is given, each result is added to the array.
  _findInIndex(index0, key0, key1, key2, name0, name1, name2, graph, callback, array) {
    let tmp, index1, index2;
    if (key0) {
      (tmp = index0, index0 = {})[key0] = tmp[key0];
    }
    for (const value0 in index0) {
      index1 = index0[value0];
      if (index1) {
        if (key1) {
          (tmp = index1, index1 = {})[key1] = tmp[key1];
        }
        for (const value1 in index1) {
          index2 = index1[value1];
          if (index2) {
            const values2 = key2 ? key2 in index2 ? [key2] : [] : Object.keys(index2);
            for (let l = 0; l < values2.length; l++) {
              const parts = {
                [name0]: value0,
                [name1]: value1,
                [name2]: values2[l]
              };
              const quad2 = this._getQuad(parts.subject, parts.predicate, parts.object, graph);
              if (array) {
                array.push(quad2);
              } else if (callback(quad2)) {
                return true;
              }
            }
          }
        }
      }
    }
    return array;
  }
  // ### `_countInIndex` counts matching quads in a three-layered index.
  // The index base is `index0` and the keys at each level are `key0`, `key1`, and `key2`.
  // Any of these keys can be undefined, which is interpreted as a wildcard.
  _countInIndex(index0, key0, key1, key2) {
    let count = 0;
    let tmp, index1, index2;
    if (key0) {
      (tmp = index0, index0 = {})[key0] = tmp[key0];
    }
    for (const value0 in index0) {
      index1 = index0[value0];
      if (index1) {
        if (key1) {
          (tmp = index1, index1 = {})[key1] = tmp[key1];
        }
        for (const value1 in index1) {
          index2 = index1[value1];
          if (index2) {
            if (key2) {
              key2 in index2 && count++;
            } else {
              count += Object.keys(index2).length;
            }
          }
        }
      }
    }
    return count;
  }
  // ### `_getGraphs` returns an array with the given graph,
  // or all graphs if the argument is null or undefined.
  _getGraphs(graph) {
    if (!isString(graph)) {
      return this._graphs;
    }
    return {
      [graph]: this._graphs[graph]
    };
  }
  _match(subject, predicate, object, graph) {
    subject = subject && termToId(subject);
    predicate = predicate && termToId(predicate);
    object = object && termToId(object);
    graph = graph && termToId(graph);
    const quads = [];
    const graphs = this._getGraphs(graph);
    const ids = this._ids;
    let content, subjectId, predicateId, objectId;
    if (isString(subject) && !(subjectId = ids[subject]) || isString(predicate) && !(predicateId = ids[predicate]) || isString(object) && !(objectId = ids[object])) {
      return quads;
    }
    for (const graphId in graphs) {
      content = graphs[graphId];
      if (content) {
        if (subjectId) {
          if (objectId) {
            this._findInIndex(content.objects, objectId, subjectId, predicateId, "object", "subject", "predicate", graphId, null, quads);
          } else {
            this._findInIndex(content.subjects, subjectId, predicateId, null, "subject", "predicate", "object", graphId, null, quads);
          }
        } else if (predicateId) {
          this._findInIndex(content.predicates, predicateId, objectId, null, "predicate", "object", "subject", graphId, null, quads);
        } else if (objectId) {
          this._findInIndex(content.objects, objectId, null, null, "object", "subject", "predicate", graphId, null, quads);
        } else {
          this._findInIndex(content.subjects, null, null, null, "subject", "predicate", "object", graphId, null, quads);
        }
      }
    }
    return quads;
  }
  _getQuad(subjectId, predicateId, objectId, graphId) {
    return this._quads.get(this._toId(subjectId, predicateId, objectId, graphId));
  }
  _setQuad(subjectId, predicateId, objectId, graphId, quad2) {
    this._quads.set(this._toId(subjectId, predicateId, objectId, graphId), quad2);
  }
  _deleteQuad(subjectId, predicateId, objectId, graphId) {
    this._quads.delete(this._toId(subjectId, predicateId, objectId, graphId));
  }
  _createDataset(quads) {
    return new this.constructor(quads);
  }
  _toId(subjectId, predicateId, objectId, graphId) {
    return `${subjectId}:${predicateId}:${objectId}:${graphId}`;
  }
};
var DatasetCore_default = DatasetCore;

// ../../node_modules/@rdfjs/dataset/Factory.js
var Factory = class {
  dataset(quads) {
    return new DatasetCore_default(quads);
  }
};
Factory.exports = ["dataset"];
var Factory_default2 = Factory;

// ../../node_modules/@rdfjs/dataset/index.js
var factory2 = new Factory_default2();
var dataset_default = factory2;

// ../../node_modules/@rdfjs/to-ntriples/lib/blankNode.js
function blankNode2(blankNode3) {
  return "_:" + blankNode3.value;
}
var blankNode_default = blankNode2;

// ../../node_modules/@rdfjs/to-ntriples/lib/dataset.js
function dataset(dataset2, toNT2) {
  return [...dataset2].map((quad2) => toNT2(quad2)).join("\n") + "\n";
}
var dataset_default2 = dataset;

// ../../node_modules/@rdfjs/to-ntriples/lib/defaultGraph.js
function defaultGraph() {
  return "";
}
var defaultGraph_default = defaultGraph;

// ../../node_modules/@rdfjs/to-ntriples/lib/namedNode.js
function namedNode2(namedNode3) {
  return "<" + namedNode3.value + ">";
}
var namedNode_default = namedNode2;

// ../../node_modules/@rdfjs/to-ntriples/lib/literal.js
var echarRegEx = /["\\\\\n\r]/;
var echarRegExAll = /["\\\\\n\r]/g;
var echarReplacement = {
  '"': '\\"',
  "\\": "\\\\",
  "\n": "\\n",
  "\r": "\\r"
};
function echarReplacer(char) {
  return echarReplacement[char];
}
function escapeValue(value) {
  if (echarRegEx.test(value)) {
    return value.replace(echarRegExAll, echarReplacer);
  }
  return value;
}
function literal2(literal3) {
  const escapedValue = escapeValue(literal3.value);
  if (literal3.datatype.value === "http://www.w3.org/2001/XMLSchema#string") {
    return '"' + escapedValue + '"';
  }
  if (literal3.datatype.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString") {
    return '"' + escapedValue + '"@' + literal3.language;
  }
  return '"' + escapedValue + '"^^' + namedNode_default(literal3.datatype);
}
var literal_default = literal2;

// ../../node_modules/@rdfjs/to-ntriples/lib/quad.js
function quad(quad2, toNT2) {
  const subjectString = toNT2(quad2.subject);
  const predicateString = toNT2(quad2.predicate);
  const objectString = toNT2(quad2.object);
  const graphString = toNT2(quad2.graph);
  return `${subjectString} ${predicateString} ${objectString} ${graphString ? graphString + " " : ""}.`;
}
var quad_default = quad;

// ../../node_modules/@rdfjs/to-ntriples/lib/variable.js
function variable(variable2) {
  return "?" + variable2.value;
}
var variable_default = variable;

// ../../node_modules/@rdfjs/to-ntriples/index.js
function toNT(term) {
  if (!term) {
    return null;
  }
  if (term.termType === "BlankNode") {
    return blankNode_default(term);
  }
  if (term.termType === "DefaultGraph") {
    return defaultGraph_default();
  }
  if (term.termType === "Literal") {
    return literal_default(term);
  }
  if (term.termType === "NamedNode") {
    return namedNode_default(term);
  }
  if (term.termType === "Quad" || term.subject && term.predicate && term.object && term.graph) {
    return quad_default(term, toNT);
  }
  if (term.termType === "Variable") {
    return variable_default(term);
  }
  if (term[Symbol.iterator]) {
    return dataset_default2(term, toNT);
  }
  throw new Error(`unknown termType ${term.termType}`);
}
var to_ntriples_default = toNT;

// ../../node_modules/@rdfjs/term-map/TermMap.js
var TermMap = class {
  constructor(entries) {
    this.index = /* @__PURE__ */ new Map();
    if (entries) {
      for (const [term, value] of entries) {
        this.set(term, value);
      }
    }
  }
  get size() {
    return this.index.size;
  }
  clear() {
    this.index.clear();
  }
  delete(term) {
    return this.index.delete(to_ntriples_default(term));
  }
  *entries() {
    for (const [, { term, value }] of this.index) {
      yield [term, value];
    }
  }
  forEach(callback, thisArg) {
    for (const entry of this.entries()) {
      callback.call(thisArg, entry[1], entry[0], this);
    }
  }
  get(term) {
    const item = this.index.get(to_ntriples_default(term));
    return item && item.value;
  }
  has(term) {
    return this.index.has(to_ntriples_default(term));
  }
  *keys() {
    for (const [, { term }] of this.index) {
      yield term;
    }
  }
  set(term, value) {
    const key = to_ntriples_default(term);
    this.index.set(key, { term, value });
    return this;
  }
  *values() {
    for (const [, { value }] of this.index) {
      yield value;
    }
  }
  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
};
var TermMap_default = TermMap;

// ../../node_modules/grapoi/Edge.js
var Edge = class {
  constructor({ dataset: dataset2, end, quad: quad2, start }) {
    this.dataset = dataset2;
    this.end = end;
    this.quad = quad2;
    this.start = start;
  }
  get term() {
    return this.quad[this.end];
  }
  get graph() {
    return this.quad.graph;
  }
  get startTerm() {
    return this.quad[this.start];
  }
};
var Edge_default = Edge;

// ../../node_modules/@rdfjs/term-set/TermSet.js
function quietToNT(term) {
  try {
    return to_ntriples_default(term);
  } catch (err) {
    return null;
  }
}
var TermSet = class {
  constructor(terms) {
    this.index = /* @__PURE__ */ new Map();
    if (terms) {
      for (const term of terms) {
        this.add(term);
      }
    }
  }
  get size() {
    return this.index.size;
  }
  add(term) {
    const key = to_ntriples_default(term);
    if (!this.index.has(key)) {
      this.index.set(key, term);
    }
    return this;
  }
  clear() {
    this.index.clear();
  }
  delete(term) {
    if (!term) {
      return false;
    }
    return this.index.delete(quietToNT(term));
  }
  entries() {
    return this.values().entries();
  }
  forEach(callbackfn, thisArg) {
    return this.values().forEach(callbackfn, thisArg);
  }
  has(term) {
    if (!term) {
      return false;
    }
    return this.index.has(quietToNT(term));
  }
  values() {
    return new Set(this.index.values());
  }
  keys() {
    return this.values();
  }
  [Symbol.iterator]() {
    return this.index.values();
  }
};
var TermSet_default = TermSet;

// ../../node_modules/@rdfjs/namespace/index.js
var handler = {
  apply: (target, thisArg, args) => target(args[0]),
  get: (target, property) => target(property)
};
function namespace(baseIRI, { factory: factory3 = data_model_default } = {}) {
  const builder = (term = "") => factory3.namedNode(`${baseIRI}${term.raw || term}`);
  return typeof Proxy === "undefined" ? builder : new Proxy(builder, handler);
}
var namespace_default = namespace;

// ../../node_modules/grapoi/lib/namespaces.js
var xsd = namespace_default("http://www.w3.org/2001/XMLSchema#");
var rdfns = namespace_default("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
var rdfs = namespace_default("http://www.w3.org/2000/01/rdf-schema#");

// ../../node_modules/grapoi/Processor.js
var Processor = class _Processor {
  static add({ ptr, start, end, subjects = [null], predicates = [null], objects = [null], graphs, callback } = {}) {
    if (!ptr.factory) {
      throw new Error("add operation requires a factory");
    }
    let edgeCallback = () => {
    };
    if (callback) {
      edgeCallback = (quad2) => {
        callback(new Edge_default({ dataset: ptr.dataset, start, end, quad: quad2 }));
      };
    }
    for (const subject of subjects) {
      for (const predicate of predicates) {
        for (const object of objects) {
          for (const graph of graphs) {
            const pattern = { subject, predicate, object, graph };
            pattern[start] = ptr.term;
            const quad2 = ptr.factory.quad(
              pattern.subject,
              pattern.predicate,
              pattern.object,
              pattern.graph
            );
            ptr.dataset.add(quad2);
            edgeCallback(quad2);
          }
        }
      }
    }
    return ptr;
  }
  static addList({ ptr, predicates, items, graphs }) {
    if (ptr.isAny()) {
      throw new Error("can't attach a list to an any ptr");
    }
    for (const predicate of predicates) {
      for (const graph of graphs) {
        const nodes = items.map(() => ptr.factory.blankNode());
        ptr.dataset.add(ptr.factory.quad(ptr.term, predicate, nodes[0] || rdfns.nil, graph));
        for (let index = 0; index < nodes.length; index++) {
          ptr.dataset.add(ptr.factory.quad(nodes[index], rdfns.first, items[index], graph));
          ptr.dataset.add(ptr.factory.quad(nodes[index], rdfns.rest, nodes[index + 1] || rdfns.nil, graph));
        }
      }
    }
    return ptr;
  }
  static delete({
    ptr,
    start,
    subjects = [null],
    predicates = [null],
    objects = [null]
  }) {
    for (const subject of subjects) {
      for (const predicate of predicates) {
        for (const object of objects) {
          const pattern = { subject, predicate, object };
          pattern[start] = ptr.term;
          const matches = ptr.dataset.match(pattern.subject, pattern.predicate, pattern.object);
          for (const quad2 of matches) {
            ptr.dataset.delete(quad2);
          }
        }
      }
    }
    return ptr;
  }
  static deleteList({ ptr, predicates }) {
    const toDelete = [];
    for (const predicate of predicates) {
      for (const quad2 of ptr.dataset.match(ptr.term, predicate)) {
        let link = quad2.object;
        toDelete.push(quad2);
        while (!rdfns.nil.equals(link)) {
          link = toDelete[toDelete.length - 1].object;
          const matches = ptr.dataset.match(link);
          if (matches.size === 0) {
            break;
          }
          for (const quad3 of matches) {
            toDelete.push(quad3);
          }
        }
      }
    }
    for (const quad2 of toDelete) {
      ptr.dataset.delete(quad2);
    }
    return ptr;
  }
  static execute({
    ptr,
    operation = "traverse",
    quantifier,
    start,
    end,
    subjects,
    predicates,
    objects,
    graphs,
    items,
    callback
  } = {}) {
    if (operation === "add") {
      return _Processor.add({ ptr, start, end, subjects, predicates, objects, graphs, callback });
    }
    if (operation === "addList") {
      return _Processor.addList({ ptr, predicates, items, graphs });
    }
    if (operation === "delete") {
      return _Processor.delete({ ptr, start, subjects, predicates, objects });
    }
    if (operation === "deleteList") {
      return _Processor.deleteList({ ptr, predicates });
    }
    if (operation === "isList") {
      return _Processor.isList({ ptr });
    }
    if (operation === "list") {
      return _Processor.list({ ptr });
    }
    if (operation === "traverse") {
      return _Processor.traverse({ ptr, quantifier, start, end, subjects, predicates, objects, graphs });
    }
    throw new Error(`unknown operation ${operation}`);
  }
  static isList({ ptr }) {
    if (ptr.isAny()) {
      return false;
    }
    if (rdfns.nil.equals(ptr.term)) {
      return true;
    }
    const item = _Processor.traverse({ ptr, predicates: [rdfns.first] });
    if (item.length === 1) {
      return true;
    }
    return false;
  }
  static list({ ptr }) {
    if (!ptr.isList()) {
      return void 0;
    }
    return {
      *[Symbol.iterator]() {
        const visited = new TermSet_default();
        while (ptr && !ptr.term.equals(rdfns.nil)) {
          if (visited.has(ptr.term)) {
            throw new Error(`Invalid list: circular reference on ${ptr.value}`);
          }
          visited.add(ptr.term);
          const value = ptr.out([rdfns.first]);
          if (value.length !== 1) {
            throw new Error(`Invalid list: rdf:first count not equals one on ${ptr.value}`);
          }
          const rest = ptr.out([rdfns.rest]);
          if (rest.length !== 1) {
            throw new Error(`Invalid list: rdf:rest count not equals one on ${ptr.value}`);
          }
          yield value[0];
          ptr = rest[0];
        }
      }
    };
  }
  static traverse({
    ptr,
    quantifier = "one",
    start = "subject",
    end = "object",
    subjects = [null],
    predicates = [null],
    objects = [null],
    graphs = [null],
    callback
  }) {
    if (quantifier === "one") {
      return _Processor.traverseOne({ ptr, start, end, subjects, predicates, objects, graphs, callback });
    }
    if (quantifier === "oneOrMore") {
      const ptrs = _Processor.traverse({ ptr, end, start, subjects, predicates, objects, graphs, callback });
      return _Processor.traverseMore({ ptrs, end, start, subjects, predicates, objects, graphs, callback });
    }
    if (quantifier === "zeroOrMore") {
      return _Processor.traverseMore({ ptrs: [ptr], end, start, subjects, predicates, objects, graphs, callback });
    }
    if (quantifier === "zeroOrOne") {
      return [ptr, ..._Processor.traverse({ ptr, end, start, subjects, predicates, objects, graphs, callback })];
    }
    throw new Error(`unknown quantifier ${quantifier}`);
  }
  static traverseMore({ ptrs, end, start, subjects, predicates, objects, graphs, callback } = {}) {
    let result = [...ptrs];
    let current;
    let last;
    do {
      current = [];
      for (const ptr of ptrs) {
        current = [
          ...current,
          ..._Processor.traverseOne({ ptr, end, start, subjects, predicates, objects, graphs, callback })
        ];
      }
      if (last) {
        current = current.filter((ptr) => !last.has(ptr.term));
      }
      ptrs = current;
      result = [...result, ...current];
      last = new TermSet_default(result.map((ptr) => ptr.term));
    } while (current.length > 0);
    return result;
  }
  static traverseOne({ ptr, start, end, subjects, predicates, objects, graphs, callback = (edge, ptr2) => ptr2.extend(edge) } = {}) {
    const results = [];
    for (const subject of subjects) {
      for (const predicate of predicates) {
        for (const object of objects) {
          for (const graph of graphs) {
            const pattern = { subject, predicate, object, graph };
            pattern[start] = ptr.term;
            for (const quad2 of ptr.dataset.match(pattern.subject, pattern.predicate, pattern.object, pattern.graph)) {
              results.push(callback(new Edge_default({ dataset: ptr.dataset, end, quad: quad2, start }), ptr));
            }
          }
        }
      }
    }
    return results;
  }
};
var Processor_default = Processor;

// ../../node_modules/grapoi/Path.js
function createEdgeCallback(context, callback) {
  if (!callback) {
    return () => {
    };
  }
  return (edge) => callback(context.extend(edge));
}
var Path = class {
  constructor({ dataset: dataset2, edges = [], factory: factory3, graph, term }) {
    if (!dataset2 && edges.length === 0) {
      throw new Error("dataset or edges is required");
    }
    if (edges.length === 0 && typeof term === "undefined") {
      throw new Error("edges or term must be given");
    }
    if (edges.length > 0 && term) {
      throw new Error("edges or term must be given");
    }
    this.dataset = dataset2 || edges[edges.length - 1].dataset;
    this.edges = edges;
    this.factory = factory3;
    this._graph = graph;
    if (edges.length === 0) {
      this._term = term;
    }
  }
  get edge() {
    return this.edges[this.edges.length - 1];
  }
  get graph() {
    if (typeof this._graph === "object") {
      return this._graph;
    }
    return this.edge && this.edge.graph;
  }
  get length() {
    if (this._term !== void 0) {
      return 1;
    }
    return this.edges.length + 1;
  }
  get startTerm() {
    return this._term || this.edges[0].startTerm;
  }
  get term() {
    if (this._term !== void 0) {
      return this._term;
    }
    return this.edge.term;
  }
  get value() {
    const term = this.term;
    return term === null ? void 0 : term.value;
  }
  addIn(predicates, subjects, callback) {
    return Processor_default.add({
      ptr: this,
      start: "object",
      end: "subject",
      subjects,
      predicates,
      graphs: [this.graph || this.factory.defaultGraph()],
      callback: createEdgeCallback(this, callback)
    });
  }
  addList(predicates, items) {
    return Processor_default.addList({
      ptr: this,
      predicates,
      graphs: [this.graph || this.factory.defaultGraph()],
      items
    });
  }
  addOut(predicates, objects, callback) {
    return Processor_default.add({
      ptr: this,
      start: "subject",
      end: "object",
      predicates,
      objects,
      graphs: [this.graph || this.factory.defaultGraph()],
      callback: createEdgeCallback(this, callback)
    });
  }
  deleteIn(predicates, subjects) {
    return Processor_default.delete({
      ptr: this,
      start: "object",
      subjects,
      predicates
    });
  }
  deleteList(predicates) {
    return Processor_default.deleteList({
      ptr: this,
      predicates
    });
  }
  deleteOut(predicates, objects) {
    return Processor_default.delete({
      ptr: this,
      start: "subject",
      predicates,
      objects
    });
  }
  execute({ operation, quantifier, start, end, subjects, predicates, objects, graphs, items, callback }) {
    return Processor_default.execute({
      ptr: this,
      operation,
      quantifier,
      start,
      end,
      subjects,
      predicates,
      objects,
      graphs,
      items,
      callback
    });
  }
  extend(edge) {
    return new this.constructor({
      dataset: this.dataset,
      edges: [...this.edges, edge],
      factory: this.factory,
      graph: this._graph
    });
  }
  hasIn(predicates, subjects) {
    return Processor_default.traverse({
      ptr: this,
      start: "object",
      end: "object",
      subjects,
      predicates,
      graphs: [this.graph]
    });
  }
  hasOut(predicates, objects) {
    return Processor_default.traverse({
      ptr: this,
      start: "subject",
      end: "subject",
      predicates,
      objects,
      graphs: [this.graph]
    });
  }
  in(predicates, subjects) {
    return Processor_default.traverse({
      ptr: this,
      start: "object",
      end: "subject",
      subjects,
      predicates,
      graphs: [this.graph]
    });
  }
  isAny() {
    return !this.term;
  }
  isList() {
    return Processor_default.isList({ ptr: this });
  }
  list() {
    return Processor_default.list({ ptr: this });
  }
  *nodes() {
    for (let index = 0; index < this.length; index++) {
      if (this._term !== void 0) {
        yield {
          dataset: this.dataset,
          term: this._term
        };
      } else if (this.edges.length > index) {
        yield {
          dataset: this.edges[index].dataset,
          term: this.edges[index].startTerm
        };
      } else if (this.edges.length === index) {
        yield {
          dataset: this.edges[index - 1].dataset,
          term: this.edges[index - 1].term
        };
      }
    }
  }
  out(predicates, objects) {
    return Processor_default.traverse({
      ptr: this,
      predicates,
      objects,
      graphs: [this.graph]
    });
  }
  *quads() {
    for (const { quad: quad2 } of this.edges) {
      yield quad2;
    }
  }
  trim() {
    return new this.constructor({
      dataset: this.dataset,
      factory: this.factory,
      graph: this.graph,
      term: this.term
    });
  }
};
var Path_default = Path;

// ../../node_modules/grapoi/lib/termIsEqual.js
function termIsEqual(a, b) {
  if (a) {
    return a.equals(b);
  }
  return a === b;
}
var termIsEqual_default = termIsEqual;

// ../../node_modules/grapoi/lib/ptrIsEqual.js
function ptrIsEqual(a, b) {
  if (a.dataset !== b.dataset) {
    return false;
  }
  if (!termIsEqual_default(a.graph, b.graph)) {
    return false;
  }
  if (!termIsEqual_default(a.term, b.term)) {
    return false;
  }
  return true;
}
var ptrIsEqual_default = ptrIsEqual;

// ../../node_modules/grapoi/PathList.js
function createExtendCallback(ptrList, callback) {
  if (!callback) {
    return () => {
    };
  }
  return (ptr) => {
    return callback(new ptrList.constructor({
      factory: ptrList.factory,
      ptrs: [ptr]
    }));
  };
}
var PathList = class {
  /**
   * Create a new instance
   * @param {DatasetCore} dataset Dataset for the pointers
   * @param {Environment} factory Factory for new quads
   * @param {Path[]} ptrs Use existing pointers
   * @param {Term[]} terms Terms for the pointers
   * @param {Term[]} graphs Graphs for the pointers
   */
  constructor({ dataset: dataset2, factory: factory3, ptrs, terms, graphs }) {
    this.factory = factory3;
    if (ptrs) {
      this.ptrs = [...ptrs];
    } else {
      this.ptrs = [];
      for (const term of terms || [null]) {
        for (const graph of graphs || [null]) {
          this.ptrs.push(new Path_default({ dataset: dataset2, factory: factory3, graph, term }));
        }
      }
    }
  }
  /**
   * Dataset of the pointer or null if there is no unique dataset.
   * @returns {DatasetCore|null} Unique dataset or null
   */
  get dataset() {
    const datasets = new Set(this.datasets);
    if (datasets.size !== 1) {
      return null;
    }
    return datasets[Symbol.iterator]().next().value;
  }
  /**
   * An array of all datasets of all pointers.
   * @returns {DatasetCore[]} Array of datasets.
   */
  get datasets() {
    return this.ptrs.map((ptr) => ptr.dataset);
  }
  /**
   * The length of the list of pointers.
   * @returns {number} Length of the list of pointers.
   */
  get length() {
    return this.ptrs.length;
  }
  /**
   * The term of the pointers if all pointers refer to a unique term.
   * @returns {Term|undefined} Term of undefined
   */
  get term() {
    const terms = new TermSet_default(this.terms);
    if (terms.size !== 1) {
      return void 0;
    }
    return terms[Symbol.iterator]().next().value;
  }
  /**
   * An array of all terms of all pointers.
   * @returns {Term[]} Array of all terms
   */
  get terms() {
    return this.ptrs.map((ptr) => ptr.term);
  }
  /**
   * The value of the pointers if all pointers refer to a unique term.
   * @returns {String|undefined} Value or undefined
   */
  get value() {
    const term = this.term;
    return term === void 0 || term === null ? void 0 : term.value;
  }
  /**
   * An array of all values of all pointers.
   * @returns {String[]} Array of all values
   */
  get values() {
    return this.ptrs.map((ptr) => ptr.value);
  }
  /**
   * Add quads with the current terms as the object
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} subjects Subjects of the quads
   * @param {function} [callback] Function called for each subject as a pointer argument
   * @returns {PathList} this
   */
  addIn(predicates, subjects, callback) {
    const extendCallback = createExtendCallback(this, callback);
    for (const ptr of this.ptrs) {
      ptr.addIn(predicates, subjects, extendCallback);
    }
    return this;
  }
  /**
   * Add lists with the given items
   * @param {Term[]} predicates Predicates of the lists
   * @param {Term[]} items List items
   * @returns {PathList} this
   */
  addList(predicates, items) {
    if (this.isAny()) {
      throw new Error("can't attach a list to an any ptr");
    }
    for (const ptr of this.ptrs) {
      ptr.addList(predicates, items);
    }
    return this;
  }
  /**
   * Add quads with the current terms as the subject
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} objects Objects of the quads
   * @param {function} [callback] Function called for each subject as a pointer argument
   * @returns {PathList} this
   */
  addOut(predicates, objects, callback) {
    const extendCallback = createExtendCallback(this, callback);
    for (const ptr of this.ptrs) {
      ptr.addOut(predicates, objects, extendCallback);
    }
    return this;
  }
  /**
   * Create a new instance of the Constructor with a cloned list of pointers.
   * @param args Additional arguments for the constructor
   * @returns {Constructor} Cloned instance
   */
  clone(args) {
    return new this.constructor({ factory: this.factory, ptrs: this.ptrs, ...args });
  }
  /**
   * Delete quads with the current terms as the object.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} subjects Subjects of the quads
   * @returns {PathList} this
   */
  deleteIn(predicates, subjects) {
    for (const ptr of this.ptrs) {
      ptr.deleteIn(predicates, subjects);
    }
    return this;
  }
  /**
   * Delete lists.
   * @param {Term[]} predicates Predicates of the lists
   * @returns {PathList} this
   */
  deleteList(predicates) {
    for (const ptr of this.ptrs) {
      ptr.deleteList(predicates);
    }
    return this;
  }
  /**
   * Delete quads with the current terms as the subject.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} objects Objects of the quads
   * @returns {PathList} this
   */
  deleteOut(predicates, objects) {
    for (const ptr of this.ptrs) {
      ptr.deleteOut(predicates, objects);
    }
    return this;
  }
  /**
   * Create a new instance with a unique set of pointers.
   * The path of the pointers is trimmed.
   * @returns {Constructor} Instance with unique pointers
   */
  distinct() {
    const ptrs = this.ptrs.reduce((unique, ptr) => {
      if (!unique.some((uPtr) => ptrIsEqual_default(uPtr, ptr))) {
        unique.push(ptr.trim());
      }
      return unique;
    }, []);
    return this.clone({ ptrs });
  }
  /**
   * Executes a single instruction.
   * @param instruction The instruction to execute
   * @returns {Constructor} Instance with the result pointers.
   */
  execute(instruction) {
    return this.clone({ ptrs: this.ptrs.flatMap((ptr) => ptr.execute(instruction)) });
  }
  /**
   * Executes an array of instructions.
   * @param instruction The instructions to execute
   * @returns {Constructor} Instance with the result pointers.
   */
  executeAll(instructions) {
    let output = this;
    for (const instruction of instructions) {
      output = output.execute(instruction);
    }
    return output;
  }
  /**
   * Filter the pointers based on the result of the given callback function.
   * @param callback
   * @returns {Constructor} Instance with the filtered pointers.
   */
  filter(callback) {
    return this.clone({ ptrs: [...this].filter(callback).map((ptr) => ptr.ptrs[0]) });
  }
  /**
   * Filter the pointers based on matching quad(s) with the current terms as the object.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} subjects Subjects of the quads
   * @returns {Constructor} Instance that contains only the filtered pointers
   */
  hasIn(predicates, subjects) {
    return this.clone({ ptrs: this.ptrs.flatMap((ptr) => ptr.hasIn(predicates, subjects)) });
  }
  /**
   * Filter the pointers based on matching quad(s) with the current terms as the subject.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} objects Objects of the quads
   * @returns {Constructor} Instance that contains only the filtered pointers
   */
  hasOut(predicates, objects) {
    return this.clone({ ptrs: this.ptrs.flatMap((ptr) => ptr.hasOut(predicates, objects)) });
  }
  /**
   * Traverse the graph with the current terms as the object.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} subjects Subjects of the quads
   * @returns {Constructor} Instance with pointers of the traversed target terms
   */
  in(predicates, subjects) {
    return this.clone({ ptrs: this.ptrs.flatMap((ptr) => ptr.in(predicates, subjects)) });
  }
  /**
   * Check if any pointer is an any-pointer.
   * @returns {boolean} True if any any-pointer was found
   */
  isAny() {
    return this.ptrs.length > 0 && this.ptrs.some((ptr) => ptr.isAny());
  }
  /**
   * Check if there is only one pointer and whether that pointer is a list.
   * @returns {boolean} True if the pointer is a list
   */
  isList() {
    if (this.ptrs.length !== 1) {
      return false;
    }
    return this.ptrs[0].isList();
  }
  /**
   * Create an iterator for the list if the instance is a list; otherwise, return undefined.
   * @returns {Iterator<Constructor>|undefined} Iterator or undefined
   */
  list() {
    if (!this.isList()) {
      return void 0;
    }
    const iterator = this.ptrs[0].list();
    const ths = this;
    return (function* () {
      for (const ptr of iterator) {
        yield ths.clone({ ptrs: [ptr] });
      }
    })();
  }
  /**
   * Map each pointer using the given callback function.
   * @param callback
   * @returns {Array} Array of mapped results
   */
  map(callback) {
    return [...this].map(callback);
  }
  /**
   * Create a new instance with pointers using the given terms.
   * @param terms Array of terms for the pointers
   * @returns {Constructor} Instance with pointers of the given terms
   */
  node(terms) {
    const dataset2 = this.dataset;
    const ptrs = [...terms].map((term) => new Path_default({ dataset: dataset2, factory: this.factory, term }));
    return this.clone({ ptrs });
  }
  /**
   * Traverse the graph with the current terms as the subject.
   * @param {Term[]} predicates Predicates of the quads
   * @param {Term[]} objects Objects of the quads
   * @returns {Constructor} Instance with pointers of the traversed target terms
   */
  out(predicates, objects) {
    return this.clone({ ptrs: this.ptrs.flatMap((ptr) => ptr.out(predicates, objects)) });
  }
  /**
   * Create an iterator of all quads of all pointer paths.
   * @returns {Iterator<Quad>} Iterator for the quads
   */
  *quads() {
    for (const { edges } of this.ptrs) {
      for (const { quad: quad2 } of edges) {
        yield quad2;
      }
    }
  }
  /**
   * Trim the path of all pointers and create a new instance for the result.
   * @returns {Constructor} Instance of the trimmed pointers
   */
  trim() {
    return this.clone({
      ptrs: this.ptrs.map((ptr) => ptr.trim())
    });
  }
  /**
   * Iterator for each pointer wrapped into a new instance.
   * @returns {Iterator<Constructor>}} Iterator for the wrapped pointers
   */
  *[Symbol.iterator]() {
    for (const ptr of this.ptrs) {
      yield this.clone({ ptrs: [ptr] });
    }
  }
};
var PathList_default = PathList;

// ../../node_modules/shacl-engine/lib/namespaces.js
var owl = namespace_default("http://www.w3.org/2002/07/owl#");
var rdf = namespace_default("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
var rdfs2 = namespace_default("http://www.w3.org/2000/01/rdf-schema#");
var sh = namespace_default("http://www.w3.org/ns/shacl#");
var shn = namespace_default("https://schemas.link/shacl-next#");
var xsd2 = namespace_default("http://www.w3.org/2001/XMLSchema#");

// ../../node_modules/shacl-engine/lib/pathsToString.js
function pathToString(path) {
  if (!path) {
    return "{}";
  }
  return `{${[...path.quads()].map((quad2) => to_ntriples_default(quad2)).join(" ")}}`;
}
function pathsToString(paths) {
  if (!paths) {
    return "{}";
  }
  return `{${paths.map((path) => pathToString(path)).join(" ")}}`;
}
var pathsToString_default = pathsToString;

// ../../node_modules/shacl-engine/lib/Report.js
var import_once = __toESM(require_once(), 1);
var Report = class {
  constructor({ details, factory: factory3, options, results = [] } = {}) {
    this.details = details;
    this.factory = factory3;
    this.options = options;
    this.results = results;
    this._conforms = (0, import_once.default)(() => !this.results.some((result) => {
      return result.severity.equals(sh.Info) || result.severity.equals(sh.Violation) || result.severity.equals(sh.Warning);
    }));
    this._ptr = (0, import_once.default)(() => this.build());
  }
  get conforms() {
    return this._conforms();
  }
  get dataset() {
    return this.ptr.dataset;
  }
  get ptr() {
    return this._ptr();
  }
  get term() {
    return this.ptr.term;
  }
  build() {
    const ptr = new PathList_default({
      dataset: this.factory.dataset(),
      factory: this.factory,
      terms: [this.factory.blankNode()]
    });
    ptr.addOut([rdf.type], [sh.ValidationReport]).addOut([sh.conforms], [this.factory.literal(this.conforms.toString(), xsd2.boolean)]);
    for (const result of this.results) {
      ptr.addOut([sh.result], [this.factory.blankNode()], (resultPtr) => {
        result.build(resultPtr, this.options);
      });
    }
    return ptr;
  }
  coverage() {
    return this.results.flatMap((result) => result.coverage());
  }
};
var Report_default = Report;

// ../../node_modules/shacl-engine/lib/Result.js
var import_once2 = __toESM(require_once(), 1);
function resolveVariables(message, args) {
  return Object.entries(args).reduce((message2, [name, value]) => {
    if (value && value.termType) {
      value = to_ntriples_default(value);
    }
    return message2.replace(`{$${name}}`, value).replace(`{?${name}}`, value);
  }, message);
}
var Result = class {
  constructor({
    args = {},
    constraintComponent,
    factory: factory3,
    focusNode,
    message = [],
    path,
    results = [],
    severity,
    shape,
    source = [],
    value,
    valuePaths = []
  } = {}) {
    this.args = args;
    this.constraintComponent = constraintComponent;
    this.factory = factory3;
    this.focusNode = focusNode;
    this.path = path || shape.path;
    this.results = results;
    this.severity = severity;
    this.shape = shape;
    this.source = source;
    this.value = value;
    this.valuePaths = valuePaths;
    this._message = (0, import_once2.default)(() => {
      if (this.shape.message.length > 0) {
        message = this.shape.message;
      }
      if (message.length === 0) {
        message = this.shape.ptr.node([this.constraintComponent]).out([sh.message]).terms;
      }
      return message.map((message2) => {
        return factory3.literal(resolveVariables(message2.value, args, factory3), message2.language || void 0);
      });
    });
  }
  get message() {
    return this._message();
  }
  build(resultPtr, { details } = {}) {
    resultPtr.addOut([rdf.type], [sh.ValidationResult]).addOut([sh.focusNode], this.focusNode.terms).addOut([sh.resultSeverity], [this.severity]).addOut([sh.sourceConstraint], this.source).addOut([sh.sourceConstraintComponent], [this.constraintComponent]).addOut([sh.sourceShape], this.shape.ptr.terms);
    if (this.message) {
      resultPtr.addOut([sh.resultMessage], this.message);
    }
    const buildResultStep = (step) => {
      if (step.quantifier === "one") {
        if (step.predicates.length > 1) {
          return resultPtr.node([this.factory.blankNode()]).addList([sh.alternativePath], step.predicates);
        }
        if (step.start === "object") {
          return resultPtr.node([this.factory.blankNode()]).addOut([sh.inversePath], [step.predicates[0]]);
        }
        return resultPtr.node([step.predicates[0]]);
      }
      if (step.quantifier === "oneOrMore") {
        return resultPtr.node([this.factory.blankNode()]).addOut([sh.oneOrMorePath], [step.predicates[0]]);
      }
      if (step.quantifier === "zeroOrMore") {
        return resultPtr.node([this.factory.blankNode()]).addOut([sh.zeroOrMorePath], [step.predicates[0]]);
      }
      if (step.quantifier === "zeroOrOne") {
        return resultPtr.node([this.factory.blankNode()]).addOut([sh.zeroOrOnePath], [step.predicates[0]]);
      }
    };
    if (this.path) {
      if (this.path.length === 1) {
        resultPtr.addOut([sh.resultPath], buildResultStep(this.path[0]).terms);
      } else {
        resultPtr.addList([sh.resultPath], this.path.map((step) => buildResultStep(step).term));
      }
    }
    if (typeof this.value !== "undefined") {
      resultPtr.addOut([sh.value], this.value.terms);
    }
    if (details) {
      for (const result of this.results) {
        resultPtr.addOut([sh.detail], [this.factory.blankNode()], (detailPtr) => {
          result.build(detailPtr, { details });
        });
      }
    }
  }
  coverage() {
    return [
      ...this.valuePaths.flatMap((valuePath) => [...valuePath.quads()]),
      ...this.results.flatMap((result) => result.coverage())
    ];
  }
};
var Result_default = Result;

// ../../node_modules/shacl-engine/lib/Context.js
var Context = class _Context {
  constructor({
    factory: factory3,
    focusNode,
    options = { debug: false, details: false },
    processed = /* @__PURE__ */ new Set(),
    report: report2 = new Report_default({ factory: factory3, options }),
    results = /* @__PURE__ */ new Map(),
    shape,
    value,
    valueOrNode,
    valuePaths,
    values: values2
  } = {}) {
    this.factory = factory3;
    this.focusNode = focusNode;
    this.options = options;
    this.processed = processed;
    this.report = report2;
    this.results = results;
    this.shape = shape;
    this.value = value;
    this.valuePaths = valuePaths;
    this.valueOrNode = valueOrNode;
    this.values = values2;
  }
  create({
    child,
    focusNode = this.focusNode,
    shape = this.shape,
    value = this.value,
    valueOrNode = this.valueOrNode,
    valuePaths = this.valuePaths,
    values: values2 = this.values
  } = {}) {
    return new _Context({
      factory: this.factory,
      focusNode,
      options: this.options,
      processed: this.processed,
      report: child ? new Report_default({ factory: this.factory, options: this.options }) : this.report,
      results: this.results,
      shape,
      value,
      valueOrNode,
      valuePaths,
      values: values2
    });
  }
  id({ shape = this.shape } = {}) {
    return `${to_ntriples_default(shape.ptr.term)} - ${to_ntriples_default(this.focusNode.term)} - ${pathsToString_default(this.valuePaths)}`;
  }
  result(args) {
    const result = new Result_default({
      factory: this.factory,
      focusNode: this.focusNode,
      shape: this.shape,
      value: this.value,
      valuePaths: this.valuePaths,
      ...args
    });
    const id = this.id();
    if (!this.results.has(id)) {
      this.results.set(id, /* @__PURE__ */ new Set([result]));
    } else {
      this.results.get(id).add(result);
    }
    this.report.results.push(result);
  }
  debug(constraintComponent, args) {
    if (this.options.debug) {
      this.result({ severity: shn.Debug, constraintComponent, ...args });
    }
  }
  trace(constraintComponent, args) {
    if (this.options.trace) {
      this.result({ severity: shn.Trace, constraintComponent, ...args });
    }
  }
  test(success, constraintComponent, args) {
    if (success) {
      this.debug(constraintComponent, args);
    } else {
      this.violation(constraintComponent, args);
    }
  }
  violation(constraintComponent, args) {
    this.result({
      constraintComponent,
      severity: this.shape.severity || sh.Violation,
      ...args
    });
  }
};
var Context_default = Context;

// ../../node_modules/shacl-engine/lib/validations/traversal.js
function compileTraversal() {
  return {
    generic: validateTraversal()
  };
}
function validateTraversal() {
  return (context) => {
    context.trace(shn.TraversalConstraintComponent, {
      args: {},
      message: [context.factory.literal("Traversal")],
      value: context.valueOrNode
    });
  };
}

// ../../node_modules/shacl-engine/lib/Registry.js
var Registry = class {
  constructor(validations2) {
    this.validations = new TermMap_default(validations2);
  }
  compile(shape) {
    const coverage = shape.validator.options.coverage;
    if (shape.deactivated) {
      return [];
    }
    let propertyValidation = false;
    const selected = /* @__PURE__ */ new Set();
    for (const property of shape.ptr.execute({ start: "subject", end: "predicate" })) {
      const result = this.validations.get(property.term);
      if (result) {
        selected.add(result);
        if (property.term.equals(sh.property)) {
          propertyValidation = true;
        }
      }
    }
    if (coverage && shape.isPropertyShape && !propertyValidation) {
      selected.add(compileTraversal);
    }
    return [...selected].map((selected2) => selected2(shape)).filter(Boolean);
  }
};
var Registry_default = Registry;

// ../../node_modules/shacl-engine/lib/Shape.js
var import_once4 = __toESM(require_once(), 1);
var import_rdf_literal = __toESM(require_rdf_literal(), 1);

// ../../node_modules/shacl-engine/lib/parsePath.js
function parseStep(ptr) {
  if (ptr.term.termType !== "BlankNode") {
    return {
      quantifier: "one",
      start: "subject",
      end: "object",
      predicates: [ptr.term]
    };
  }
  const alternativePtr = ptr.out([sh.alternativePath]);
  if (alternativePtr.ptrs.length === 1 && alternativePtr.ptrs[0].isList()) {
    return {
      quantifier: "one",
      start: "subject",
      end: "object",
      predicates: [...alternativePtr.list()].map((ptr2) => ptr2.term)
    };
  }
  const inversePtr = ptr.out([sh.inversePath]);
  if (inversePtr.term) {
    return {
      quantifier: "one",
      start: "object",
      end: "subject",
      predicates: [inversePtr.term]
    };
  }
  const oneOrMorePtr = ptr.out([sh.oneOrMorePath]);
  if (oneOrMorePtr.term) {
    return {
      quantifier: "oneOrMore",
      start: "subject",
      end: "object",
      predicates: [oneOrMorePtr.term]
    };
  }
  const zeroOrMorePtr = ptr.out([sh.zeroOrMorePath]);
  if (zeroOrMorePtr.term) {
    return {
      quantifier: "zeroOrMore",
      start: "subject",
      end: "object",
      predicates: [zeroOrMorePtr.term]
    };
  }
  const zeroOrOnePtr = ptr.out([sh.zeroOrOnePath]);
  if (zeroOrOnePtr.term) {
    return {
      quantifier: "zeroOrOne",
      start: "subject",
      end: "object",
      predicates: [zeroOrOnePtr.term]
    };
  }
}
function parsePath(ptr) {
  if (ptr.terms.length === 0) {
    return null;
  }
  if (!ptr.ptrs[0].isList()) {
    return [parseStep(ptr)];
  }
  return [...ptr.list()].map((stepPtr) => parseStep(stepPtr));
}
var parsePath_default = parsePath;

// ../../node_modules/shacl-engine/lib/ShapeValidator.js
var import_once3 = __toESM(require_once(), 1);
var ShapeValidator = class {
  constructor(shape) {
    this.shape = shape;
    this._compiled = (0, import_once3.default)(() => this.shape.validator.registry.compile(shape));
  }
  get compiled() {
    return this._compiled();
  }
  async validate(context) {
    if (context.focusNode.dataset.size === 0) {
      return context;
    }
    if (this.shape.isPropertyShape) {
      await this.validateProperty(context);
    } else {
      await this.validateNode(context);
    }
    return context;
  }
  async validateNode(context) {
    const shapeContext = context.create({ shape: this.shape, valueOrNode: context.value || context.focusNode });
    for (const validation of this.compiled) {
      if (validation.node) {
        await validation.node(shapeContext);
      }
      if (validation.generic) {
        await validation.generic(shapeContext);
      }
    }
  }
  async validateProperty(context) {
    let resolved;
    if (this.shape.isSparqlShape) {
      resolved = context.focusNode;
    } else {
      resolved = context.focusNode.executeAll(this.shape.path);
    }
    const values2 = resolved.node(new TermSet_default(resolved.terms));
    const valuesPaths = [...resolved].reduce((valuesPaths2, valuePaths) => {
      const term = valuePaths.term;
      const value = resolved.node([term]);
      if (!valuesPaths2.has(term)) {
        valuesPaths2.set(term, { value, valuePaths: [] });
      }
      valuesPaths2.get(term).valuePaths.push(valuePaths);
      return valuesPaths2;
    }, new TermMap_default()).values();
    const valuesContext = context.create({ shape: this.shape, values: values2 });
    for (const validation of this.compiled) {
      if (validation.property) {
        await validation.property(valuesContext);
      }
    }
    for (const { value, valuePaths } of valuesPaths) {
      const valueContext = context.create({ shape: this.shape, value, valueOrNode: value, valuePaths });
      for (const validation of this.compiled) {
        if (validation.generic) {
          await validation.generic(valueContext);
        }
      }
    }
  }
};
var ShapeValidator_default = ShapeValidator;

// ../../node_modules/shacl-engine/lib/resolveClasses.js
function resolveClasses(classes) {
  const resolved = new TermSet_default();
  const ptr = new PathList_default({ dataset: classes.dataset, terms: classes.terms });
  const results = ptr.execute({
    quantifier: "zeroOrMore",
    start: "object",
    end: "subject",
    predicates: [rdfs2.subClassOf]
  });
  for (const result of results.ptrs) {
    for (const { term } of result.nodes()) {
      resolved.add(term);
    }
  }
  return resolved;
}
var resolveClasses_default = resolveClasses;

// ../../node_modules/shacl-engine/lib/TargetResolver.js
var TargetResolver = class {
  constructor(ptr, { registry }) {
    this.registry = registry;
    this.targetClass = new TermSet_default([
      ...resolveClasses_default(ptr.hasOut([rdf.type], [sh.NodeShape])),
      ...resolveClasses_default(ptr.out([sh.targetClass]))
    ]);
    this.targetNode = ptr.out([sh.targetNode]).terms;
    this.targetObjectsOf = ptr.out([sh.targetObjectsOf]).terms;
    this.targetSubjectsOf = ptr.out([sh.targetSubjectsOf]).terms;
    this.targets = [...ptr.out([sh.target])];
  }
  async resolve(context) {
    const any = context.focusNode.node([null]);
    const ptrs = [
      ...context.focusNode.hasOut([rdf.type], this.targetClass).ptrs,
      ...context.focusNode.node(this.targetNode).ptrs,
      ...any.execute({ start: "object", end: "object", predicates: this.targetObjectsOf }).ptrs,
      ...any.execute({ start: "subject", end: "subject", predicates: this.targetSubjectsOf }).ptrs
    ];
    for (const targetPtr of this.targets) {
      for (const [, resolver] of this.registry.targetResolvers) {
        const terms = await resolver(targetPtr, context);
        ptrs.push(...context.focusNode.node(terms).ptrs);
      }
    }
    const resolved = context.focusNode.clone({ ptrs });
    return resolved.node([...new TermSet_default(resolved.terms)]);
  }
};
var TargetResolver_default = TargetResolver;

// ../../node_modules/shacl-engine/lib/Shape.js
var Shape = class {
  constructor(ptr, { validator }) {
    this.ptr = ptr;
    this.validator = validator;
    this._deactivated = (0, import_once4.default)(() => {
      const deactivatedTerm = this.ptr.out([sh.deactivated]).term;
      return deactivatedTerm && (0, import_rdf_literal.fromRdf)(deactivatedTerm);
    });
    this._message = (0, import_once4.default)(() => this.ptr.out([sh.message]).terms);
    this._path = (0, import_once4.default)(() => parsePath_default(this.ptr.out([sh.path])));
    this._severity = (0, import_once4.default)(() => this.ptr.out([sh.severity]).term);
    this._shapeValidator = (0, import_once4.default)(() => new ShapeValidator_default(this));
    this._sparql = (0, import_once4.default)(() => this.ptr.out([sh.sparql]));
    this._targetResolver = (0, import_once4.default)(() => new TargetResolver_default(this.ptr, { registry: this.validator.targetResolverRegistry }));
  }
  get deactivated() {
    return this._deactivated();
  }
  get isPropertyShape() {
    return Boolean(this.path);
  }
  get isSparqlShape() {
    return this.sparql.terms.length > 0;
  }
  get path() {
    return this._path();
  }
  get targetResolver() {
    return this._targetResolver();
  }
  get message() {
    return this._message();
  }
  get severity() {
    return this._severity();
  }
  get shapeValidator() {
    return this._shapeValidator();
  }
  get sparql() {
    return this._sparql();
  }
  async resolveTargets(context) {
    return this.targetResolver.resolve(context);
  }
  async validate(context) {
    const id = context.id({ shape: this });
    if (context.processed.has(id)) {
      if (context.results.has(id)) {
        for (const result of context.results.get(id)) {
          context.report.results.push(result);
        }
      }
      return context;
    }
    context.processed.add(id);
    return this.shapeValidator.validate(context);
  }
};
var Shape_default = Shape;

// ../../node_modules/shacl-engine/lib/TargetResolverRegistry.js
var TargetResolverRegistry = class {
  constructor(targetResolvers) {
    this.targetResolvers = new TermMap_default(targetResolvers);
  }
};
var TargetResolverRegistry_default = TargetResolverRegistry;

// ../../node_modules/shacl-engine/lib/validations/cardinality.js
function compileMaxCount(shape) {
  const maxCount = parseInt(shape.ptr.out([sh.maxCount]).value);
  return {
    property: validateMaxCountProperty(maxCount)
  };
}
function validateMaxCountProperty(maxCount) {
  return (context) => {
    context.test(context.values.terms.length <= maxCount, sh.MaxCountConstraintComponent, {
      args: { maxCount },
      message: [context.factory.literal("More than {$maxCount} values")]
    });
  };
}
function compileMinCount(shape) {
  const minCount = parseInt(shape.ptr.out([sh.minCount]).value);
  return {
    property: validateMinCountProperty(minCount)
  };
}
function validateMinCountProperty(minCount) {
  return (context) => {
    context.test(context.values.terms.length >= minCount, sh.MinCountConstraintComponent, {
      args: { minCount },
      message: [context.factory.literal("Less than {$minCount} values")]
    });
  };
}

// ../../node_modules/shacl-engine/lib/async.js
async function every(items, func) {
  for (const item of items) {
    if (!await func(item)) {
      return false;
    }
  }
  return true;
}
async function filter(items, func) {
  return (await Promise.all(items.map((item) => func(item)))).filter(Boolean);
}
async function map(items, func) {
  return Promise.all(items.map(func));
}
async function some(items, func) {
  for (const item of items) {
    if (await func(item)) {
      return true;
    }
  }
  return false;
}

// ../../node_modules/shacl-engine/lib/validations/logical.js
function compileAnd(shape) {
  const and = [...shape.ptr.out([sh.and])].flatMap((ptr) => [...ptr.list()]).map((ptr) => shape.validator.shape(ptr));
  return {
    generic: validateAnd(and)
  };
}
function validateAnd(and) {
  return async (context) => {
    const andReports = await map(and, async (shape) => {
      return (await shape.validate(context.create({ child: true, focusNode: context.valueOrNode }))).report;
    });
    const result = andReports.every((report2) => report2.conforms);
    context.test(result, sh.AndConstraintComponent, {
      results: andReports.flatMap((report2) => report2.results),
      value: context.valueOrNode
    });
  };
}
function compileNot(shape) {
  const not = shape.validator.shape(shape.ptr.out([sh.not]));
  return {
    generic: validateNot(not)
  };
}
function validateNot(not) {
  return async (context) => {
    const notReport = (await not.validate(context.create({ child: true, focusNode: context.valueOrNode }))).report;
    const result = !notReport.conforms;
    context.test(result, sh.NotConstraintComponent, {
      args: { not: not.ptr.term },
      message: [context.factory.literal("Value does have shape {$not}")],
      results: notReport.results,
      value: context.valueOrNode
    });
  };
}
function compileOr(shape) {
  const or = [...shape.ptr.out([sh.or])].flatMap((ptr) => [...ptr.list()]).map((ptr) => shape.validator.shape(ptr));
  return {
    generic: validateOr(or)
  };
}
function validateOr(or) {
  return async (context) => {
    let results = [];
    let result;
    if (context.options.debug || context.options.details) {
      const orReports = await map(or, async (shape) => {
        return (await shape.validate(context.create({ child: true, focusNode: context.valueOrNode }))).report;
      });
      results = orReports.flatMap((report2) => report2.results);
      result = orReports.some((report2) => report2.conforms);
    } else {
      result = await some(or, async (shape) => {
        return (await shape.validate(context.create({ child: true, focusNode: context.valueOrNode }))).report.conforms;
      });
    }
    context.test(result, sh.OrConstraintComponent, {
      results,
      value: context.valueOrNode
    });
  };
}
function compileXone(shape) {
  const xone = [...shape.ptr.out([sh.xone])].flatMap((ptr) => [...ptr.list()]).map((ptr) => shape.validator.shape(ptr));
  return {
    generic: validateXone(xone)
  };
}
function validateXone(xone) {
  return async (context) => {
    const xoneReports = await map(xone, async (shape) => {
      return (await shape.validate(context.create({ child: true, focusNode: context.valueOrNode }))).report;
    });
    const result = xoneReports.filter((report2) => report2.conforms).length === 1;
    context.test(result, sh.XoneConstraintComponent, {
      results: xoneReports.flatMap((report2) => report2.results),
      value: context.valueOrNode
    });
  };
}

// ../../node_modules/shacl-engine/lib/validations/other.js
var import_rdf_literal2 = __toESM(require_rdf_literal(), 1);
function compileClosedNode(shape) {
  const closed = (0, import_rdf_literal2.fromRdf)(shape.ptr.out([sh.closed]).term);
  if (!closed) {
    return null;
  }
  const propertyShapes = shape.ptr.out([sh.property]).map((ptr) => shape.validator.shape(ptr));
  const properties = new TermSet_default(propertyShapes.filter((shape2) => !shape2.deactivated).map((shape2) => shape2.path[0].predicates[0]));
  const ignoredProperties = new TermSet_default([...shape.ptr.out([sh.ignoredProperties]).list() || []].map((item) => item.term));
  return {
    node: validateClosedNode(properties, ignoredProperties)
  };
}
function validateClosedNode(properties, ignoredProperties) {
  return (context) => {
    const notAllowed = context.focusNode.execute({ start: "subject", end: "predicate" }).filter((property) => {
      if (ignoredProperties.has(property.term)) {
        return false;
      }
      return !properties.has(property.term);
    });
    if (notAllowed.ptrs.length > 0) {
      for (const value of notAllowed) {
        context.violation(sh.ClosedConstraintComponent, {
          message: [context.factory.literal("Predicate is not allowed (closed shape)")],
          path: [{ quantifier: "one", start: "subject", end: "object", predicates: [value.term] }],
          value: context.focusNode.node([[...value.quads()][0].object])
        });
      }
    } else {
      context.debug(sh.ClosedConstraintComponent);
    }
  };
}
function compileHasValue(shape) {
  const hasValue = shape.ptr.out([sh.hasValue]).term;
  return {
    node: validateHasValueNode(hasValue),
    property: validateHasValueProperty(hasValue)
  };
}
function validateHasValueNode(hasValue) {
  return (context) => {
    context.test(hasValue.equals(context.valueOrNode.term), sh.HasValueConstraintComponent, {
      args: { hasValue },
      message: [context.factory.literal("Value must be {$hasValue}")]
    });
  };
}
function validateHasValueProperty(hasValue) {
  return (context) => {
    const result = [...context.values].some((value) => hasValue.equals(value.term));
    context.test(result, sh.HasValueConstraintComponent, {
      args: { hasValue },
      message: [context.factory.literal("Missing expected value {$hasValue}")]
    });
  };
}
function compileIn(shape) {
  const values2 = new TermSet_default([...shape.ptr.out([sh.in]).list()].map((item) => item.term));
  return {
    generic: validateIn(values2)
  };
}
function validateIn(values2) {
  return (context) => {
    context.test(values2.has(context.valueOrNode.term), sh.InConstraintComponent, {
      args: { in: [...values2].map((v) => v.value).join(", ") },
      message: [context.factory.literal("Value is not in {$in}")],
      value: context.valueOrNode
    });
  };
}

// ../../node_modules/shacl-engine/lib/compareTerms.js
var import_rdf_literal3 = __toESM(require_rdf_literal(), 1);
function compareTerms(termA, termB) {
  if (!termA || termA.termType !== "Literal") {
    return null;
  }
  if (!termB || termB.termType !== "Literal") {
    return null;
  }
  if (hasTimezone(termA) !== hasTimezone(termB)) {
    return null;
  }
  const valueA = (0, import_rdf_literal3.fromRdf)(termA);
  const valueB = (0, import_rdf_literal3.fromRdf)(termB);
  if (typeof valueA !== typeof valueB) {
    return null;
  }
  if (typeof valueA === "string") {
    return valueA.localeCompare(valueB);
  }
  return valueA - valueB;
}
function hasTimezone(term) {
  const pattern = /^.*(((\+|-)\d{2}:\d{2})|Z)$/;
  return xsd2.dateTime.equals(term.datatype) && pattern.test(term.value);
}
var compareTerms_default = compareTerms;

// ../../node_modules/shacl-engine/lib/validations/pair.js
function compileDisjoint(shape) {
  const disjoint = shape.ptr.out([sh.disjoint]).term;
  return {
    generic: validateDisjoint(disjoint)
  };
}
function validateDisjoint(disjoint) {
  return (context) => {
    const matches = context.focusNode.dataset.match(context.focusNode.term, disjoint, context.valueOrNode.term);
    context.test(matches.size === 0, sh.DisjointConstraintComponent, {
      args: { disjoint },
      message: [context.factory.literal("Value node must not also be one of the values of {$disjoint}")],
      value: context.valueOrNode
    });
  };
}
function compileEquals(shape) {
  const equals = shape.ptr.out([sh.equals]).term;
  return {
    node: validateEqualsNode(equals),
    property: validateEqualsProperty(equals)
  };
}
function validateEqualsNode(equals) {
  return (context) => {
    const reference = context.focusNode.out([equals]);
    const notEquals = reference.filter((ptr) => !ptr.term.equals(context.focusNode.term));
    const result = reference.terms.length !== 0 && notEquals.terms.length === 0;
    context.test(result, sh.EqualsConstraintComponent, {
      args: { equals },
      message: [context.factory.literal("Must have same values as {$equals}")],
      value: notEquals.terms[0] && context.focusNode.node([notEquals.terms[0]]) || context.focusNode
    });
  };
}
function validateEqualsProperty(equals) {
  return (context) => {
    const references = new TermSet_default(context.focusNode.out([equals]).terms);
    const values2 = new TermSet_default(context.values.terms);
    const missingReferences = [...values2].filter((term) => !references.has(term));
    const missingValues = [...references].filter((term) => !values2.has(term));
    const differences = [...missingReferences, ...missingValues];
    for (const value of differences) {
      context.violation(sh.EqualsConstraintComponent, {
        args: { equals },
        message: [context.factory.literal("Must have same values as {$equals}")],
        value: context.focusNode.node([value])
      });
    }
    if (differences.length === 0) {
      context.debug(sh.EqualsConstraintComponent, {
        args: { equals },
        message: [context.factory.literal("Must have same values as {$equals}")]
      });
    }
  };
}
function compileLessThan(shape) {
  const lessThan = shape.ptr.out([sh.lessThan]).term;
  return {
    property: validateLessThanProperty(lessThan)
  };
}
function validateLessThanProperty(lessThan) {
  return (context) => {
    const references = context.focusNode.out([lessThan]).terms;
    for (const value of context.values) {
      for (const reference of references) {
        const c = compareTerms_default(value.term, reference);
        if (c === null || c >= 0) {
          context.violation(sh.LessThanConstraintComponent, {
            args: { lessThan },
            message: [context.factory.literal("Value is not less than value of {$lessThan}")],
            value
          });
        } else {
          context.debug(sh.LessThanConstraintComponent, {
            args: { lessThan },
            message: [context.factory.literal("Value is not less than value of {$lessThan}")],
            value
          });
        }
      }
    }
  };
}
function compileLessThanOrEquals(shape) {
  const lessThanOrEquals = shape.ptr.out([sh.lessThanOrEquals]).term;
  return {
    property: validateLessThanOrEqualsProperty(lessThanOrEquals)
  };
}
function validateLessThanOrEqualsProperty(lessThanOrEquals) {
  return (context) => {
    const references = context.focusNode.out([lessThanOrEquals]).terms;
    for (const value of context.values) {
      for (const reference of references) {
        const c = compareTerms_default(value.term, reference);
        if (c === null || c > 0) {
          context.violation(sh.LessThanOrEqualsConstraintComponent, {
            args: { lessThanOrEquals },
            message: [context.factory.literal("Value is not less than or equal to value of {$lessThanOrEquals}")],
            value
          });
        } else {
          context.debug(sh.LessThanOrEqualsConstraintComponent, {
            args: { lessThanOrEquals },
            message: [context.factory.literal("Value is not less than or equal to value of {$lessThanOrEquals}")],
            value
          });
        }
      }
    }
  };
}

// ../../node_modules/shacl-engine/lib/validations/range.js
function compileMaxExclusive(shape) {
  const maxExclusive = shape.ptr.out([sh.maxExclusive]).term;
  return {
    generic: validateMaxExclusive(maxExclusive)
  };
}
function validateMaxExclusive(maxExclusive) {
  return (context) => {
    const comparison = compareTerms_default(context.valueOrNode.term, maxExclusive);
    context.test(comparison !== null && comparison < 0, sh.MaxExclusiveConstraintComponent, {
      args: { maxExclusive },
      message: [context.factory.literal("Value is not less than {$maxExclusive}")],
      value: context.valueOrNode
    });
  };
}
function compileMaxInclusive(shape) {
  const maxInclusive = shape.ptr.out([sh.maxInclusive]).term;
  return {
    generic: validateMaxInclusive(maxInclusive)
  };
}
function validateMaxInclusive(maxInclusive) {
  return (context) => {
    const comparison = compareTerms_default(context.valueOrNode.term, maxInclusive);
    context.test(comparison !== null && comparison <= 0, sh.MaxInclusiveConstraintComponent, {
      args: { maxInclusive },
      message: [context.factory.literal("Value is not less than or equal to {$maxInclusive}")],
      value: context.valueOrNode
    });
  };
}
function compileMinExclusive(shape) {
  const minExclusive = shape.ptr.out([sh.minExclusive]).term;
  return {
    generic: validateMinExclusive(minExclusive)
  };
}
function validateMinExclusive(minExclusive) {
  return (context) => {
    const comparison = compareTerms_default(context.valueOrNode.term, minExclusive);
    context.test(comparison !== null && comparison > 0, sh.MinExclusiveConstraintComponent, {
      args: { minExclusive },
      message: [context.factory.literal("Value is not greater than {$minExclusive}")],
      value: context.valueOrNode
    });
  };
}
function compileMinInclusive(shape) {
  const minInclusive = shape.ptr.out([sh.minInclusive]).term;
  return {
    generic: validateMinInclusive(minInclusive)
  };
}
function validateMinInclusive(minInclusive) {
  return (context) => {
    const comparison = compareTerms_default(context.valueOrNode.term, minInclusive);
    context.test(comparison !== null && comparison >= 0, sh.MinInclusiveConstraintComponent, {
      args: { minInclusive },
      message: [context.factory.literal("Value is not greater than or equal to {$minInclusive}")],
      value: context.valueOrNode
    });
  };
}

// ../../node_modules/shacl-engine/lib/validations/shape.js
var import_rdf_literal4 = __toESM(require_rdf_literal(), 1);
function compileNode(shape) {
  const node = [...shape.ptr.out([sh.node])].map((ptr) => shape.validator.shape(ptr));
  return {
    generic: validateNode(node)
  };
}
function validateNode(node) {
  return async (context) => {
    for (const shape of node) {
      const nodeContext = await shape.validate(context.create({ child: true, focusNode: context.valueOrNode }));
      context.test(nodeContext.report.conforms, sh.NodeConstraintComponent, {
        args: { node: shape.ptr.term },
        message: [context.factory.literal("Value does not have shape {$node}")],
        results: nodeContext.report.results,
        value: context.valueOrNode
      });
    }
  };
}
function compileProperty(shape) {
  const property = [...shape.ptr.out([sh.property])].map((ptr) => shape.validator.shape(ptr));
  return {
    generic: validateProperty(property)
  };
}
function validateProperty(property) {
  return async (context) => {
    const propertyContext = context.create({ focusNode: context.valueOrNode });
    for (const shape of property) {
      await shape.validate(propertyContext);
    }
  };
}
function compileQualifiedShape(shape) {
  const valueShape = shape.validator.shape(shape.ptr.out([sh.qualifiedValueShape]));
  const valueShapesDisjointTerm = shape.ptr.out([sh.qualifiedValueShapesDisjoint]).term;
  const valueShapesDisjoint = valueShapesDisjointTerm ? (0, import_rdf_literal4.fromRdf)(valueShapesDisjointTerm) : false;
  const maxCountTerm = shape.ptr.out([sh.qualifiedMaxCount]).term;
  const maxCount = maxCountTerm ? parseInt(maxCountTerm.value) : null;
  const minCountTerm = shape.ptr.out([sh.qualifiedMinCount]).term;
  const minCount = minCountTerm ? parseInt(minCountTerm.value) : null;
  return {
    property: validateQualifiedShapeProperty(valueShape, valueShapesDisjoint, maxCount, minCount)
  };
}
function validateQualifiedShapeProperty(valueShape, valueShapesDisjoint, maxCount, minCount) {
  return async (context) => {
    const resultsDeep = [];
    let siblingShapes = [];
    if (valueShapesDisjoint) {
      siblingShapes = new Set(
        context.shape.ptr.in([sh.property]).out([sh.property]).out([sh.qualifiedValueShape]).filter((ptr) => !ptr.term.equals(valueShape.ptr.term)).map((ptr) => context.shape.validator.shape(ptr))
      );
    }
    const count = (await filter(context.values, async (value) => {
      const valueShapeReport = (await valueShape.validate(context.create({ child: true, focusNode: value }))).report;
      resultsDeep.push(valueShapeReport.results);
      if (!valueShapeReport.conforms) {
        return false;
      }
      if (siblingShapes.length === 0) {
        return true;
      }
      if (context.options.debug || context.options.details) {
        const siblingReports = await map([...siblingShapes], async (siblingShape) => {
          return (await siblingShape.validate(context.create({ child: true, focusNode: value }))).report;
        });
        resultsDeep.push(siblingReports.flatMap((report2) => report2.results));
        return !siblingReports.every((report2) => report2.conforms);
      } else {
        return !await every([...siblingShapes], async (siblingShape) => {
          return (await siblingShape.validate(context.create({ child: true, focusNode: value }))).report.conforms;
        });
      }
    })).length;
    if (maxCount !== null) {
      context.test(count <= maxCount, sh.QualifiedMaxCountConstraintComponent, {
        args: {
          qualifiedMaxCount: maxCount,
          qualifiedValueShape: valueShape.ptr.term,
          qualifiedValueShapesDisjoint: valueShapesDisjoint
        },
        message: [context.factory.literal("More than {$qualifiedMaxCount} values have shape {$qualifiedValueShape}")],
        results: resultsDeep.flat()
      });
    }
    if (minCount !== null) {
      context.test(count >= minCount, sh.QualifiedMinCountConstraintComponent, {
        args: {
          qualifiedMinCount: minCount,
          qualifiedValueShape: valueShape.ptr.term,
          qualifiedValueShapesDisjoint: valueShapesDisjoint
        },
        message: [context.factory.literal("Less than {$qualifiedMinCount} values have shape {$qualifiedValueShape}")],
        results: resultsDeep.flat()
      });
    }
  };
}

// ../../node_modules/shacl-engine/lib/validations/string.js
function languageMatch(item, language2) {
  if (!language2) {
    return false;
  }
  return language2.slice(0, item.length) === item;
}
function compileLanguageIn(shape) {
  const languageIn = [...new Set([...shape.ptr.out([sh.languageIn]).list()].map((item) => item.value))];
  return {
    generic: validateLanguageIn(languageIn)
  };
}
function validateLanguageIn(languageIn) {
  return (context) => {
    const result = languageIn.some((item) => languageMatch(item, context.valueOrNode.term.language));
    context.test(result, sh.LanguageInConstraintComponent, {
      args: { languageIn: languageIn.join(", ") },
      message: [context.factory.literal("Language does not match any of {$languageIn}")],
      value: context.valueOrNode
    });
  };
}
function compileMaxLength(shape) {
  const maxLength = parseInt(shape.ptr.out([sh.maxLength]).value);
  return {
    generic: validateMaxLength(maxLength)
  };
}
function validateMaxLength(maxLength) {
  return (context) => {
    const result = context.valueOrNode.term.termType !== "BlankNode" && context.valueOrNode.value.length <= maxLength;
    context.test(result, sh.MaxLengthConstraintComponent, {
      args: { maxLength },
      message: [context.factory.literal("Value has more than {$maxLength} characters")],
      value: context.valueOrNode
    });
  };
}
function compileMinLength(shape) {
  const minLength = parseInt(shape.ptr.out([sh.minLength]).value);
  return {
    generic: validateMinLength(minLength)
  };
}
function validateMinLength(minLength) {
  return (context) => {
    const result = context.valueOrNode.term.termType !== "BlankNode" && context.valueOrNode.value.length >= minLength;
    context.test(result, sh.MinLengthConstraintComponent, {
      args: { minLength },
      message: [context.factory.literal("Value has less than {$minLength} characters")],
      value: context.valueOrNode
    });
  };
}
function compilePattern(shape) {
  const pattern = shape.ptr.out([sh.pattern]).value;
  const flags = shape.ptr.out([sh.flags]).value;
  const regex = new RegExp(pattern, flags);
  return {
    generic: validatePattern(pattern, flags, regex)
  };
}
function validatePattern(pattern, flags, regex) {
  return (context) => {
    context.test(regex.test(context.valueOrNode.term.value), sh.PatternConstraintComponent, {
      args: { flags, pattern },
      message: [context.factory.literal('Value does not match pattern "{$pattern}"')],
      value: context.valueOrNode
    });
  };
}
function compileUniqueLang(shape) {
  const term = shape.ptr.out([sh.uniqueLang]).term;
  const uniqueLang = term.value === "true" && xsd2.boolean.equals(term.datatype);
  if (!uniqueLang) {
    return null;
  }
  return {
    property: validateUniqueLangProperty()
  };
}
function validateUniqueLangProperty() {
  return (context) => {
    const result = Object.entries(context.values.terms.reduce((result2, term) => {
      if (term.language) {
        result2[term.language] = (result2[term.language] || 0) + 1;
      }
      return result2;
    }, {}));
    const invalid = result.filter(([, count]) => count > 1);
    for (const [lang] of invalid) {
      context.violation(sh.UniqueLangConstraintComponent, {
        args: { lang },
        message: [context.factory.literal('Language "{?lang}" used more than once')]
      });
    }
    if (invalid.length === 0) {
      context.debug(sh.UniqueLangConstraintComponent);
    }
  };
}

// ../../node_modules/rdf-validation/lib/namespaces.js
var sh2 = namespace_default("http://www.w3.org/ns/shacl#");
var shn2 = namespace_default("https://schemas.link/shacl-next#");

// ../../node_modules/rdf-validation/lib/Report.js
var Report2 = class {
  constructor({ results = [] } = {}) {
    this.results = results;
  }
  get conforms() {
    return !this.results.some((result) => {
      return result.severity.equals(sh2.Info) || result.severity.equals(sh2.Violation) || result.severity.equals(sh2.Warning);
    });
  }
};
var Report_default2 = Report2;

// ../../node_modules/rdf-validation/lib/Result.js
function resolveVariables2(message, args) {
  return Object.entries(args).reduce((message2, [name, value]) => {
    if (value && value.termType) {
      value = to_ntriples_default(value);
    }
    return message2.replace(`{$${name}}`, value).replace(`{?${name}}`, value);
  }, message);
}
var Result2 = class {
  constructor({ args = {}, factory: factory3, message = [], severity = sh2.Violation } = {}) {
    this.severity = severity;
    this.message = message.map((message2) => {
      return factory3.literal(resolveVariables2(message2.value, args), message2.language || null);
    });
  }
};
var Result_default2 = Result2;

// ../../node_modules/rdf-validation/lib/Validation.js
var Validation = class _Validation {
  constructor({ factory: factory3 = data_model_default } = {}) {
    this.factory = factory3;
  }
  clone({ factory: factory3 } = {}) {
    return new _Validation({
      factory: factory3 || this.factory
    });
  }
  validate() {
    return new Report_default2();
  }
  validateSimple() {
    return true;
  }
};
var Validation_default = Validation;

// ../../node_modules/rdf-validation/lib/term/DatatypeValidation.js
var DatatypeValidation = class _DatatypeValidation extends Validation_default {
  constructor({ datatypes, factory: factory3 } = {}) {
    super({ factory: factory3 });
    this.datatypes = [];
    for (const datatype of Array.isArray(datatypes) ? datatypes : [datatypes]) {
      if (datatype) {
        this.datatypes.push(this.factory.fromTerm(datatype));
      }
    }
  }
  clone({ factory: factory3 } = {}) {
    return new _DatatypeValidation({
      datatypes: this.datatypes,
      factory: factory3 || this.factory
    });
  }
};
var DatatypeValidation_default = DatatypeValidation;

// ../../node_modules/rdf-validation/lib/term/DatatypeValidations.js
var DatatypeValidations = class {
  constructor({ factory: factory3 = data_model_default, validations: validations2 } = {}) {
    this.factory = factory3;
    this.validations = new TermMap_default();
    if (validations2) {
      for (const validation of Object.values(validations2)) {
        const clone = validation.clone({ factory: this.factory });
        for (const datatype of clone.datatypes) {
          this.validations.set(datatype, clone);
        }
      }
    }
  }
  validate(term) {
    const validation = this.validations.get(term.datatype);
    if (!validation) {
      return new Report_default2();
    }
    return validation.validate(term);
  }
  validateSimple(term) {
    const validation = this.validations.get(term.datatype);
    if (!validation) {
      return true;
    }
    return validation.validateSimple(term);
  }
};
var DatatypeValidations_default = DatatypeValidations;

// ../../node_modules/rdf-validation/lib/term/PatternValidation.js
var PatternValidation = class _PatternValidation extends DatatypeValidation_default {
  constructor(patterns, datatypes, { factory: factory3 } = {}) {
    super({ datatypes, factory: factory3 });
    this.message = [this.factory.literal("term value {$this} matches pattern {$pattern}")];
    this.patterns = Array.isArray(patterns) ? patterns : [patterns];
  }
  clone({ factory: factory3 } = {}) {
    return new _PatternValidation(this.patterns, this.datatypes, {
      factory: factory3 || this.factory
    });
  }
  validate(term) {
    const results = this.patterns.map((pattern) => {
      let severity;
      if (pattern.test(term.value)) {
        severity = shn2.Debug;
      }
      const args = {
        pattern: this.factory.literal(pattern.toString()),
        this: term
      };
      return new Result_default2({
        args,
        factory: this.factory,
        message: this.message,
        severity
      });
    });
    return new Report_default2({ results });
  }
  validateSimple(term) {
    return this.patterns.every((pattern) => pattern.test(term.value));
  }
};
var PatternValidation_default = PatternValidation;

// ../../node_modules/rdf-validation/lib/term/IntegerValidation.js
var integerPattern = /^([-+]?[0-9]+)$/;
var IntegerValidation = class _IntegerValidation extends PatternValidation_default {
  constructor(minInclusive = null, maxInclusive = null, datatypes, { factory: factory3 } = {}) {
    super(integerPattern, datatypes, { factory: factory3 });
    this.maxInclusive = null;
    this.minInclusive = null;
    if (typeof maxInclusive === "string") {
      this.maxInclusive = BigInt(maxInclusive);
    }
    if (typeof minInclusive === "string") {
      this.minInclusive = BigInt(minInclusive);
    }
  }
  clone({ factory: factory3 } = {}) {
    return new _IntegerValidation(
      this.minInclusive?.toString(),
      this.maxInclusive?.toString(),
      this.datatypes,
      {
        factory: factory3 || this.factory
      }
    );
  }
  validate(term) {
    const results = super.validate(term).results;
    if (!shn2.Debug.equals(results[0].severity)) {
      return new Report_default2({ results });
    }
    const value = BigInt(term.value);
    if (this.minInclusive !== null && value < this.minInclusive) {
      const messageStr = `term value "${term.value}" is less than "${this.minInclusive.toString()}"`;
      const message = [this.factory.literal(messageStr)];
      results.push(new Result_default2({ factory: this.factory, message }));
    }
    if (this.maxInclusive !== null && value > this.maxInclusive) {
      const messageStr = `term value "${term.value}" is greater than "${this.maxInclusive.toString()}"`;
      const message = [this.factory.literal(messageStr)];
      results.push(new Result_default2({ factory: this.factory, message }));
    }
    return new Report_default2({ results });
  }
  validateSimple(term) {
    if (!super.validateSimple(term)) {
      return false;
    }
    const value = BigInt(term.value);
    if (this.minInclusive !== null && value < this.minInclusive) {
      return false;
    }
    if (this.maxInclusive !== null && value > this.maxInclusive) {
      return false;
    }
    return true;
  }
};
var IntegerValidation_default = IntegerValidation;

// ../../node_modules/rdf-validation/lib/term/InValidation.js
var InValidation = class _InValidation extends DatatypeValidation_default {
  constructor(values2, datatypes, { factory: factory3 } = {}) {
    super({ datatypes, factory: factory3 });
    this.values = new Set(values2);
  }
  clone({ factory: factory3 } = {}) {
    return new _InValidation(this.values, this.datatypes, {
      factory: factory3 || this.factory
    });
  }
  validate(term) {
    const results = [];
    if (!this.values.has(term.value)) {
      const messageStr = `term value "${term.value}" is not included in the list: ${[...this.values].join(",")}`;
      const message = [this.factory.literal(messageStr)];
      results.push(new Result_default2({ factory: this.factory, message }));
    }
    return new Report_default2({ results });
  }
  validateSimple(term) {
    return this.values.has(term.value);
  }
};
var InValidation_default = InValidation;

// ../../node_modules/rdf-validation/lib/term/xsd.js
var xsd_exports = {};
__export(xsd_exports, {
  anyAtomicType: () => anyAtomicType,
  anySimpleType: () => anySimpleType,
  anyURI: () => anyURI,
  base64Binary: () => base64Binary,
  boolean: () => boolean,
  byte: () => byte,
  date: () => date,
  dateTime: () => dateTime,
  dateTimeStamp: () => dateTimeStamp,
  dayTimeDuration: () => dayTimeDuration,
  decimal: () => decimal,
  double: () => double,
  duration: () => duration,
  float: () => float,
  gDay: () => gDay,
  gMonth: () => gMonth,
  gMonthDay: () => gMonthDay,
  gYear: () => gYear,
  gYearMonth: () => gYearMonth,
  hexBinary: () => hexBinary,
  int: () => int,
  integer: () => integer,
  language: () => language,
  long: () => long,
  negativeInteger: () => negativeInteger,
  nonNegativeInteger: () => nonNegativeInteger,
  nonPositiveInteger: () => nonPositiveInteger,
  normalizedString: () => normalizedString,
  positiveInteger: () => positiveInteger,
  short: () => short,
  string: () => string,
  time: () => time,
  token: () => token,
  unsignedByte: () => unsignedByte,
  unsignedInt: () => unsignedInt,
  unsignedLong: () => unsignedLong,
  unsignedShort: () => unsignedShort,
  yearMonthDuration: () => yearMonthDuration
});
var ns = {
  xsd: namespace_default("http://www.w3.org/2001/XMLSchema#")
};
var anySimpleType = new DatatypeValidation_default({ datatypes: ns.xsd.anySimpleType });
var anyAtomicType = new DatatypeValidation_default({ datatypes: ns.xsd.anyAtomicType });
var stringPattern = /^([^\ud8ff-\udfff\ufffe-\uffff]*)$/;
var decimalPattern = /^((\+|-)?([0-9]+(\.[0-9]*)?|\.[0-9]+))$/;
var floatPattern = /^((\+|-)?([0-9]+(\.[0-9]*)?|\.[0-9]+)([Ee](\+|-)?[0-9]+)?|(\+|-)?INF|NaN)$/;
var durationPattern = /^(-?P((([0-9]+Y([0-9]+M)?([0-9]+D)?|([0-9]+M)([0-9]+D)?|([0-9]+D))(T(([0-9]+H)([0-9]+M)?([0-9]+(\.[0-9]+)?S)?|([0-9]+M)([0-9]+(\.[0-9]+)?S)?|([0-9]+(\.[0-9]+)?S)))?)|(T(([0-9]+H)([0-9]+M)?([0-9]+(\.[0-9]+)?S)?|([0-9]+M)([0-9]+(\.[0-9]+)?S)?|([0-9]+(\.[0-9]+)?S)))))$/;
var dateTimePattern = /^(-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?)$/;
var timePattern = /^((([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?)$/;
var datePattern = /^(-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?)$/;
var gYearMonthPattern = /^(-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?)$/;
var gYearPattern = /^(-?([1-9][0-9]{3,}|0[0-9]{3})(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?)$/;
var gMonthDayPattern = /^(--(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?)$/;
var gDayPattern = /^(---(0[1-9]|[12][0-9]|3[01])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?)$/;
var gMonthPattern = /^(--(0[1-9]|1[0-2])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?)$/;
var hexBinaryPattern = /^(([0-9a-fA-F]{2})*)$/;
var base64BinaryPattern = /^(((([A-Za-z0-9+/] ?){4})*(([A-Za-z0-9+/] ?){3}[A-Za-z0-9+/]|([A-Za-z0-9+/] ?){2}[AEIMQUYcgkosw048] ?=|[A-Za-z0-9+/] ?[AQgw] ?= ?=))?)$/;
var string = new PatternValidation_default(stringPattern, ns.xsd.string);
var boolean = new InValidation_default(["1", "true", "0", "false"], ns.xsd.boolean);
var decimal = new PatternValidation_default(decimalPattern, ns.xsd.decimal);
var float = new PatternValidation_default(floatPattern, ns.xsd.float);
var double = new PatternValidation_default(floatPattern, ns.xsd.double);
var duration = new PatternValidation_default(durationPattern, ns.xsd.duration);
var dateTime = new PatternValidation_default(dateTimePattern, ns.xsd.dateTime);
var time = new PatternValidation_default(timePattern, ns.xsd.time);
var date = new PatternValidation_default(datePattern, ns.xsd.date);
var gYearMonth = new PatternValidation_default(gYearMonthPattern, ns.xsd.gYearMonth);
var gYear = new PatternValidation_default(gYearPattern, ns.xsd.gYear);
var gMonthDay = new PatternValidation_default(gMonthDayPattern, ns.xsd.gMonthDay);
var gDay = new PatternValidation_default(gDayPattern, ns.xsd.gDay);
var gMonth = new PatternValidation_default(gMonthPattern, ns.xsd.gMonth);
var hexBinary = new PatternValidation_default(hexBinaryPattern, ns.xsd.hexBinary);
var base64Binary = new PatternValidation_default(base64BinaryPattern, ns.xsd.base64Binary);
var anyURI = new PatternValidation_default(stringPattern, ns.xsd.anyURI);
var normalizedStringPattern = /^([^\u000d\u000a\u0009]*)$/;
var tokenPattern = /^([^ ]+( [^ ]+)*)*$/;
var languagePattern = /^([a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*)$/;
var yearMonthDurationPattern = /^([^DT]*)$/;
var dayTimeDurationPattern = /^([^YM]*[DT].*)$/;
var dateTimeStampPattern = /^(.*(Z|(\+|-)[0-9][0-9]:[0-9][0-9]))$/;
var normalizedString = new PatternValidation_default([stringPattern, normalizedStringPattern], ns.xsd.normalizedString);
var token = new PatternValidation_default([stringPattern, normalizedStringPattern, tokenPattern], ns.xsd.token);
var language = new PatternValidation_default(languagePattern, ns.xsd.language);
var integer = new IntegerValidation_default(null, null, ns.xsd.integer);
var nonPositiveInteger = new IntegerValidation_default(null, "0", ns.xsd.nonPositiveInteger);
var negativeInteger = new IntegerValidation_default(null, "-1", ns.xsd.negativeInteger);
var long = new IntegerValidation_default("-9223372036854775808", "9223372036854775807", ns.xsd.long);
var int = new IntegerValidation_default("-2147483648", "2147483647", ns.xsd.int);
var short = new IntegerValidation_default("-32768", "32767", ns.xsd.short);
var byte = new IntegerValidation_default("-128", "127", ns.xsd.byte);
var nonNegativeInteger = new IntegerValidation_default("0", null, ns.xsd.nonNegativeInteger);
var unsignedLong = new IntegerValidation_default("0", "18446744073709551615", ns.xsd.unsignedLong);
var unsignedInt = new IntegerValidation_default("0", "4294967295", ns.xsd.unsignedInt);
var unsignedShort = new IntegerValidation_default("0", "65535", ns.xsd.unsignedShort);
var unsignedByte = new IntegerValidation_default("0", "255", ns.xsd.unsignedByte);
var positiveInteger = new IntegerValidation_default("1", null, ns.xsd.positiveInteger);
var yearMonthDuration = new PatternValidation_default([durationPattern, yearMonthDurationPattern], ns.xsd.yearMonthDuration);
var dayTimeDuration = new PatternValidation_default([durationPattern, dayTimeDurationPattern], ns.xsd.dayTimeDuration);
var dateTimeStamp = new PatternValidation_default([dateTimePattern, dateTimeStampPattern], ns.xsd.dateTimeStamp);

// ../../node_modules/rdf-validation/lib/term/XsdValidation.js
var XsdValidation = class extends DatatypeValidations_default {
  constructor({ factory: factory3 } = {}) {
    super({ factory: factory3, validations: { ...xsd_exports } });
  }
};
var XsdValidation_default = XsdValidation;

// ../../node_modules/shacl-engine/lib/validations/type.js
var toTermType = new TermMap_default([
  [sh.BlankNode, /* @__PURE__ */ new Set(["BlankNode"])],
  [sh.BlankNodeOrIRI, /* @__PURE__ */ new Set(["BlankNode", "NamedNode"])],
  [sh.BlankNodeOrLiteral, /* @__PURE__ */ new Set(["BlankNode", "Literal"])],
  [sh.IRI, /* @__PURE__ */ new Set(["NamedNode"])],
  [sh.IRIOrLiteral, /* @__PURE__ */ new Set(["NamedNode", "Literal"])],
  [sh.Literal, /* @__PURE__ */ new Set(["Literal"])]
]);
function compileClass(shape) {
  const classes = shape.ptr.out([sh.class]).map((ptr) => resolveClasses_default(ptr));
  return {
    generic: validateClass(classes)
  };
}
function validateClass(classes) {
  return (context) => {
    const types = new TermSet_default(context.valueOrNode.out([rdf.type]).terms);
    for (const classSet of classes) {
      const result = [...types].some((type) => classSet.has(type));
      context.test(result, sh.ClassConstraintComponent, { value: context.valueOrNode });
    }
  };
}
function compileDatatype(shape) {
  const datatype = shape.ptr.out([sh.datatype]).term;
  const validation = new XsdValidation_default();
  return {
    generic: validateDatatype(datatype, validation)
  };
}
function validateDatatype(datatype, validation) {
  return (context) => {
    const result = datatype.equals(context.valueOrNode.term.datatype) && validation.validateSimple(context.valueOrNode.term);
    context.test(result, sh.DatatypeConstraintComponent, {
      args: { datatype },
      message: [context.factory.literal("Value does not have datatype {$datatype}")],
      value: context.valueOrNode
    });
  };
}
function compileNodeKind(shape) {
  const nodeKind = shape.ptr.out([sh.nodeKind]).term;
  const termTypes = toTermType.get(nodeKind);
  return {
    generic: validateNodeKind(nodeKind, termTypes)
  };
}
function validateNodeKind(nodeKind, termTypes) {
  return (context) => {
    context.test(termTypes.has(context.valueOrNode.term.termType), sh.NodeKindConstraintComponent, {
      args: { nodeKind },
      message: [context.factory.literal("Value does not have node kind {$nodeKind}")],
      value: context.valueOrNode
    });
  };
}

// ../../node_modules/shacl-engine/lib/validations.js
var validations = new TermMap_default([
  [sh.maxCount, compileMaxCount],
  [sh.minCount, compileMinCount],
  [sh.and, compileAnd],
  [sh.not, compileNot],
  [sh.or, compileOr],
  [sh.xone, compileXone],
  [sh.closed, compileClosedNode],
  [sh.hasValue, compileHasValue],
  [sh.in, compileIn],
  [sh.disjoint, compileDisjoint],
  [sh.equals, compileEquals],
  [sh.lessThan, compileLessThan],
  [sh.lessThanOrEquals, compileLessThanOrEquals],
  [sh.maxExclusive, compileMaxExclusive],
  [sh.maxInclusive, compileMaxInclusive],
  [sh.minExclusive, compileMinExclusive],
  [sh.minInclusive, compileMinInclusive],
  [sh.node, compileNode],
  [sh.property, compileProperty],
  [sh.qualifiedValueShape, compileQualifiedShape],
  [sh.languageIn, compileLanguageIn],
  [sh.maxLength, compileMaxLength],
  [sh.minLength, compileMinLength],
  [sh.pattern, compilePattern],
  [sh.uniqueLang, compileUniqueLang],
  [sh.class, compileClass],
  [sh.datatype, compileDatatype],
  [sh.nodeKind, compileNodeKind]
]);
var validations_default = validations;

// ../../node_modules/shacl-engine/Validator.js
var Validator = class {
  constructor(dataset2, { factory: factory3, ...options }) {
    this.factory = factory3;
    this.options = options;
    this.registry = new Registry_default(validations_default);
    this.targetResolverRegistry = new TargetResolverRegistry_default(this.options.targetResolvers || []);
    this.shapesPtr = new PathList_default({ dataset: dataset2, factory: factory3 });
    this.shapes = new TermMap_default();
    if (this.options.coverage) {
      this.options.debug = true;
      this.options.details = true;
      this.options.trace = true;
    }
    if (this.options.validations) {
      for (const [key, value] of this.options.validations) {
        this.registry.validations.set(key, value);
      }
    }
    const shapePtrs = [
      ...this.shapesPtr.hasOut([sh.targetClass]),
      ...this.shapesPtr.hasOut([sh.targetNode]),
      ...this.shapesPtr.hasOut([sh.targetObjectsOf]),
      ...this.shapesPtr.hasOut([sh.targetSubjectsOf]),
      ...this.shapesPtr.hasOut([sh.target]),
      ...this.shapesPtr.hasOut([rdf.type], [sh.NodeShape]),
      ...this.shapesPtr.hasOut([rdf.type], [sh.PropertyShape])
    ];
    for (const shapePtr of shapePtrs) {
      this.shape(shapePtr);
    }
  }
  shape(ptr) {
    if (!ptr.term) {
      return null;
    }
    let shape = this.shapes.get(ptr.term);
    if (!shape) {
      shape = new Shape_default(ptr, { validator: this });
      this.shapes.set(ptr.term, shape);
    }
    return shape;
  }
  async validate(data, shapes) {
    const focusNode = new PathList_default({ ...data, factory: this.factory });
    const context = new Context_default({ factory: this.factory, focusNode, options: this.options, validator: this });
    if (shapes) {
      shapes = shapes.map((shape) => this.shape(this.shapesPtr.node(shape.terms)));
    } else {
      shapes = this.shapes.values();
    }
    for (const shape of shapes) {
      const shapeContext = context.create({ shape });
      let targets;
      if (!focusNode.isAny()) {
        targets = focusNode;
      } else {
        targets = await shape.resolveTargets(shapeContext);
      }
      for (const focusNode2 of targets) {
        await shape.validate(shapeContext.create({ focusNode: focusNode2 }));
      }
    }
    return context.report;
  }
};
var Validator_default = Validator;

// src/shacl-validation.ts
var SH_MIN_COUNT_CONSTRAINT_COMPONENT = "http://www.w3.org/ns/shacl#MinCountConstraintComponent";
function flattenResults(results) {
  return results.flatMap((result) => [result, ...flattenResults(result.results ?? [])]);
}
function resultMessages(results) {
  return Array.from(new Set(
    flattenResults(results).flatMap((result) => {
      const messages = (result.message ?? []).map(({ value }) => value.trim()).filter(Boolean);
      const isDefaultRequiredMessage = result.constraintComponent?.value === SH_MIN_COUNT_CONSTRAINT_COMPONENT && messages.length === 1 && messages[0] === "Less than 1 values";
      return isDefaultRequiredMessage ? ["This value is required."] : messages;
    }).filter(Boolean)
  ));
}
function pointerValue(pointer) {
  return pointer?.term?.value ?? pointer?.terms?.[0]?.value;
}
async function validateShaclAuthoringState(sourceQuads, bindings) {
  const authoredPairs = new Set(bindings.map(({ path, subject }) => `${subject}
${path}`));
  const baseData = sourceQuads.filter(({ predicate, subject }) => !authoredPairs.has(`${subject.value}
${predicate.value}`));
  const data = toRdfJsDataset(
    projectQuadsToDefaultGraph(baseData),
    data_model_default,
    dataset_default
  );
  const shapes = toRdfJsDataset(
    projectQuadsToDefaultGraph(sourceQuads),
    data_model_default,
    dataset_default
  );
  for (const binding of bindings) {
    if (!binding.active || !binding.object || binding.representationError) continue;
    data.add(data_model_default.quad(
      data_model_default.namedNode(binding.subject),
      data_model_default.namedNode(binding.path),
      binding.object.termType === "NamedNode" ? data_model_default.namedNode(binding.object.value) : toRdfJsLiteral(binding.object, data_model_default)
    ));
  }
  const validator = new Validator_default(shapes, {
    details: true,
    factory: data_model_default
  });
  const messages = /* @__PURE__ */ new Map();
  const activeBindings = bindings.filter(({ active }) => active);
  const validBindings = activeBindings.filter(({ representationError }) => !representationError);
  for (const binding of activeBindings) {
    if (binding.representationError) {
      messages.set(binding.key, [binding.representationError]);
    }
  }
  const shapePointers = Array.from(new Set(validBindings.map(({ shape }) => shape))).map((shape) => ({ terms: [data_model_default.namedNode(shape)] }));
  const report2 = shapePointers.length > 0 ? await validator.validate({ dataset: data }, shapePointers) : { conforms: true, results: [] };
  const results = flattenResults(report2.results ?? []);
  for (const binding of validBindings) {
    const bindingResults = results.filter((result) => pointerValue(result.shape?.ptr) === binding.shape && pointerValue(result.focusNode) === binding.subject);
    if (bindingResults.length === 0) continue;
    const bindingMessages = resultMessages(bindingResults);
    messages.set(
      binding.key,
      bindingMessages.length > 0 ? bindingMessages : ["The value does not conform to its SHACL shape."]
    );
  }
  return {
    conforms: messages.size === 0,
    messages,
    resultCount: results.length + activeBindings.filter(({ representationError }) => representationError).length
  };
}

// src/rdf-value-editor.ts
var RDF_TYPE2 = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
var RDF_FIRST = "http://www.w3.org/1999/02/22-rdf-syntax-ns#first";
var RDF_REST = "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest";
var RDF_NIL = "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil";
var RDFS_LABEL = "http://www.w3.org/2000/01/rdf-schema#label";
var SKOS_PREF_LABEL = "http://www.w3.org/2004/02/skos/core#prefLabel";
var SH = "http://www.w3.org/ns/shacl#";
var SCHEMA = "https://schema.org/";
var OA = "http://www.w3.org/ns/oa#";
var AS = "http://www.w3.org/ns/activitystreams#";
var XSD = "http://www.w3.org/2001/XMLSchema#";
function serializeDoctype(doctype) {
  if (!doctype) return "";
  let value = `<!DOCTYPE ${doctype.name}`;
  if (doctype.publicId) value += ` PUBLIC "${doctype.publicId}"`;
  if (doctype.systemId) value += `${doctype.publicId ? "" : " SYSTEM"} "${doctype.systemId}"`;
  return `${value}>
`;
}
function termValue(term) {
  if (!term || term.termType === "Triple") return void 0;
  return term.value;
}
function authorValue(term) {
  return term?.termType === "NamedNode" || term?.termType === "Literal" ? term : void 0;
}
function valueKey(term) {
  return term.termType === "NamedNode" ? term.value : `literal:${term.datatype.value}:${term.language}:${term.direction ?? ""}:${term.value}`;
}
function completionValueKey(object) {
  return object.termType === "NamedNode" ? valueKey({ termType: "NamedNode", value: object.value }) : valueKey({
    termType: "Literal",
    value: object.value,
    datatype: { termType: "NamedNode", value: object.datatype ?? `${XSD}string` },
    language: ""
  });
}
function values(quads, subject, predicate) {
  return quads.flatMap((quad2) => quad2.subject.value === subject && quad2.predicate.value === predicate ? [quad2.object] : []);
}
function firstValue(quads, subject, predicate) {
  return termValue(values(quads, subject, predicate)[0]);
}
function namedValues(quads, subject, predicate) {
  return values(quads, subject, predicate).flatMap((term) => term.termType === "NamedNode" ? [term.value] : []);
}
function numberValue(quads, subject, predicate) {
  const value = firstValue(quads, subject, predicate);
  if (value === void 0) return void 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function localName(iri2) {
  const name = iri2.match(/[/#]([^/#]+)$/)?.[1] ?? iri2;
  return decodeURIComponent(name).replace(/[-_]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (character) => character.toUpperCase());
}
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function isDocumentRoot(root) {
  return root.nodeType === 9;
}
function documentForRoot(root) {
  return isDocumentRoot(root) ? root : root.ownerDocument;
}
function isHtmlElementNode(node) {
  return node?.nodeType === 1;
}
function elementForIri(root, iri2, sourceDocumentIri) {
  const url = new URL(iri2);
  if (!url.hash || url.href.slice(0, -url.hash.length) !== sourceDocumentIri) return void 0;
  const id = decodeURIComponent(url.hash.slice(1));
  if (isDocumentRoot(root)) return root.getElementById(id) ?? void 0;
  return Array.from(root.querySelectorAll("[id]")).find((element) => element.id === id);
}
function replacementNodes(source) {
  return Array.from(source.content.childNodes, (node) => node.cloneNode(true));
}
function groupInfo(quads, shape) {
  const group = firstValue(quads, shape, `${SH}group`);
  if (!group) {
    return {
      key: "",
      label: "Values",
      order: Number.MAX_SAFE_INTEGER
    };
  }
  return {
    key: group,
    label: firstValue(quads, group, `${SH}name`) ?? firstValue(quads, group, RDFS_LABEL) ?? localName(group),
    order: numberValue(quads, group, `${SH}order`) ?? Number.MAX_SAFE_INTEGER
  };
}
function listValues(quads, head) {
  if (!head || head.termType === "Triple") return [];
  const result = [];
  const visited = /* @__PURE__ */ new Set();
  let node = head;
  while (node && node.termType !== "Triple" && node.value !== RDF_NIL && !visited.has(node.value)) {
    visited.add(node.value);
    const first = values(quads, node.value, RDF_FIRST)[0];
    if (!first) break;
    result.push(first);
    node = values(quads, node.value, RDF_REST)[0];
  }
  return result;
}
function isSafeReplacementTemplate(template) {
  const forbidden = [
    "script",
    "style",
    "iframe",
    "frame",
    "object",
    "embed",
    "applet",
    "base",
    "meta",
    "link",
    "img",
    "picture",
    "audio",
    "video",
    "source",
    "track",
    "form",
    "button",
    "input",
    "select",
    "textarea"
  ].join(", ");
  if (template.content.querySelector(forbidden)) return false;
  for (const element of template.content.querySelectorAll("*")) {
    if (element.localName.includes("-")) return false;
    for (const attribute of Array.from(element.attributes)) {
      if (/^on/i.test(attribute.name) || attribute.name === "srcdoc" || attribute.name === "style") {
        return false;
      }
      if (["src", "srcset", "poster", "data", "xlink:href"].includes(attribute.name)) return false;
      if (["href", "cite"].includes(attribute.name) && /^\s*(?:javascript|data):/i.test(attribute.value)) return false;
    }
  }
  return true;
}
function compareByDocumentPosition(left, right) {
  if (left.groupKey !== right.groupKey) {
    if (left.groupOrder !== right.groupOrder) return left.groupOrder - right.groupOrder;
    const labelOrder = left.groupLabel.localeCompare(right.groupLabel);
    if (labelOrder !== 0) return labelOrder;
    return left.groupKey.localeCompare(right.groupKey);
  }
  if (left.order !== right.order) return left.order - right.order;
  const leftElement = left.placeholders[0];
  const rightElement = right.placeholders[0];
  if (!leftElement || !rightElement || leftElement === rightElement) return 0;
  const position = leftElement.compareDocumentPosition(rightElement);
  return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
function inputType(binding) {
  if (binding.valueKind === "NamedNode") return "url";
  if (binding.datatype === `${XSD}date`) return "date";
  if (binding.datatype === `${XSD}integer`) return "number";
  if (binding.datatype === `${XSD}anyURI`) return "url";
  return "text";
}
function constraintSummary(binding) {
  const parts = [];
  if (binding.required) parts.push("Required");
  if (binding.valueKind === "NamedNode") parts.push("IRI");
  if (binding.datatype === `${XSD}date`) parts.push("Date");
  if (binding.datatype === `${XSD}integer`) parts.push("Whole number");
  if (binding.pattern) parts.push(`Pattern: ${binding.pattern}`);
  if (binding.minLength !== void 0) parts.push(`At least ${binding.minLength} characters`);
  if (binding.maxLength !== void 0) parts.push(`At most ${binding.maxLength} characters`);
  if (binding.defaultValue !== void 0) parts.push(`Suggested: ${binding.defaultValue}`);
  return parts.join(" \xB7 ");
}
var Ia2RdfValueEditor = class extends HTMLElement {
  #bindings = [];
  #bindingControls = /* @__PURE__ */ new Map();
  #bindingRows = /* @__PURE__ */ new Map();
  #backlinkStates = [];
  #backlinkStyles = null;
  #renderingTargetStates = /* @__PURE__ */ new Map();
  #originalText = /* @__PURE__ */ new WeakMap();
  #runtimeData = null;
  #launcher = null;
  #drawer = null;
  #quickEditor = null;
  #quickBody = null;
  #quickBinding = null;
  #quickPlaceholder = null;
  #quickRowParent = null;
  #quickRowNextSibling = null;
  #quickPositionCleanup = null;
  #progress = null;
  #controls = null;
  #helpTrigger = null;
  #helpWindow = null;
  #dataStatus = null;
  #loadInput = null;
  #sourceRoot = null;
  #resolvedSourceRoot = null;
  #sourceQuads = [];
  #sourceDocumentIri = "";
  #labelPredicates = [RDFS_LABEL, SKOS_PREF_LABEL, `${SCHEMA}name`];
  #position = "right";
  #allowedPositions = WINDOW_POSITIONS.map(({ position }) => position);
  #returnFocus = null;
  #syncCleanup = null;
  #syncControlCleanup = null;
  #syncMode = "off";
  #directNavigationVersion = 0;
  #initialized = false;
  #modelIssues = [];
  #validationVersion = 0;
  #validatedVersion = 0;
  #validationPromise = Promise.resolve({
    conforms: true,
    issues: [],
    resultCount: 0
  });
  get sourceRoot() {
    return this.#sourceRoot;
  }
  set sourceRoot(root) {
    this.#sourceRoot = root;
    if (this.isConnected) this.refresh();
  }
  get modelIssues() {
    return [...this.#modelIssues];
  }
  connectedCallback() {
    if (this.#initialized) return;
    this.#initialized = true;
    this.ownerDocument.addEventListener(IA2_WINDOW_ACTIVATE_EVENT, this.#onWindowActivate);
    queueMicrotask(() => this.#initialize());
  }
  disconnectedCallback() {
    this.ownerDocument.removeEventListener(IA2_WINDOW_ACTIVATE_EVENT, this.#onWindowActivate);
    this.#teardown();
    this.#initialized = false;
  }
  refresh() {
    if (!this.isConnected) return;
    this.#teardown();
    this.#initialize();
  }
  #panelLabel() {
    return this.getAttribute("label")?.trim() || "Complete document";
  }
  #teardown() {
    this.#directNavigationVersion += 1;
    this.#validationVersion += 1;
    this.#hideQuickEditor(false);
    this.#runtimeData?.remove();
    this.#runtimeData = null;
    this.#syncCleanup?.();
    this.#syncCleanup = null;
    this.#syncControlCleanup?.();
    this.#syncControlCleanup = null;
    this.#teardownBacklinks();
    for (const [target, state] of this.#renderingTargetStates) {
      target.hidden = state.hidden;
      target.replaceChildren(...state.childNodes);
      delete target.dataset.valueAlternative;
    }
    this.#renderingTargetStates.clear();
    for (const binding of this.#bindings) {
      for (const placeholder of binding.placeholders) {
        placeholder.textContent = this.#originalText.get(placeholder) ?? placeholder.textContent;
        delete placeholder.dataset.valuePlaceholder;
        delete placeholder.dataset.valueState;
      }
    }
    this.#bindings = [];
    this.#bindingControls.clear();
    this.#bindingRows.clear();
    this.#modelIssues = [];
    this.#sourceQuads = [];
    this.shadowRoot?.replaceChildren();
  }
  open() {
    this.#hideQuickEditor(false);
    this.#returnFocus = this.#launcher;
    this.#show();
    this.#drawer?.querySelector("input, select, button")?.focus();
  }
  #show(configureSync = true) {
    if (this.#drawer) activateWindow(this.#coordinatedWindow(this.#drawer));
    this.#drawer?.setAttribute("data-open", "");
    this.#drawer?.removeAttribute("inert");
    this.#launcher?.setAttribute("aria-expanded", "true");
    if (configureSync) this.#configureSync();
  }
  close() {
    if (this.#quickEditor?.hasAttribute("data-open")) this.#hideQuickEditor(true);
    else this.#hide(true);
  }
  #hide(restoreFocus) {
    this.#drawer?.removeAttribute("data-open");
    this.#drawer?.setAttribute("inert", "");
    this.#launcher?.setAttribute("aria-expanded", "false");
    this.#syncCleanup?.();
    this.#syncCleanup = null;
    if (restoreFocus) (this.#returnFocus ?? this.#launcher)?.focus();
    this.#returnFocus = null;
  }
  #onWindowActivate = (event) => {
    const detail = event.detail;
    if (detail?.source === this || !this.#drawer?.hasAttribute("data-open")) return;
    detail.windows.push(this.#coordinatedWindow(this.#drawer));
  };
  #coordinatedWindow(drawer) {
    return {
      allowedPositions: this.#allowedPositions,
      close: () => this.#hide(false),
      position: this.#position,
      preferredPositions: ["right", "floating", "right-bottom", "right-top"],
      preferredWidth: 416,
      priority: 20,
      setPosition: (position) => {
        this.setPosition(position);
      },
      source: this,
      surface: drawer
    };
  }
  setPosition(position) {
    if (!this.#allowedPositions.includes(position)) return false;
    this.#position = position;
    this.setAttribute("position", position);
    if (this.#drawer) {
      this.#drawer.style.removeProperty("height");
      this.#drawer.style.removeProperty("left");
      this.#drawer.style.removeProperty("top");
      this.#drawer.style.removeProperty("width");
      delete this.#drawer.dataset.dragged;
      this.#drawer.dataset.position = position;
    }
    if (this.#launcher) this.#launcher.dataset.position = position;
    if (this.#drawer) updateWindowPositionControls(this.#drawer, position);
    return true;
  }
  setSyncMode(mode) {
    if (!isScrollSyncMode(mode)) return false;
    this.#directNavigationVersion += 1;
    this.#syncMode = mode;
    this.setAttribute("sync", mode);
    if (this.shadowRoot) updateScrollSyncControls(this.shadowRoot, mode);
    this.#configureSync();
    return true;
  }
  validate() {
    this.#validationPromise = this.#validateAndProject();
    return this.#validationPromise;
  }
  exportCompletion(format) {
    if (this.#validatedVersion !== this.#validationVersion) {
      throw new Error("SHACL validation is still running. Await validate() before exporting.");
    }
    return serializeCompletionDocument(this.#completionDocument(), format);
  }
  exportCompletedDocument() {
    if (this.#validatedVersion !== this.#validationVersion) {
      throw new Error("SHACL validation is still running. Await validate() before exporting.");
    }
    const completed = this.#cloneSourceDocument();
    completed.querySelectorAll("ia2-rdf-value-editor").forEach((editor) => editor.remove());
    completed.querySelectorAll("[data-ia2-rdf-value-editor-backlinks]").forEach((style) => style.remove());
    for (const binding of this.#bindings) {
      for (const placeholder of binding.placeholders) {
        if (!placeholder.id) continue;
        const completedPlaceholder = completed.getElementById(placeholder.id);
        if (!isHtmlElementNode(completedPlaceholder)) continue;
        delete completedPlaceholder.dataset.valuePlaceholder;
        delete completedPlaceholder.dataset.valueState;
        completedPlaceholder.dataset.ia2CompletedValue = "";
      }
    }
    for (const target of this.#renderingTargetStates.keys()) {
      if (!target.id) continue;
      const completedTarget = completed.getElementById(target.id);
      if (isHtmlElementNode(completedTarget)) {
        delete completedTarget.dataset.valueAlternative;
      }
    }
    for (const state of this.#backlinkStates) {
      if (!state.placeholder.id) continue;
      const placeholder = completed.getElementById(state.placeholder.id);
      if (!isHtmlElementNode(placeholder)) continue;
      delete placeholder.dataset.rdfValueEditorBacklink;
      delete placeholder.dataset.rdfValueEditorActiveBacklink;
      this.#restoreAttribute(placeholder, "role", state.role);
      this.#restoreAttribute(placeholder, "tabindex", state.tabIndex);
      this.#restoreAttribute(placeholder, "aria-label", state.ariaLabel);
      this.#restoreAttribute(placeholder, "title", state.title);
    }
    const presentation = completed.createElement("style");
    presentation.dataset.ia2CompletedValuePresentation = "";
    presentation.textContent = `
      [data-ia2-completed-value] {
        background: transparent !important;
        border-bottom-color: transparent !important;
        box-shadow: none !important;
        color: inherit !important;
        cursor: inherit !important;
        text-decoration: none !important;
      }
    `;
    completed.head.append(presentation);
    return `${serializeDoctype(completed.doctype)}${completed.documentElement.outerHTML}
`;
  }
  #sourceDocument() {
    return this.#resolvedSourceRoot ? documentForRoot(this.#resolvedSourceRoot) : this.ownerDocument;
  }
  #cloneSourceDocument() {
    const root = this.#resolvedSourceRoot ?? this.ownerDocument;
    const sourceDocument = documentForRoot(root);
    if (isDocumentRoot(root) || root.nodeType === 1) {
      return sourceDocument.cloneNode(true);
    }
    const completed = sourceDocument.implementation.createHTMLDocument(sourceDocument.title);
    const rdfVersion = sourceDocument.documentElement.getAttribute("rdf-version");
    if (rdfVersion) completed.documentElement.setAttribute("rdf-version", rdfVersion);
    for (const node of sourceDocument.head.querySelectorAll('style, link[rel~="stylesheet"]')) {
      completed.head.append(node.cloneNode(true));
    }
    const canonical = completed.createElement("link");
    canonical.rel = "canonical";
    canonical.href = this.#sourceDocumentIri;
    completed.head.append(canonical);
    for (const child of Array.from(root.childNodes)) {
      completed.body.append(completed.importNode(child, true));
    }
    return completed;
  }
  saveArtifact(artifact, format = "html") {
    const source = artifact === "completed" ? this.exportCompletedDocument() : this.exportCompletion(format);
    const view = this.ownerDocument.defaultView;
    if (!view?.URL.createObjectURL) {
      throw new Error("This browser cannot create downloadable files.");
    }
    const stem = (() => {
      try {
        const pathname = new URL(this.#sourceDocumentIri).pathname;
        const filename2 = pathname.split("/").filter(Boolean).at(-1)?.replace(/\.[^.]+$/, "");
        if (filename2) return filename2;
      } catch {
      }
      return (this.#sourceDocument().title || "document").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "document";
    })();
    const extension = format === "html" ? "html" : "ttl";
    const filename = artifact === "completed" ? `${stem}.completed.html` : `${stem}.values.${extension}`;
    const contentType = artifact === "completed" || format === "html" ? "text/html" : "text/turtle";
    const blob = new view.Blob([source], { type: `${contentType};charset=utf-8` });
    const url = view.URL.createObjectURL(blob);
    const anchor = this.ownerDocument.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.hidden = true;
    this.ownerDocument.body.append(anchor);
    anchor.click();
    anchor.remove();
    view.setTimeout(() => view.URL.revokeObjectURL(url), 0);
    this.#setDataStatus(
      artifact === "completed" ? "Saved completed HTML/RDF document." : `Saved ${format === "html" ? "HTML/RDF" : "Turtle"} values document.`,
      "success"
    );
    return source;
  }
  async loadCompletionFile(file) {
    const source = await file.text();
    return this.loadCompletion(source, {
      baseIri: new URL(file.name, this.#sourceDocumentIri).href,
      ...file.type ? { contentType: file.type } : {},
      filename: file.name
    });
  }
  loadCompletion(source, options = {}) {
    return this.#loadCompletion(source, options);
  }
  async #loadCompletion(source, options) {
    const contentType = options.contentType || this.#contentTypeForFilename(options.filename);
    let parsed;
    try {
      parsed = await parseCompletionDocument(source, {
        baseIri: options.baseIri ?? this.#sourceDocumentIri,
        document: this.#sourceDocument(),
        ...contentType ? { contentType } : {}
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const result = { applied: 0, issues: [message], sourceDocumentIris: [] };
      this.#setDataStatus(`Could not load values: ${message}`, "error");
      return result;
    }
    const identityIssues = [...parsed.issues];
    if (parsed.sourceDocumentIris.length !== 1) {
      identityIssues.push("A completion document must identify exactly one source with prov:wasDerivedFrom.");
    } else if (parsed.sourceDocumentIris[0] !== this.#sourceDocumentIri) {
      identityIssues.push("These values were saved for a different source document.");
    }
    if (identityIssues.length > 0) {
      this.#setDataStatus(
        `Could not load values: ${identityIssues[0]}`,
        "error"
      );
      return {
        applied: 0,
        issues: identityIssues,
        sourceDocumentIris: parsed.sourceDocumentIris
      };
    }
    const duplicateIssues = this.#bindings.flatMap((binding) => {
      const count = parsed.statements.filter(({ subject, predicate }) => subject === binding.subject && predicate === binding.path).length;
      return count > 1 ? [`${binding.label} has ${count} values; this control requires at most one.`] : [];
    });
    if (duplicateIssues.length > 0) {
      this.#setDataStatus(`Could not load values: ${duplicateIssues[0]}`, "error");
      return {
        applied: 0,
        issues: duplicateIssues,
        sourceDocumentIris: parsed.sourceDocumentIris
      };
    }
    this.#resetCompletion();
    const issues = [];
    const loaded = /* @__PURE__ */ new Set();
    const assigned = /* @__PURE__ */ new Set();
    const applyBinding = (binding) => {
      if (loaded.has(binding.key) || !this.#isBindingActive(binding)) return false;
      const matches = parsed.statements.filter(({ subject, predicate }) => subject === binding.subject && predicate === binding.path);
      if (matches.length === 0) return false;
      const statement = matches[0];
      const control = this.#bindingControls.get(binding.key);
      if (!control) return false;
      if (binding.options.length > 0) {
        if (!(control instanceof HTMLSelectElement)) return false;
        const key = completionValueKey(statement.object);
        if (!binding.options.some((option) => option.key === key)) {
          issues.push(`${binding.label} has a value outside its sh:in list.`);
          loaded.add(binding.key);
          return false;
        }
        control.value = key;
      } else {
        if (!(control instanceof HTMLInputElement)) return false;
        if (statement.object.termType !== binding.valueKind) {
          issues.push(`${binding.label} requires an RDF ${binding.valueKind === "NamedNode" ? "IRI" : "literal"}.`);
          loaded.add(binding.key);
          return false;
        }
        if (statement.object.termType === "Literal" && binding.datatype && statement.object.datatype && statement.object.datatype !== binding.datatype) {
          issues.push(`${binding.label} has datatype ${statement.object.datatype}; expected ${binding.datatype}.`);
          loaded.add(binding.key);
          return false;
        }
        control.value = statement.object.value;
      }
      binding.touched = true;
      binding.value = control.value;
      loaded.add(binding.key);
      assigned.add(binding.key);
      return true;
    };
    let changed = true;
    while (changed) {
      changed = false;
      for (const binding of this.#bindings) {
        if (binding.options.length > 0 && applyBinding(binding)) changed = true;
      }
    }
    for (const binding of this.#bindings) {
      if (binding.options.length === 0) applyBinding(binding);
    }
    await this.validate();
    for (const binding of this.#bindings) {
      if (assigned.has(binding.key) && binding.error) {
        issues.push(`${binding.label}: ${binding.error}`);
      }
    }
    const applied = this.#bindings.filter((binding) => assigned.has(binding.key) && !binding.error).length;
    this.#setDataStatus(
      issues.length > 0 ? `Loaded ${applied} values with ${issues.length} ${issues.length === 1 ? "issue" : "issues"}.` : `Loaded ${applied} values.`,
      issues.length > 0 ? "warning" : "success"
    );
    return {
      applied,
      issues,
      sourceDocumentIris: parsed.sourceDocumentIris
    };
  }
  #openHelp() {
    if (!this.#helpWindow) return;
    this.#helpWindow.dataset.open = "true";
    this.#helpWindow.removeAttribute("inert");
    this.#helpTrigger?.setAttribute("aria-expanded", "true");
    this.#helpWindow.querySelector(".help-close")?.focus();
  }
  #closeHelp() {
    if (!this.#helpWindow) return;
    this.#helpWindow.dataset.open = "false";
    this.#helpWindow.setAttribute("inert", "");
    this.#helpTrigger?.setAttribute("aria-expanded", "false");
    this.#helpTrigger?.focus();
  }
  #initialize() {
    this.#allowedPositions = parseWindowPositions(this.getAttribute("allowed-positions"));
    const requestedPosition = this.getAttribute("position");
    this.#position = isWindowPosition(requestedPosition) && this.#allowedPositions.includes(requestedPosition) ? requestedPosition : this.#allowedPositions[0];
    this.setAttribute("position", this.#position);
    const requestedSyncMode = this.getAttribute("sync");
    this.#syncMode = isScrollSyncMode(requestedSyncMode) ? requestedSyncMode : "off";
    this.setAttribute("sync", this.#syncMode);
    const declaredLabelPredicates = this.getAttribute("label-predicates")?.split(/\s+/).filter((value) => {
      try {
        return Boolean(new URL(value));
      } catch {
        return false;
      }
    });
    this.#labelPredicates = declaredLabelPredicates?.length ? Array.from(new Set(declaredLabelPredicates)) : [RDFS_LABEL, SKOS_PREF_LABEL, `${SCHEMA}name`];
    const sourceSelector = this.getAttribute("source-root")?.trim();
    let selectedRoot = null;
    let validSourceSelector = true;
    if (sourceSelector) {
      try {
        selectedRoot = this.ownerDocument.querySelector(sourceSelector);
      } catch {
        validSourceSelector = false;
        this.#modelIssues.push(`The source-root selector \u201C${sourceSelector}\u201D is not valid CSS.`);
      }
    }
    if (sourceSelector && validSourceSelector && !selectedRoot && !this.#sourceRoot) {
      this.#modelIssues.push(`The source-root selector \u201C${sourceSelector}\u201D did not match an element.`);
    }
    this.#resolvedSourceRoot = this.#sourceRoot ?? selectedRoot ?? this.ownerDocument;
    const result = extractDataset(this.#resolvedSourceRoot);
    this.#sourceQuads = [...result.quads];
    this.#sourceDocumentIri = result.sourceDocumentIri;
    const extractionErrors = result.diagnostics.filter(({ severity }) => severity === "error");
    this.#modelIssues.push(...extractionErrors.map(({ message }) => `HTML/RDF extraction error: ${message}`));
    this.#bindings = (extractionErrors.length > 0 ? [] : this.#authorableBindings(result.quads, result.sourceDocumentIri)).sort(compareByDocumentPosition);
    for (const binding of this.#bindings) {
      for (const placeholder of binding.placeholders) {
        this.#originalText.set(placeholder, placeholder.textContent ?? "");
        placeholder.dataset.valuePlaceholder = binding.key;
        placeholder.dataset.valueState = binding.options.length === 0 && binding.defaultValue !== void 0 ? "default" : "empty";
      }
      if (binding.options.length > 0) {
        for (const option of binding.options) {
          for (const alternative of option.alternatives) {
            const existing = this.#renderingTargetStates.get(alternative.target);
            if (!existing) {
              this.#renderingTargetStates.set(alternative.target, {
                childNodes: Array.from(alternative.target.childNodes),
                hidden: alternative.target.hidden
              });
            }
          }
        }
      }
    }
    const sourceDocument = this.#sourceDocument();
    this.#runtimeData = sourceDocument.createElement("div");
    this.#runtimeData.dataset.ia2RdfValueEditorRuntime = "";
    this.#runtimeData.hidden = true;
    this.#runtimeData.setAttribute("aria-hidden", "true");
    if (isDocumentRoot(this.#resolvedSourceRoot)) {
      this.#resolvedSourceRoot.body.append(this.#runtimeData);
    } else {
      this.#resolvedSourceRoot.append(this.#runtimeData);
    }
    this.#render();
    if (this.#modelIssues.length > 0) {
      this.#setDataStatus(
        `${this.#modelIssues.length} authoring model ${this.#modelIssues.length === 1 ? "issue" : "issues"}; unsafe or ambiguous alternatives were ignored.`,
        "warning"
      );
    }
    this.dispatchEvent(new CustomEvent("ia2-rdf-value-editor-model", {
      bubbles: true,
      composed: true,
      detail: {
        bindings: this.#bindings.length,
        issues: [...this.#modelIssues],
        sourceDocumentIri: this.#sourceDocumentIri
      }
    }));
    if (this.hasAttribute("backlinks")) this.#setupBacklinks();
    this.#updateActiveBindings();
    this.#updateProgress();
    this.#validationPromise = this.#validateAndProject();
  }
  #setupBacklinks() {
    const sourceDocument = this.#sourceDocument();
    if (this.getAttribute("backlink-styling") !== "host") {
      this.#backlinkStyles = sourceDocument.createElement("style");
      this.#backlinkStyles.dataset.ia2RdfValueEditorBacklinks = "";
      this.#backlinkStyles.textContent = `
        [data-rdf-value-editor-backlink] {
          border-radius: .15em;
          cursor: pointer;
        }
        [data-rdf-value-editor-backlink]:hover {
          outline: 2px solid var(--ia2-rdf-value-editor-backlink-hover, oklch(55% 0.17 294 / 48%));
          outline-offset: 2px;
        }
        [data-rdf-value-editor-backlink]:focus-visible {
          outline: 3px solid var(--ia2-rdf-value-editor-backlink-focus, oklch(81% 0.15 135));
          outline-offset: 2px;
        }
        [data-rdf-value-editor-active-backlink] {
          background: var(--ia2-rdf-value-editor-backlink-active-background, oklch(90% 0.065 294));
          border-radius: .15em;
          box-decoration-break: clone;
          box-shadow: 0 0 0 2px var(--ia2-rdf-value-editor-backlink-active, oklch(55% 0.17 294));
          -webkit-box-decoration-break: clone;
        }
      `;
      const styleRoot = this.#resolvedSourceRoot?.nodeType === 11 ? this.#resolvedSourceRoot : sourceDocument.head;
      styleRoot.append(this.#backlinkStyles);
    }
    for (const binding of this.#bindings) {
      for (const placeholder of binding.placeholders) {
        const opensFullEditor = () => this.getAttribute("backlink-mode") === "full" || placeholder.ownerDocument !== this.ownerDocument;
        const activate = () => {
          if (opensFullEditor()) {
            this.#revealBinding(binding, placeholder);
          } else {
            this.#showQuickEditor(binding, placeholder);
          }
        };
        const pointerdown = (event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          if (opensFullEditor()) activate();
        };
        const click = (event) => {
          event.preventDefault();
          if (event.detail !== 0 && opensFullEditor()) return;
          activate();
        };
        const keydown = (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          activate();
        };
        this.#backlinkStates.push({
          placeholder,
          binding,
          pointerdown,
          click,
          keydown,
          role: placeholder.getAttribute("role"),
          tabIndex: placeholder.getAttribute("tabindex"),
          ariaLabel: placeholder.getAttribute("aria-label"),
          title: placeholder.getAttribute("title")
        });
        placeholder.dataset.rdfValueEditorBacklink = "";
        placeholder.setAttribute("role", "button");
        placeholder.tabIndex = 0;
        placeholder.setAttribute("aria-label", `Edit ${binding.label}`);
        placeholder.setAttribute("title", `Edit ${binding.label} in ${this.#panelLabel()}`);
        placeholder.addEventListener("pointerdown", pointerdown);
        placeholder.addEventListener("click", click);
        placeholder.addEventListener("keydown", keydown);
      }
    }
  }
  #teardownBacklinks() {
    this.#backlinkStyles?.remove();
    this.#backlinkStyles = null;
    for (const state of this.#backlinkStates) {
      const { placeholder } = state;
      placeholder.removeEventListener("pointerdown", state.pointerdown);
      placeholder.removeEventListener("click", state.click);
      placeholder.removeEventListener("keydown", state.keydown);
      delete placeholder.dataset.rdfValueEditorBacklink;
      delete placeholder.dataset.rdfValueEditorActiveBacklink;
      this.#restoreAttribute(placeholder, "role", state.role);
      this.#restoreAttribute(placeholder, "tabindex", state.tabIndex);
      this.#restoreAttribute(placeholder, "aria-label", state.ariaLabel);
      this.#restoreAttribute(placeholder, "title", state.title);
    }
    this.#backlinkStates = [];
  }
  #restoreAttribute(element, name, value) {
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  }
  #activeBindings() {
    const active = new Set(this.#bindings.filter((binding) => binding.scopes.length === 0));
    let changed = true;
    while (changed) {
      changed = false;
      const selected = new Set(Array.from(active).flatMap((binding) => this.#selectedOption(binding)?.term.termType === "NamedNode" ? [this.#selectedOption(binding).term.value] : []));
      for (const binding of this.#bindings) {
        if (active.has(binding) || !binding.scopes.some((iri2) => selected.has(iri2))) continue;
        active.add(binding);
        changed = true;
      }
    }
    return active;
  }
  #isBindingActive(binding, active = this.#activeBindings()) {
    return active.has(binding);
  }
  #selectedOption(binding) {
    return binding.options.find(({ key }) => key === binding.value);
  }
  #controllingBinding(binding) {
    if (binding.scopes.length === 0) return void 0;
    return this.#bindings.find((candidate) => candidate.options.some(({ term }) => term.termType === "NamedNode" && binding.scopes.includes(term.value)));
  }
  #quickNavigationDestination(offset) {
    const currentBinding = this.#quickBinding;
    const currentPlaceholder = this.#quickPlaceholder;
    if (!currentBinding || !currentPlaceholder) return void 0;
    const active = this.#activeBindings();
    const candidates = this.#bindings.flatMap((binding) => {
      if (binding === currentBinding || !active.has(binding) || !this.#bindingRows.has(binding.key)) return [];
      return binding.placeholders.flatMap((placeholder) => {
        if (!placeholder.isConnected || placeholder.hidden || placeholder.closest("[hidden]")) return [];
        const position = currentPlaceholder.compareDocumentPosition(placeholder);
        const isInDirection = offset === 1 ? Boolean(position & Node.DOCUMENT_POSITION_FOLLOWING) : Boolean(position & Node.DOCUMENT_POSITION_PRECEDING);
        return isInDirection ? [{ binding, placeholder }] : [];
      });
    });
    candidates.sort((left, right) => {
      const position = left.placeholder.compareDocumentPosition(right.placeholder);
      const documentOrder = position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : position & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
      return offset === 1 ? documentOrder : -documentOrder;
    });
    return candidates[0];
  }
  #restoreQuickRow() {
    const binding = this.#quickBinding;
    const parent = this.#quickRowParent;
    if (!binding || !parent) return;
    const row = this.#bindingRows.get(binding.key);
    if (!row) return;
    const next = this.#quickRowNextSibling;
    if (next?.parentNode === parent) parent.insertBefore(row, next);
    else parent.appendChild(row);
    this.#quickRowParent = null;
    this.#quickRowNextSibling = null;
  }
  #hideQuickEditor(restoreFocus) {
    const returnFocus = this.#quickPlaceholder ?? this.#returnFocus;
    if (this.#quickPlaceholder) {
      delete this.#quickPlaceholder.dataset.rdfValueEditorActiveBacklink;
    }
    this.#quickPositionCleanup?.();
    this.#quickPositionCleanup = null;
    this.#restoreQuickRow();
    this.#quickEditor?.removeAttribute("data-open");
    this.#quickEditor?.setAttribute("inert", "");
    this.#quickEditor?.removeAttribute("aria-label");
    this.#launcher?.setAttribute("aria-expanded", "false");
    this.#quickBinding = null;
    this.#quickPlaceholder = null;
    if (restoreFocus) returnFocus?.focus();
    this.#returnFocus = null;
  }
  #positionQuickEditor() {
    const panel = this.#quickEditor;
    const placeholder = this.#quickPlaceholder;
    const view = this.ownerDocument.defaultView;
    if (!panel || !placeholder || !view || !panel.hasAttribute("data-open")) return;
    const anchor = placeholder.getBoundingClientRect();
    const fragments = Array.from(placeholder.getClientRects()).filter(
      (rect) => rect.width > 0 && rect.height > 0
    );
    const anchorTop = fragments.length > 0 ? Math.min(...fragments.map((rect) => rect.top)) : anchor.top;
    const anchorBottom = fragments.length > 0 ? Math.max(...fragments.map((rect) => rect.bottom)) : anchor.bottom;
    let readingRect = anchor;
    for (let ancestor = placeholder.parentElement; ancestor; ancestor = ancestor.parentElement) {
      const display = view.getComputedStyle(ancestor).display;
      const candidate = ancestor.getBoundingClientRect();
      if (display !== "contents" && !display.startsWith("inline") && candidate.width > 0) {
        readingRect = candidate;
        break;
      }
    }
    const panelRect = panel.getBoundingClientRect();
    const gap = 8;
    const inset = 12;
    const width = panelRect.width || Math.min(340, view.innerWidth - inset * 2);
    const height = panelRect.height || 190;
    const left = Math.min(
      Math.max(readingRect.left + (readingRect.width - width) / 2, inset),
      Math.max(inset, view.innerWidth - width - inset)
    );
    const below = anchorBottom + gap;
    const top = below + height <= view.innerHeight - inset ? below : Math.max(inset, anchorTop - height - gap);
    panel.style.left = `${Math.round(left)}px`;
    panel.style.top = `${Math.round(top)}px`;
  }
  #updateQuickNavigation() {
    const panel = this.#quickEditor;
    const binding = this.#quickBinding;
    if (!panel || !binding) return;
    const previous = this.#quickNavigationDestination(-1);
    const next = this.#quickNavigationDestination(1);
    const previousButton = panel.querySelector(".quick-prev");
    const nextButton = panel.querySelector(".quick-next");
    if (previousButton) {
      previousButton.disabled = !previous;
      previousButton.title = previous ? `Previous: ${previous.binding.label}` : "No previous field";
      previousButton.setAttribute(
        "aria-label",
        previous ? `Previous field: ${previous.binding.label}` : "No previous field"
      );
    }
    if (nextButton) {
      nextButton.disabled = !next;
      nextButton.title = next ? `Next: ${next.binding.label}` : "No next field";
      nextButton.setAttribute(
        "aria-label",
        next ? `Next field: ${next.binding.label}` : "No next field"
      );
    }
  }
  #showQuickEditor(binding, returnFocus) {
    const revealedBinding = this.#isBindingActive(binding) ? binding : this.#controllingBinding(binding) ?? binding;
    const row = this.#bindingRows.get(revealedBinding.key);
    const control = this.#bindingControls.get(revealedBinding.key);
    const panel = this.#quickEditor;
    const body = this.#quickBody;
    if (!row || !control || !panel || !body) return;
    if (this.#drawer?.hasAttribute("data-open")) this.#hide(false);
    this.#quickPositionCleanup?.();
    this.#quickPositionCleanup = null;
    this.#restoreQuickRow();
    if (this.#quickPlaceholder) {
      delete this.#quickPlaceholder.dataset.rdfValueEditorActiveBacklink;
    }
    this.#returnFocus = returnFocus;
    this.#quickBinding = revealedBinding;
    this.#quickPlaceholder = returnFocus;
    returnFocus.dataset.rdfValueEditorActiveBacklink = "";
    this.#quickRowParent = row.parentNode;
    this.#quickRowNextSibling = row.nextSibling;
    const group = revealedBinding.groupKey ? this.ownerDocument.createElement("p") : void 0;
    if (group) {
      group.className = "quick-group";
      group.textContent = revealedBinding.groupLabel;
      body.replaceChildren(group, row);
    } else {
      body.replaceChildren(row);
    }
    panel.setAttribute(
      "aria-label",
      revealedBinding.groupKey ? `Edit ${revealedBinding.label} in ${revealedBinding.groupLabel}` : `Edit ${revealedBinding.label}`
    );
    panel.setAttribute("data-open", "");
    panel.removeAttribute("inert");
    this.#launcher?.setAttribute("aria-expanded", "true");
    this.#updateQuickNavigation();
    control.focus({ preventScroll: true });
    const view = this.ownerDocument.defaultView;
    if (view) {
      let frame = 0;
      const position = () => {
        if (view.requestAnimationFrame) {
          view.cancelAnimationFrame(frame);
          frame = view.requestAnimationFrame(() => this.#positionQuickEditor());
        } else {
          this.#positionQuickEditor();
        }
      };
      view.addEventListener("resize", position, { passive: true });
      view.addEventListener("scroll", position, { capture: true, passive: true });
      this.#quickPositionCleanup = () => {
        view.cancelAnimationFrame?.(frame);
        view.removeEventListener("resize", position);
        view.removeEventListener("scroll", position, true);
      };
      position();
    } else {
      this.#positionQuickEditor();
    }
  }
  #navigateQuickEditor(offset) {
    const destination = this.#quickNavigationDestination(offset);
    if (!destination) return;
    const { binding, placeholder } = destination;
    const view = this.ownerDocument.defaultView;
    placeholder.scrollIntoView?.({
      behavior: view?.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center"
    });
    this.#showQuickEditor(binding, placeholder);
  }
  async #finishQuickEditor() {
    const binding = this.#quickBinding;
    const control = binding ? this.#bindingControls.get(binding.key) : void 0;
    if (!binding || !control) return;
    this.#acceptValue(binding, control);
    await this.#validationPromise;
    if (binding.error) {
      control.focus({ preventScroll: true });
      return;
    }
    this.#hideQuickEditor(true);
  }
  #expandQuickEditor() {
    const binding = this.#quickBinding;
    const placeholder = this.#quickPlaceholder;
    if (!binding || !placeholder) return;
    this.#hideQuickEditor(false);
    this.#revealBinding(binding, placeholder);
  }
  #revealBinding(binding, returnFocus) {
    this.#hideQuickEditor(false);
    const revealedBinding = this.#isBindingActive(binding) ? binding : this.#controllingBinding(binding) ?? binding;
    const control = this.#bindingControls.get(revealedBinding.key);
    if (!control) return;
    this.#returnFocus = returnFocus;
    const wasOpen = this.#drawer?.hasAttribute("data-open") ?? false;
    const navigationVersion = ++this.#directNavigationVersion;
    this.#syncCleanup?.();
    this.#syncCleanup = null;
    this.#show(false);
    const focusControl = () => {
      if (!this.isConnected || !control.isConnected) return;
      this.#scrollControlIntoEditor(control, "auto");
      control.focus({ preventScroll: true });
      const view = this.ownerDocument.defaultView;
      const resumeSync = () => {
        if (navigationVersion !== this.#directNavigationVersion || !this.isConnected || !this.#drawer?.hasAttribute("data-open")) return;
        this.#configureSync(false);
      };
      if (view?.requestAnimationFrame) {
        view.requestAnimationFrame(() => view.requestAnimationFrame(resumeSync));
      } else {
        view?.setTimeout(resumeSync, 0);
      }
    };
    if (this.ownerDocument.defaultView?.requestAnimationFrame) {
      this.ownerDocument.defaultView.requestAnimationFrame(focusControl);
    } else {
      setTimeout(focusControl, 0);
    }
    if (!wasOpen && this.#drawer) {
      const drawer = this.#drawer;
      let settled = false;
      const focusAfterOpen = () => {
        if (settled) return;
        settled = true;
        drawer.removeEventListener("transitionend", focusAfterOpen);
        if (this.isConnected && control.isConnected && drawer.hasAttribute("data-open")) {
          control.focus({ preventScroll: true });
        }
      };
      drawer.addEventListener("transitionend", focusAfterOpen, { once: true });
      this.ownerDocument.defaultView?.setTimeout(focusAfterOpen, 240);
    }
  }
  #renderingAlternatives(quads, sourceDocumentIri) {
    const alternatives = /* @__PURE__ */ new Map();
    if (!this.#resolvedSourceRoot) return alternatives;
    const annotations = new Set(quads.flatMap((quad2) => quad2.predicate.value === RDF_TYPE2 && quad2.object.termType === "NamedNode" && quad2.object.value === `${OA}Annotation` ? [quad2.subject.value] : []));
    for (const annotation of annotations) {
      const bodies = values(quads, annotation, `${OA}hasBody`).filter((term) => term.termType !== "Triple");
      if (bodies.length !== 1 || !namedValues(quads, bodies[0].value, RDF_TYPE2).includes(`${OA}Choice`)) {
        continue;
      }
      const targetTerms = values(quads, annotation, `${OA}hasTarget`);
      const targetIris = targetTerms.flatMap((term) => term.termType === "NamedNode" ? [term.value] : []);
      const target = targetIris.length === 1 ? elementForIri(this.#resolvedSourceRoot, targetIris[0], sourceDocumentIri) : void 0;
      const itemHeads = values(quads, bodies[0].value, `${AS}items`);
      if (targetTerms.length !== 1 || !target || itemHeads.length !== 1) {
        this.#modelIssues.push(`${localName(annotation)} is not one unambiguous rendering annotation.`);
        continue;
      }
      for (const item of listValues(quads, itemHeads[0])) {
        if (item.termType === "Triple") {
          this.#modelIssues.push(`${localName(annotation)} contains an unsupported triple-term choice item.`);
          continue;
        }
        const types = namedValues(quads, item.value, RDF_TYPE2);
        const sources = namedValues(quads, item.value, `${OA}hasSource`);
        const scopes = namedValues(quads, item.value, `${OA}hasScope`);
        const source = sources.length === 1 ? elementForIri(this.#resolvedSourceRoot, sources[0], sourceDocumentIri) : void 0;
        if (!types.includes(`${OA}SpecificResource`) || sources.length !== 1 || scopes.length !== 1 || source?.localName !== "template" || !isSafeReplacementTemplate(source)) {
          this.#modelIssues.push(`${localName(item.value)} is not one safe, scoped template alternative.`);
          continue;
        }
        const alternative = {
          resource: item.value,
          target,
          template: source
        };
        const optionAlternatives = alternatives.get(scopes[0]) ?? [];
        optionAlternatives.push(alternative);
        alternatives.set(scopes[0], optionAlternatives);
      }
    }
    return alternatives;
  }
  #authorableBindings(quads, sourceDocumentIri) {
    if (!this.#resolvedSourceRoot) return [];
    const propertyShapes = new Set(quads.flatMap((quad2) => quad2.predicate.value === RDF_TYPE2 && quad2.object.termType === "NamedNode" && quad2.object.value === `${SH}PropertyShape` ? [quad2.subject.value] : []));
    const annotations = new Set(quads.flatMap((quad2) => quad2.predicate.value === RDF_TYPE2 && quad2.object.termType === "NamedNode" && quad2.object.value === `${OA}Annotation` ? [quad2.subject.value] : []));
    const alternatives = this.#renderingAlternatives(quads, sourceDocumentIri);
    const bindings = /* @__PURE__ */ new Map();
    for (const annotation of annotations) {
      const bodyTerms = values(quads, annotation, `${OA}hasBody`).filter((term) => term.termType !== "Triple");
      if (bodyTerms.length !== 1) continue;
      const body = bodyTerms[0];
      const bodyTypes = namedValues(quads, body.value, RDF_TYPE2);
      if (bodyTypes.includes(`${OA}Choice`)) continue;
      let shape = body.value;
      let scopes = [];
      if (bodyTypes.includes(`${OA}SpecificResource`)) {
        const sources = values(quads, body.value, `${OA}hasSource`).filter((term) => term.termType !== "Triple");
        scopes = namedValues(quads, body.value, `${OA}hasScope`);
        if (sources.length !== 1 || scopes.length === 0) {
          this.#modelIssues.push(`${localName(annotation)} has an ambiguous contextual body.`);
          continue;
        }
        shape = sources[0].value;
      }
      if (!propertyShapes.has(shape)) continue;
      const targetNodes = namedValues(quads, shape, `${SH}targetNode`);
      const paths = namedValues(quads, shape, `${SH}path`);
      if (paths.length !== 1) {
        this.#modelIssues.push(`${localName(shape)} must declare one simple IRI sh:path.`);
        continue;
      }
      const maxCount = numberValue(quads, shape, `${SH}maxCount`);
      if (maxCount !== void 0 && maxCount !== 1) {
        this.#modelIssues.push(`${localName(shape)} must have sh:maxCount 1 when rendered as one control.`);
        continue;
      }
      const optionHeads = values(quads, shape, `${SH}in`);
      if (optionHeads.length > 1) {
        this.#modelIssues.push(`${localName(shape)} has more than one sh:in list.`);
        continue;
      }
      const optionTerms = optionHeads.length === 1 ? listValues(quads, optionHeads[0]) : [];
      const options = optionTerms.flatMap((term) => {
        const value = authorValue(term);
        if (!value) {
          this.#modelIssues.push(`${localName(shape)} contains an unsupported blank-node or triple-term option.`);
          return [];
        }
        return [{
          term: value,
          key: valueKey(value),
          label: value.termType === "NamedNode" ? labelFor(quads, value.value, { predicates: this.#labelPredicates }) ?? localName(value.value) : value.value,
          alternatives: value.termType === "NamedNode" ? alternatives.get(value.value) ?? [] : []
        }];
      });
      if (optionTerms.length !== options.length) continue;
      const nodeKind = firstValue(quads, shape, `${SH}nodeKind`);
      const datatype = firstValue(quads, shape, `${SH}datatype`);
      const valueKind = nodeKind === `${SH}IRI` ? "NamedNode" : "Literal";
      if (valueKind === "NamedNode" && datatype) {
        this.#modelIssues.push(`${localName(shape)} cannot combine sh:nodeKind sh:IRI with sh:datatype.`);
        continue;
      }
      const defaultTerm = authorValue(values(quads, shape, `${SH}defaultValue`)[0]);
      const defaultValue = options.length > 0 ? options.find(({ term }) => defaultTerm && valueKey(term) === valueKey(defaultTerm))?.key : defaultTerm?.termType === valueKind ? defaultTerm.value : void 0;
      if (defaultTerm && defaultValue === void 0) {
        this.#modelIssues.push(`${localName(shape)} has a default value outside its supported value space.`);
      }
      const declaredLabel = firstValue(quads, annotation, `${SH}name`) ?? labelFor(quads, annotation, { predicates: this.#labelPredicates }) ?? firstValue(quads, shape, `${SH}name`) ?? labelFor(quads, shape, { predicates: this.#labelPredicates }) ?? localName(shape);
      const required = (numberValue(quads, shape, `${SH}minCount`) ?? 0) > 0;
      const group = groupInfo(quads, shape);
      const order = numberValue(quads, shape, `${SH}order`) ?? Number.MAX_SAFE_INTEGER;
      const targets = annotationTargetIrisForAnnotation(quads, annotation);
      if (targets.length === 0) {
        this.#modelIssues.push(`${localName(annotation)} must target at least one HTML element IRI.`);
        continue;
      }
      const focusNodes = namedValues(quads, annotation, `${SCHEMA}about`);
      const subject = focusNodes.length === 1 ? focusNodes[0] : targetNodes[0];
      if (!subject || focusNodes.length > 1 || targetNodes.length > 1) {
        this.#modelIssues.push(`${localName(annotation)} must resolve to one focus node.`);
        continue;
      }
      for (const targetIri of targets) {
        const placeholder = elementForIri(this.#resolvedSourceRoot, targetIri, sourceDocumentIri);
        if (!placeholder) {
          this.#modelIssues.push(`${localName(targetIri)} is outside the configured source root or is not an HTML element.`);
          continue;
        }
        const key = `${shape}
${subject}`;
        const existing = bindings.get(key);
        if (existing) {
          if (existing.scopes.length !== scopes.length || existing.scopes.some((scope) => !scopes.includes(scope))) {
            this.#modelIssues.push(`${localName(annotation)} gives one field incompatible scopes.`);
          } else if (!existing.placeholders.includes(placeholder)) {
            existing.placeholders.push(placeholder);
          }
          continue;
        }
        bindings.set(key, {
          key,
          shape,
          scopes,
          subject,
          path: paths[0],
          label: declaredLabel,
          groupKey: group.key,
          groupLabel: group.label,
          groupOrder: group.order,
          order,
          placeholders: [placeholder],
          options,
          valueKind,
          ...datatype ? { datatype } : {},
          ...defaultValue !== void 0 ? { defaultValue } : {},
          ...firstValue(quads, shape, `${SH}pattern`) ? { pattern: firstValue(quads, shape, `${SH}pattern`) } : {},
          ...numberValue(quads, shape, `${SH}minLength`) !== void 0 ? { minLength: numberValue(quads, shape, `${SH}minLength`) } : {},
          ...numberValue(quads, shape, `${SH}maxLength`) !== void 0 ? { maxLength: numberValue(quads, shape, `${SH}maxLength`) } : {},
          required,
          value: "",
          touched: false,
          error: ""
        });
      }
    }
    return Array.from(bindings.values());
  }
  #render() {
    const root = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    const panelLabel = escapeHtml(this.#panelLabel());
    root.innerHTML = `
      <style>
        :host {
          --editor-accent: oklch(49% 0.18 294);
          --editor-accent-soft: oklch(93% 0.035 294);
          --editor-ink: oklch(23% 0.035 286);
          --editor-muted: oklch(47% 0.025 286);
          --editor-paper: oklch(98.5% 0.008 286);
          --editor-layer: oklch(94.5% 0.02 286);
          --editor-rule: oklch(84% 0.025 286);
          font-family: "Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", sans-serif;
        }
        * { box-sizing: border-box; }
        button, input, select { font: inherit; }
        :where(button, input, select):focus-visible {
          outline: 3px solid oklch(81% 0.15 135);
          outline-offset: 2px;
        }
        .launcher {
          align-items: center;
          background: var(--editor-accent);
          border: 1px solid oklch(38% 0.16 294);
          border-radius: 8px;
          bottom: 4.6rem;
          box-shadow: 0 8px 28px oklch(20% 0.03 286 / 22%);
          color: var(--editor-paper);
          cursor: pointer;
          display: flex;
          font-size: .78rem;
          font-weight: 750;
          gap: .65rem;
          min-height: 44px;
          padding: .7rem .9rem;
          position: fixed;
          right: 1rem;
          z-index: 30;
        }
        .launcher[data-position^="left"] { left: 1rem; right: auto; }
        .launcher[aria-expanded="true"] {
          pointer-events: none;
          visibility: hidden;
        }
        .count {
          background: var(--editor-paper);
          border-radius: 999px;
          color: var(--editor-accent);
          min-width: 1.6rem;
          padding: .16rem .4rem;
          text-align: center;
        }
        .drawer {
          --ia2-window-rule: var(--editor-rule);
          --ia2-window-width: 26rem;
          background: var(--editor-paper);
          color: var(--editor-ink);
          container-name: value-editor;
          container-type: inline-size;
          display: grid;
          grid-template-rows: auto auto minmax(0, 1fr);
          z-index: 40;
        }
        .drawer[data-position="floating"] .drawer-head { cursor: grab; touch-action: none; user-select: none; }
        .drawer[data-position="floating"].is-dragging .drawer-head { cursor: grabbing; }
        :host([positioning="fixed"]) .drawer[data-position="floating"] .drawer-head {
          cursor: default;
          touch-action: auto;
          user-select: auto;
        }
        .quick-editor {
          background: var(--editor-paper);
          border: 1px solid var(--editor-rule);
          border-radius: 12px;
          box-shadow:
            0 18px 50px oklch(28% 0.03 60 / 12%),
            0 2px 8px oklch(28% 0.03 60 / 7%);
          color: var(--editor-ink);
          display: grid;
          max-height: calc(100vh - 24px);
          opacity: 0;
          overflow: hidden;
          pointer-events: none;
          position: fixed;
          transform: translateY(-4px) scale(.99);
          transition:
            opacity 140ms ease,
            transform 180ms cubic-bezier(.22, 1, .36, 1),
            visibility 0s linear 180ms;
          visibility: hidden;
          width: min(340px, calc(100vw - 24px));
          z-index: var(--ia2-window-dialog-layer, 2147483040);
        }
        .quick-editor[data-open] {
          opacity: 1;
          pointer-events: auto;
          transform: none;
          transition-delay: 0s, 0s, 0s;
          visibility: visible;
        }
        .quick-body {
          min-width: 0;
          overflow: auto;
          padding: .15rem 1rem .55rem;
        }
        .quick-group {
          color: var(--editor-muted);
          font-size: .62rem;
          font-weight: 780;
          letter-spacing: .045em;
          margin: .75rem 0 -.45rem;
          text-transform: uppercase;
        }
        .quick-body .field {
          border: 0;
          padding: .85rem 0 .65rem;
        }
        .quick-actions {
          align-items: center;
          border-top: 1px solid var(--editor-rule);
          display: flex;
          gap: .35rem;
          justify-content: flex-end;
          padding: .55rem;
        }
        .quick-action {
          background: transparent;
          border: 1px solid var(--editor-rule);
          border-radius: 7px;
          color: var(--editor-ink);
          cursor: pointer;
          font-size: .7rem;
          font-weight: 720;
          min-height: 36px;
          padding: .4rem .65rem;
        }
        .quick-action:hover { background: var(--editor-accent-soft); }
        .quick-action:disabled {
          background: transparent;
          color: color-mix(in oklch, var(--editor-muted), transparent 45%);
          cursor: default;
        }
        .quick-expand {
          align-items: center;
          border-color: transparent;
          color: var(--editor-accent);
          display: inline-flex;
          gap: .35rem;
          margin-right: auto;
        }
        .quick-expand-icon {
          fill: none;
          height: 14px;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.65;
          width: 14px;
        }
        .quick-done {
          background: var(--editor-accent);
          border-color: var(--editor-accent);
          color: var(--editor-paper);
        }
        .quick-done:hover {
          background: color-mix(in oklch, var(--editor-accent), var(--editor-ink) 12%);
        }
        .drawer-head {
          border-bottom: 1px solid var(--editor-rule);
          min-width: 0;
          padding: 1rem 1.1rem .9rem;
        }
        .head-row { align-items: start; display: grid; gap: .75rem; grid-template-columns: minmax(0, 1fr) auto; min-width: 0; }
        h2 { font-size: 1.08rem; letter-spacing: -.02em; margin: 0; }
        .progress { color: var(--editor-muted); font-size: .75rem; line-height: 1.45; margin: .3rem 0 0; }
        .how-link {
          background: transparent;
          border: 0;
          color: var(--editor-accent);
          cursor: pointer;
          font-size: .7rem;
          font-weight: 720;
          margin: .15rem 0 0;
          padding: .2rem 0;
          text-decoration: underline;
          text-decoration-color: color-mix(in oklch, var(--editor-accent), transparent 60%);
          text-underline-offset: .2em;
        }
        .how-link:hover { text-decoration-color: currentColor; }
        .head-actions { align-items: center; display: flex; flex-wrap: wrap; gap: .4rem; justify-content: flex-end; min-width: 0; }
        .ia2-position-control { flex: 0 0 auto; position: relative; z-index: 14; }
        .ia2-position-trigger {
          align-items: center;
          background: var(--editor-accent);
          border: 0;
          border-radius: 7px;
          color: var(--editor-paper);
          cursor: pointer;
          display: none;
          height: 36px;
          justify-content: center;
          padding: 0;
          width: 36px;
        }
        .ia2-position-trigger:hover {
          background: color-mix(in oklch, var(--editor-accent), var(--editor-ink) 12%);
        }
        .ia2-position-label { display: none; }
        .editor-position-switch {
          align-items: center;
          border: 1px solid transparent;
          border-radius: 7px;
          display: inline-flex;
          flex: 0 0 auto;
          overflow: hidden;
        }
        .editor-position-switch:hover,
        .editor-position-switch:focus-within {
          background: var(--editor-layer);
          border-color: var(--editor-rule);
        }
        .editor-position-option {
          align-items: center;
          background: transparent;
          border: 0;
          border-right: 1px solid transparent;
          color: var(--editor-muted);
          cursor: pointer;
          display: inline-flex;
          flex: 0 0 28px;
          height: 32px;
          justify-content: center;
          opacity: .28;
          padding: 0;
          pointer-events: none;
          width: 28px;
        }
        .editor-position-switch:hover .editor-position-option,
        .editor-position-switch:focus-within .editor-position-option {
          border-right-color: var(--editor-rule);
          opacity: 1;
          pointer-events: auto;
        }
        .editor-position-option:last-child { border-right: 0; }
        .editor-position-option:hover { background: var(--editor-accent-soft); color: var(--editor-accent); }
        .editor-position-option[aria-checked="true"] {
          background: var(--editor-accent);
          color: var(--editor-paper);
          opacity: 1;
          pointer-events: auto;
        }
        :host([positioning="fixed"]) .ia2-position-control { display: none; }
        .text-button, .close {
          background: transparent;
          border: 1px solid var(--editor-rule);
          border-radius: 8px;
          color: var(--editor-ink);
          cursor: pointer;
          font-size: .72rem;
          font-weight: 700;
          min-height: 36px;
          padding: .45rem .65rem;
        }
        .close { font-size: 1rem; padding-inline: .65rem; }
        .editor-tools {
          background: var(--editor-paper);
          border-bottom: 1px solid var(--editor-rule);
          display: grid;
          gap: .35rem;
          min-height: 48px;
          min-width: 0;
          padding: .35rem 1.1rem;
        }
        .editor-tools-row {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: .5rem;
          justify-content: space-between;
        }
        .data-actions {
          align-items: stretch;
          display: inline-flex;
          flex: 0 0 auto;
          gap: 0;
          max-width: 100%;
          min-width: 0;
        }
        .data-button,
        .save-choice {
          background: var(--editor-paper);
          border: 1px solid var(--editor-rule);
          border-radius: 0;
          color: var(--editor-ink);
          cursor: pointer;
          font-size: .7rem;
          font-weight: 700;
          min-height: 36px;
          padding: .4rem .65rem;
          width: auto;
        }
        .data-button:first-child { border-radius: 8px 0 0 8px; }
        .data-button:last-child { border-radius: 0 8px 8px 0; }
        .data-actions > * + * { border-left: 0; }
        .data-button:hover,
        .save-choice:hover { background: var(--editor-accent-soft); }
        .save-choice { min-width: 12.5rem; }
        .data-status {
          color: var(--editor-muted);
          font-size: .68rem;
          line-height: 1.4;
          margin: 0;
        }
        .data-status[data-state="success"] { color: oklch(40% 0.11 150); }
        .data-status[data-state="warning"] { color: oklch(43% 0.11 78); }
        .data-status[data-state="error"] { color: oklch(48% .18 28); }
        .sync-control { align-items: center; display: inline-flex; gap: 6px; }
        .sync-label {
          color: var(--editor-muted);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .sync-switch {
          align-items: stretch;
          background: var(--editor-layer);
          border: 1px solid var(--editor-rule);
          border-radius: 8px;
          display: inline-flex;
          height: 36px;
          overflow: hidden;
        }
        .sync-switch:focus-within { border-color: var(--editor-accent); }
        .sync-option {
          align-items: center;
          background: transparent;
          border: 0;
          border-right: 1px solid var(--editor-rule);
          color: var(--editor-muted);
          cursor: pointer;
          display: inline-flex;
          justify-content: center;
          padding: 0;
          width: 42px;
        }
        .sync-option:last-child { border-right: 0; }
        .sync-option:hover { background: var(--editor-accent-soft); color: var(--editor-accent); }
        .sync-option[aria-checked="true"] { background: var(--editor-accent); color: var(--editor-paper); }
        .sync-option:focus-visible {
          outline: 2px solid var(--editor-accent);
          outline-offset: -3px;
          position: relative;
          z-index: 1;
        }
        .sync-icon {
          display: block;
          fill: none;
          height: 16px;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.5;
          width: 32px;
        }
        .controls { min-width: 0; overflow: auto; padding: 0 1.1rem 2rem; }
        .group { border: 0; margin: 0; padding: 0; }
        .group + .group { margin-top: 1.15rem; }
        .group-title {
          background: var(--editor-paper);
          border-bottom: 1px solid var(--editor-rule);
          color: var(--editor-muted);
          font-size: .67rem;
          font-weight: 780;
          letter-spacing: .045em;
          margin: 0;
          padding: 1rem 0 .55rem;
          position: sticky;
          text-transform: uppercase;
          top: 0;
          z-index: 1;
        }
        .field { border-bottom: 1px solid var(--editor-rule); padding: .85rem 0 .9rem; }
        .field.is-corresponding {
          background: color-mix(in oklch, var(--editor-accent-soft), transparent 28%);
        }
        label { display: block; font-size: .82rem; font-weight: 700; margin-bottom: .4rem; }
        input, select {
          background: var(--editor-layer);
          border: 1px solid var(--editor-rule);
          border-radius: 8px;
          color: var(--editor-ink);
          min-height: 40px;
          padding: .5rem .65rem;
          width: 100%;
        }
        input[aria-invalid="true"], select[aria-invalid="true"] {
          border-color: oklch(53% 0.16 25);
        }
        .constraint, .error { font-size: .68rem; line-height: 1.45; margin: .35rem 0 0; }
        .constraint { color: var(--editor-muted); }
        .error { color: oklch(42% 0.14 25); font-weight: 650; }
        .error:empty { display: none; }
        .empty { color: var(--editor-muted); font-size: .82rem; line-height: 1.55; padding: 1.2rem 0; }
        .architecture-window {
          background: var(--editor-paper);
          border: 1px solid var(--editor-rule);
          border-radius: 14px;
          box-shadow: 0 18px 64px oklch(20% 0.03 286 / 24%);
          color: var(--editor-ink);
          display: grid;
          grid-template-rows: auto minmax(0, 1fr) auto;
          height: min(760px, calc(100vh - 48px));
          max-width: calc(100vw - 48px);
          opacity: 0;
          overflow: hidden;
          pointer-events: none;
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -48%) scale(.985);
          transition: opacity 180ms ease, transform 220ms cubic-bezier(.22, 1, .36, 1), visibility 220ms;
          visibility: hidden;
          width: min(760px, calc(100vw - 48px));
          z-index: var(--ia2-window-dialog-layer, 2147483040);
        }
        .architecture-window[data-open="true"] {
          opacity: 1;
          pointer-events: auto;
          transform: translate(-50%, -50%) scale(1);
          visibility: visible;
        }
        .architecture-toolbar {
          align-items: center;
          border-bottom: 1px solid var(--editor-rule);
          cursor: default;
          display: flex;
          gap: .55rem;
          min-height: 48px;
          padding: 0 .55rem 0 .8rem;
        }
        .architecture-toolbar h2 {
          flex: 1 1 auto;
          font-size: .9rem;
          letter-spacing: -.01em;
          min-width: 8rem;
        }
        .position-icon {
          display: block;
          fill: none;
          height: 16px;
          stroke: currentColor;
          stroke-linejoin: round;
          stroke-width: 1.25;
          width: 20px;
        }
        .position-region { fill: currentColor; stroke: none; }
        .help-close {
          align-items: center;
          background: transparent;
          border: 0;
          border-radius: 7px;
          color: var(--editor-muted);
          cursor: pointer;
          display: flex;
          flex: 0 0 36px;
          font-size: 1.05rem;
          height: 36px;
          justify-content: center;
          padding: 0;
        }
        .help-close:hover { background: var(--editor-layer); color: var(--editor-ink); }
        .architecture-body { overflow: auto; padding: 1.4rem clamp(1.1rem, 4vw, 2rem) 2.2rem; }
        .architecture-kicker {
          color: var(--editor-accent);
          font-size: .67rem;
          font-weight: 780;
          letter-spacing: .055em;
          margin: 0 0 .55rem;
          text-transform: uppercase;
        }
        .architecture-title {
          font-size: clamp(1.55rem, 4vw, 2.25rem);
          letter-spacing: -.045em;
          line-height: 1.04;
          margin: 0;
          max-width: 18ch;
        }
        .architecture-lede {
          color: var(--editor-muted);
          font-size: .92rem;
          line-height: 1.6;
          margin: .8rem 0 1.5rem;
          max-width: 66ch;
        }
        .architecture-flow {
          align-items: stretch;
          display: grid;
          grid-template-columns: minmax(9rem, 1fr) auto minmax(9rem, 1fr) auto minmax(9rem, 1fr);
          margin: 1.2rem 0 1.6rem;
        }
        .flow-node {
          background: var(--editor-layer);
          border: 1px solid var(--editor-rule);
          border-radius: 10px;
          min-width: 0;
          padding: .85rem;
        }
        .flow-node.engine {
          background: var(--editor-accent-soft);
          border-color: color-mix(in oklch, var(--editor-accent), var(--editor-rule) 68%);
        }
        .flow-label {
          color: var(--editor-muted);
          display: block;
          font-size: .62rem;
          font-weight: 780;
          letter-spacing: .05em;
          margin-bottom: .45rem;
          text-transform: uppercase;
        }
        .flow-node strong { display: block; font-size: .82rem; line-height: 1.25; margin-bottom: .45rem; }
        .flow-node ul { color: var(--editor-muted); font-size: .7rem; line-height: 1.45; list-style: none; margin: 0; padding: 0; }
        .flow-node li + li { margin-top: .2rem; }
        .flow-node code, .flow-connector code, .architecture-claims code {
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: .92em;
        }
        .flow-connector {
          align-items: center;
          color: var(--editor-accent);
          display: flex;
          flex-direction: column;
          font-size: 1.1rem;
          justify-content: center;
          padding: 0 .45rem;
          text-align: center;
        }
        .flow-connector code {
          color: var(--editor-muted);
          font-size: .56rem;
          line-height: 1.25;
          max-width: 8rem;
          overflow-wrap: anywhere;
        }
        .architecture-claims { border-top: 1px solid var(--editor-rule); margin: 0; }
        .architecture-claims > div {
          border-bottom: 1px solid var(--editor-rule);
          display: grid;
          gap: .8rem;
          grid-template-columns: minmax(8rem, 10rem) minmax(0, 1fr);
          padding: .85rem 0;
        }
        .architecture-claims dt { font-size: .75rem; font-weight: 760; }
        .architecture-claims dd { color: var(--editor-muted); font-size: .78rem; line-height: 1.55; margin: 0; }
        .connector-example {
          background: oklch(25% 0.04 286);
          border-radius: 8px;
          color: var(--editor-paper);
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: .68rem;
          line-height: 1.65;
          margin: 1rem 0 0;
          overflow: auto;
          padding: .8rem .9rem;
          white-space: pre-wrap;
        }
        .architecture-footer {
          align-items: center;
          border-top: 1px solid var(--editor-rule);
          color: var(--editor-muted);
          display: flex;
          font-size: .68rem;
          gap: 1rem;
          justify-content: space-between;
          padding: .65rem .8rem;
        }
        .inspect-rdf {
          background: transparent;
          border: 1px solid var(--editor-rule);
          border-radius: 7px;
          color: var(--editor-ink);
          cursor: pointer;
          font-size: .7rem;
          font-weight: 720;
          min-height: 34px;
          padding: .4rem .65rem;
        }
        .inspect-rdf:hover { background: var(--editor-layer); }
        @container value-editor (max-width: 45rem) {
          .head-actions {
            display: grid;
            grid-template-columns: 36px 36px;
          }
          .ia2-position-control {
            grid-column: 1;
            grid-row: 1;
          }
          .apply-defaults {
            grid-column: 1 / -1;
            grid-row: 2;
            justify-content: center;
            line-height: 1.2;
            min-width: 0;
            overflow-wrap: anywhere;
            padding-inline: .35rem;
            white-space: normal;
            width: 100%;
          }
          .close {
            grid-column: 2;
            grid-row: 1;
            width: 36px;
          }
          .ia2-position-trigger { display: inline-flex; }
          .editor-position-switch {
            align-items: stretch;
            background: var(--editor-paper);
            border-color: var(--editor-rule);
            box-shadow: 0 12px 36px oklch(20% 0.03 286 / 20%);
            display: none;
            flex-direction: column;
            min-width: 190px;
            overflow: hidden;
            padding: 4px;
            position: absolute;
            right: 0;
            top: calc(100% + 6px);
          }
          .ia2-position-control[data-expanded="true"] .editor-position-switch {
            display: flex;
          }
          .editor-position-option {
            border: 0;
            border-radius: 5px;
            flex: 0 0 36px;
            gap: 10px;
            justify-content: flex-start;
            opacity: 1;
            padding: 0 10px;
            pointer-events: auto;
            width: 100%;
          }
          .editor-position-switch:hover .editor-position-option,
          .editor-position-switch:focus-within .editor-position-option { border: 0; }
          .editor-position-option[aria-checked="true"] {
            background: var(--editor-accent-soft);
            color: var(--editor-accent);
          }
          .ia2-position-label {
            display: inline;
            font-size: 12px;
            font-weight: 650;
            white-space: nowrap;
          }
          .editor-tools-row {
            align-items: stretch;
            display: grid;
            grid-template-columns: minmax(0, 1fr);
          }
          .data-actions {
            display: grid;
            flex: none;
            grid-template-columns: auto minmax(0, 1fr) auto;
            width: 100%;
          }
          .data-button,
          .save-choice { min-width: 0; }
          .save-choice {
            max-width: 100%;
            width: 100%;
          }
          .sync-control { justify-self: start; }
        }
        @media (max-width: 720px) {
          .drawer[data-position="floating"] .drawer-head { cursor: default; touch-action: auto; user-select: auto; }
          .head-actions { align-items: start; justify-content: flex-end; }
          .launcher { bottom: 4.35rem; right: .75rem; }
          .launcher[data-position^="left"] { left: .75rem; right: auto; }
          .architecture-window {
            border-radius: 12px;
            bottom: 10px;
            height: calc(100vh - 20px);
            left: 10px;
            max-width: none;
            right: auto;
            top: 10px;
            transform: translateY(12px) scale(.99);
            width: calc(100vw - 20px);
          }
          .architecture-window[data-open="true"] { transform: none; }
          .architecture-flow { grid-template-columns: 1fr; }
          .flow-connector { min-height: 2.5rem; transform: rotate(90deg); }
          .flow-connector code { display: none; }
          .architecture-claims > div { grid-template-columns: 1fr; gap: .25rem; }
          .architecture-footer span { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .architecture-window, .quick-editor { transition: none; }
        }
        ${WINDOW_PLACEMENT_CSS}
      </style>
      <button class="launcher ia2-window-launcher" type="button" data-position="${this.#position}" aria-expanded="false" aria-controls="ia2-rdf-value-editor-drawer">
        ${panelLabel} <span class="count">${this.#bindings.length}</span>
      </button>
      <section class="quick-editor" role="dialog" aria-modal="false" inert>
        <div class="quick-body"></div>
        <footer class="quick-actions">
          <button class="quick-action quick-expand" type="button">
            <svg class="quick-expand-icon" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M7 3H3v4M13 3h4v4M17 13v4h-4M7 17H3v-4"></path>
            </svg>
            <span>Expand</span>
          </button>
          <button class="quick-action quick-prev" type="button">Prev</button>
          <button class="quick-action quick-next" type="button" aria-keyshortcuts="Enter">Next</button>
          <button class="quick-action quick-done" type="button">Done</button>
        </footer>
      </section>
      <aside class="drawer ia2-window-surface" id="ia2-rdf-value-editor-drawer" data-position="${this.#position}" aria-label="${panelLabel}" inert>
        <header class="drawer-head">
          <div class="head-row">
            <div>
              <h2>${panelLabel}</h2>
              <p class="progress" aria-live="polite"></p>
              <button class="how-link" type="button" aria-expanded="false" aria-controls="ia2-rdf-value-editor-help">How this works</button>
            </div>
            <div class="head-actions">
              ${this.getAttribute("positioning") === "fixed" || this.#allowedPositions.length < 2 ? "" : positionControlsMarkup({
      allowed: this.#allowedPositions,
      ariaLabel: "Completion window position",
      current: this.#position,
      groupClass: "editor-position-switch",
      optionClass: "editor-position-option"
    })}
              <button class="text-button apply-defaults" type="button">Apply defaults</button>
              <button class="close" type="button" aria-label="Close completion panel">\xD7</button>
            </div>
          </div>
        </header>
        <div class="editor-tools">
          <div class="editor-tools-row">
            <div class="data-actions" aria-label="Completion documents">
              <button class="data-button load-values" type="button">Load</button>
              <select class="save-choice" aria-label="Artifact to save">
                <option value="completed-html">Completed document \xB7 HTML/RDF</option>
                <option value="values-html">Values document \xB7 HTML/RDF</option>
                <option value="values-turtle">Values document \xB7 Turtle</option>
              </select>
              <button class="data-button save-artifact" type="button">Save</button>
              <input class="load-input" type="file" accept=".html,.htm,.ttl,text/html,text/turtle" hidden>
            </div>
            ${scrollSyncControlsMarkup({
      current: this.#syncMode,
      controlClass: "sync-control",
      labels: {
        page: "Follow page viewport in editor",
        panel: "Follow editor in page"
      },
      optionClass: "sync-option",
      switchClass: "sync-switch"
    })}
          </div>
          <p class="data-status" aria-live="polite" hidden></p>
        </div>
        <form class="controls" novalidate></form>
        ${this.getAttribute("positioning") === "fixed" ? "" : windowResizeHandlesMarkup()}
      </aside>
      <section
        class="architecture-window"
        id="ia2-rdf-value-editor-help"
        role="dialog"
        aria-modal="false"
        aria-labelledby="ia2-rdf-value-editor-help-title"
        data-open="false"
        inert
      >
        <header class="architecture-toolbar">
          <h2 id="ia2-rdf-value-editor-help-title">How this works</h2>
          <button class="help-close" type="button" aria-label="Close architecture window" title="Close">\xD7</button>
        </header>
        <div class="architecture-body">
          <p class="architecture-kicker">A document-defined form</p>
          <h3 class="architecture-title">The source carries its own authoring model.</h3>
          <p class="architecture-lede">The component contains no field list, document selectors, or domain-specific branches. It extracts ordinary RDF statements, builds controls from SHACL property shapes, and follows Web Annotations that correlate those shapes with document content.</p>

          <div class="architecture-flow" role="img" aria-label="Web Annotations connect SHACL property shapes to document targets and one generic authoring component, which updates the visible document, a runtime RDF graph, and portable saved state.">
            <div class="flow-node">
              <span class="flow-label">Document declares</span>
              <strong>Meaning and constraints</strong>
              <ul>
                <li><code>sh:PropertyShape</code></li>
                <li><code>sh:path</code> locates the authored value</li>
                <li>SHACL Core supplies the validation contract</li>
              </ul>
            </div>
            <div class="flow-connector"><span>\u2192</span><code>oa:Annotation</code></div>
            <div class="flow-node engine">
              <span class="flow-label">Generic component</span>
              <strong>IA\xB2 RDF Value Editor</strong>
              <ul>
                <li>extract RDF dataset</li>
                <li>create controls</li>
                <li>run an RDF/JS SHACL engine</li>
              </ul>
            </div>
            <div class="flow-connector"><span>\u2192</span><code>accepted value</code></div>
            <div class="flow-node">
              <span class="flow-label">Correlated results</span>
              <strong>One value, connected views</strong>
              <ul>
                <li>visible HTML placeholders</li>
                <li>named runtime RDF graph</li>
                <li>completed source HTML</li>
                <li>portable HTML/RDF or Turtle state</li>
              </ul>
            </div>
          </div>

          <dl class="architecture-claims">
            <div>
              <dt>The source chooses its domain model</dt>
              <dd>RDF Value Editor does not require a legal, publishing, business, or application ontology. A source can use any RDF vocabulary for the resources and properties that its SHACL shapes target.</dd>
            </div>
            <div>
              <dt>SHACL states the rules</dt>
              <dd>Presentation hints such as datatype, counts, defaults, and enumerations determine the control. The complete active property shape is then evaluated by an RDF/JS engine implementing the SHACL Core constraint components, including logical, range, pair, qualified-value, language, class, and nested-shape constraints.</dd>
            </div>
            <div>
              <dt>Annotations correlate every view</dt>
              <dd>An <code>oa:Annotation</code>, normally motivated by <code>oa:describing</code>, uses the property shape as its body and each visible value location as a target. <code>schema:about</code> supplies a focus node when a reusable shape does not declare one. Repeated targets stay synchronized without field-specific selectors.</dd>
            </div>
            <div>
              <dt>Choices project alternative content</dt>
              <dd>An <code>oa:Choice</code> body lists scoped <code>oa:SpecificResource</code> alternatives. Each alternative identifies an inert HTML template as its source and the selected option as its scope. <code>oa:editing</code> states the annotation's motivation. The same scoped-resource pattern makes a field conditional.</dd>
            </div>
            <div>
              <dt>Valid input becomes RDF</dt>
              <dd>The shape's target and path become the subject and predicate. Accepted input is emitted into the host-selected named graph; invalid input stays out of that graph.</dd>
            </div>
            <div>
              <dt>Save offers the completed document and portable state separately</dt>
              <dd>Choose a clean completed HTML/RDF copy with valid values and selected alternatives applied, or a smaller HTML/RDF or Turtle values document linked to the source with PROV. Every Save action downloads one selected artifact. Load reads either kind, resolves the same RDF identities, and sends every accepted value through the normal validation and projection path.</dd>
            </div>
          </dl>

          <pre class="connector-example" aria-label="Generic annotation example">&lt;a href="http://www.w3.org/ns/oa#Annotation"
   rdf-subject="#field-presentation"
   rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"&gt;&lt;/a&gt;
&lt;a href="http://www.w3.org/ns/oa#describing"
   rdf-subject="#field-presentation"
   rdf-predicate="http://www.w3.org/ns/oa#motivatedBy"&gt;&lt;/a&gt;
&lt;a href="#some-property-shape"
   rdf-subject="#field-presentation"
   rdf-predicate="http://www.w3.org/ns/oa#hasBody"&gt;&lt;/a&gt;
&lt;a href="#visible-value"
   rdf-subject="#field-presentation"
   rdf-predicate="http://www.w3.org/ns/oa#hasTarget"&gt;&lt;/a&gt;</pre>
        </div>
        <footer class="architecture-footer">
          <span>${this.#bindings.length} controls discovered from this document's RDF dataset</span>
        </footer>
      </section>
    `;
    this.#launcher = root.querySelector(".launcher");
    this.#drawer = root.querySelector(".drawer");
    this.#quickEditor = root.querySelector(".quick-editor");
    this.#quickBody = root.querySelector(".quick-body");
    this.#progress = root.querySelector(".progress");
    this.#controls = root.querySelector(".controls");
    this.#helpTrigger = root.querySelector(".how-link");
    this.#helpWindow = root.querySelector(".architecture-window");
    this.#dataStatus = root.querySelector(".data-status");
    this.#loadInput = root.querySelector(".load-input");
    this.#launcher?.addEventListener("click", () => this.open());
    root.querySelector(".quick-expand")?.addEventListener("click", () => this.#expandQuickEditor());
    root.querySelector(".quick-prev")?.addEventListener("click", () => this.#navigateQuickEditor(-1));
    root.querySelector(".quick-next")?.addEventListener("click", () => this.#navigateQuickEditor(1));
    root.querySelector(".quick-done")?.addEventListener("click", () => void this.#finishQuickEditor());
    this.#quickEditor?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.#hideQuickEditor(true);
        return;
      }
      if (event.key !== "Enter" || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || !(event.target instanceof HTMLElement) || !event.target.matches("input, select")) return;
      const next = this.#quickEditor?.querySelector(".quick-next");
      if (!next || next.disabled) return;
      event.preventDefault();
      this.#navigateQuickEditor(1);
    });
    root.querySelector(".close")?.addEventListener("click", () => this.close());
    root.querySelector(".apply-defaults")?.addEventListener("click", () => this.#applyDefaults());
    root.querySelector(".load-values")?.addEventListener("click", () => this.#loadInput?.click());
    root.querySelector(".save-artifact")?.addEventListener("click", async () => {
      const choice = root.querySelector(".save-choice")?.value;
      try {
        await this.validate();
        if (choice === "values-turtle") this.saveArtifact("values", "turtle");
        else if (choice === "values-html") this.saveArtifact("values", "html");
        else this.saveArtifact("completed");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.#setDataStatus(`Could not save document: ${message}`, "error");
      }
    });
    this.#loadInput?.addEventListener("change", async () => {
      const file = this.#loadInput?.files?.[0];
      if (!file) return;
      await this.loadCompletionFile(file);
      if (this.#loadInput) this.#loadInput.value = "";
    });
    this.#drawer?.querySelector(".drawer-head")?.addEventListener("pointerdown", (event) => {
      if (!this.#drawer) return;
      startFloatingWindowDrag(event, this.#drawer, {
        disabled: this.#position !== "floating" || this.getAttribute("positioning") === "fixed"
      });
    });
    this.#drawer?.querySelectorAll(".ia2-window-resize-handle").forEach((handle) => {
      handle.addEventListener("pointerdown", (event) => {
        if (!this.#drawer) return;
        startWindowResize(
          event,
          this.#drawer,
          this.#position,
          handle.dataset.resize,
          {
            disabled: this.getAttribute("positioning") === "fixed"
          }
        );
      });
    });
    const editorPositionSwitch = this.#drawer?.querySelector(".editor-position-switch");
    if (editorPositionSwitch) {
      bindWindowPositionControls(editorPositionSwitch, (position) => this.setPosition(position));
    }
    const syncSwitch = root.querySelector(".sync-switch");
    if (syncSwitch) {
      this.#syncControlCleanup = bindScrollSyncControls(syncSwitch, (mode) => this.setSyncMode(mode));
    }
    this.#helpTrigger?.addEventListener("click", () => this.#openHelp());
    root.querySelector(".help-close")?.addEventListener("click", () => this.#closeHelp());
    this.#helpWindow?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.#closeHelp();
    });
    this.#drawer?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.close();
    });
    this.#renderControls();
    this.#configureSync();
  }
  #renderControls() {
    if (!this.#controls) return;
    this.#bindingControls.clear();
    this.#bindingRows.clear();
    if (this.#bindings.length === 0) {
      this.#controls.innerHTML = '<p class="empty">This source does not connect any authorable SHACL property shapes to visible placeholders.</p>';
      return;
    }
    let currentGroupKey;
    let group;
    this.#bindings.forEach((binding, index) => {
      if (binding.groupKey !== currentGroupKey) {
        currentGroupKey = binding.groupKey;
        group = this.ownerDocument.createElement("section");
        group.className = "group";
        const heading = this.ownerDocument.createElement("h3");
        heading.className = "group-title";
        heading.textContent = binding.groupLabel;
        group.append(heading);
        this.#controls.append(group);
      }
      const row = this.ownerDocument.createElement("div");
      row.className = "field";
      this.#bindingRows.set(binding.key, row);
      const id = `ia2-value-${index}`;
      const errorId = `${id}-error`;
      const constraintId = `${id}-constraint`;
      const label = this.ownerDocument.createElement("label");
      label.htmlFor = id;
      label.textContent = binding.label;
      row.append(label);
      if (binding.options.length === 0) {
        const input = this.ownerDocument.createElement("input");
        input.id = id;
        input.name = id;
        input.type = inputType(binding);
        if (binding.datatype === `${XSD}integer`) input.step = "1";
        input.required = binding.required;
        input.value = binding.defaultValue ?? "";
        const constraintText = constraintSummary(binding);
        input.setAttribute(
          "aria-describedby",
          [constraintText ? constraintId : "", errorId].filter(Boolean).join(" ")
        );
        input.addEventListener("input", () => this.#acceptValue(binding, input));
        input.addEventListener("blur", () => this.#acceptValue(binding, input));
        this.#bindingControls.set(binding.key, input);
        row.append(input);
        if (constraintText) {
          const constraint = this.ownerDocument.createElement("p");
          constraint.className = "constraint";
          constraint.id = constraintId;
          constraint.textContent = constraintText;
          row.append(constraint);
        }
      } else {
        const select = this.ownerDocument.createElement("select");
        select.id = id;
        select.name = id;
        select.required = binding.required;
        select.setAttribute("aria-describedby", `${constraintId} ${errorId}`);
        const emptyOption = this.ownerDocument.createElement("option");
        emptyOption.textContent = "Choose an option";
        emptyOption.value = "";
        select.append(emptyOption);
        for (const option of binding.options) {
          const optionElement = this.ownerDocument.createElement("option");
          optionElement.textContent = option.label;
          optionElement.value = option.key;
          select.append(optionElement);
        }
        select.value = binding.defaultValue ?? "";
        select.addEventListener("change", () => this.#acceptValue(binding, select));
        select.addEventListener("blur", () => this.#acceptValue(binding, select));
        this.#bindingControls.set(binding.key, select);
        row.append(select);
        const affectedTargets = new Set(binding.options.flatMap((option) => option.alternatives.map(({ target }) => target)));
        const constraint = this.ownerDocument.createElement("p");
        constraint.className = "constraint";
        constraint.id = constraintId;
        constraint.textContent = [
          binding.required ? "Required" : "Optional",
          `${binding.options.length} declared alternatives`,
          affectedTargets.size > 0 ? `Updates ${affectedTargets.size} document ${affectedTargets.size === 1 ? "region" : "regions"}` : ""
        ].filter(Boolean).join(" \xB7 ");
        row.append(constraint);
      }
      const error = this.ownerDocument.createElement("p");
      error.className = "error";
      error.id = errorId;
      error.setAttribute("aria-live", "polite");
      row.append(error);
      group?.append(row);
    });
  }
  #scrollControlIntoEditor(control, behavior) {
    const controls = this.#controls;
    if (!controls) return;
    if (!controls.scrollTo) {
      control.scrollIntoView?.({ behavior, block: "center" });
      return;
    }
    const controlRect = control.getBoundingClientRect();
    const controlsRect = controls.getBoundingClientRect();
    controls.scrollTo({
      behavior,
      top: controls.scrollTop + controlRect.top - controlsRect.top - (controlsRect.height - controlRect.height) / 2
    });
  }
  #configureSync(runInitialSync = true) {
    this.#syncCleanup?.();
    this.#syncCleanup = null;
    for (const row of this.#bindingRows.values()) row.classList.remove("is-corresponding");
    if (this.#syncMode === "off" || !this.#controls || !this.#drawer?.hasAttribute("data-open")) return;
    const view = this.ownerDocument.defaultView;
    if (!view) return;
    const controls = this.#controls;
    const cleanups = [];
    let timer = null;
    let activeAnimation = null;
    let lastBinding = null;
    const listen = (target, type, listener, options) => {
      target.addEventListener(type, listener, options);
      cleanups.push(() => target.removeEventListener(type, listener, options));
    };
    const schedule = (callback) => {
      if (timer !== null) view.clearTimeout(timer);
      timer = view.setTimeout(() => {
        timer = null;
        callback();
      }, 32);
    };
    const selectBinding = (binding) => {
      for (const row of this.#bindingRows.values()) row.classList.remove("is-corresponding");
      this.#bindingRows.get(binding.key)?.classList.add("is-corresponding");
    };
    const emphasizePlaceholder = (placeholder) => {
      activeAnimation?.cancel();
      if (view.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      activeAnimation = placeholder.animate?.(
        [
          { outline: "2px solid transparent", outlineOffset: "7px" },
          { outline: "2px solid oklch(62% 0.18 294)", outlineOffset: "4px" }
        ],
        {
          direction: "alternate",
          duration: 520,
          easing: "cubic-bezier(.22,1,.36,1)",
          iterations: Infinity
        }
      ) ?? null;
    };
    const clearEmphasis = () => {
      activeAnimation?.cancel();
      activeAnimation = null;
    };
    for (const binding of this.#bindings) {
      const row = this.#bindingRows.get(binding.key);
      const control = this.#bindingControls.get(binding.key);
      if (!row || !control || row.hidden || control.disabled) continue;
      for (const placeholder of binding.placeholders) {
        listen(placeholder, "pointerenter", () => {
          selectBinding(binding);
          this.#scrollControlIntoEditor(control, "auto");
        });
        listen(placeholder, "pointerleave", () => {
          row.classList.remove("is-corresponding");
        });
      }
      listen(row, "pointerenter", () => {
        const placeholder = binding.placeholders[0];
        if (!placeholder) return;
        emphasizePlaceholder(placeholder);
        if (this.#syncMode === "panel") {
          placeholder.scrollIntoView({
            behavior: view.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            block: "center"
          });
        }
      });
      listen(row, "pointerleave", clearEmphasis);
    }
    if (this.#syncMode === "page") {
      const followPage = () => {
        if (!this.#drawer?.hasAttribute("data-open")) return;
        const readingLine = Math.min(view.innerHeight * 0.35, 140);
        let closest = null;
        let closestDistance = Number.POSITIVE_INFINITY;
        for (const binding of this.#bindings) {
          if (!this.#isBindingActive(binding)) continue;
          for (const placeholder of binding.placeholders) {
            const rect = placeholder.getBoundingClientRect();
            if (rect.bottom <= 0 || rect.top >= view.innerHeight) continue;
            const distance = Math.abs(rect.top - readingLine);
            if (distance < closestDistance) {
              closest = binding;
              closestDistance = distance;
            }
          }
        }
        if (!closest || closest === lastBinding) return;
        lastBinding = closest;
        selectBinding(closest);
        const control = this.#bindingControls.get(closest.key);
        if (control) this.#scrollControlIntoEditor(control, "auto");
      };
      listen(view, "scroll", () => schedule(followPage), { passive: true });
      listen(view, "resize", () => schedule(followPage), { passive: true });
      if (runInitialSync) schedule(followPage);
    } else {
      const followEditor = () => {
        if (!this.#drawer?.hasAttribute("data-open")) return;
        const controlsRect = controls.getBoundingClientRect();
        const readingLine = controlsRect.top + Math.min(controlsRect.height * 0.35, 140);
        let closest = null;
        let closestDistance = Number.POSITIVE_INFINITY;
        for (const binding of this.#bindings) {
          const control = this.#bindingControls.get(binding.key);
          if (!control || control.disabled) continue;
          const rect = control.getBoundingClientRect();
          if (rect.bottom <= controlsRect.top || rect.top >= controlsRect.bottom) continue;
          const distance = Math.abs(rect.top - readingLine);
          if (distance < closestDistance) {
            closest = binding;
            closestDistance = distance;
          }
        }
        if (!closest || closest === lastBinding) return;
        const placeholder = closest.placeholders[0];
        if (!placeholder) return;
        lastBinding = closest;
        selectBinding(closest);
        placeholder.scrollIntoView({ behavior: "auto", block: "center" });
        emphasizePlaceholder(placeholder);
      };
      listen(controls, "scroll", () => schedule(followEditor), { passive: true });
      if (runInitialSync) schedule(followEditor);
    }
    this.#syncCleanup = () => {
      for (const cleanup of cleanups) cleanup();
      if (timer !== null) view.clearTimeout(timer);
      clearEmphasis();
      for (const row of this.#bindingRows.values()) row.classList.remove("is-corresponding");
    };
  }
  #acceptValue(binding, control) {
    binding.touched = true;
    binding.value = control.value;
    this.#validationPromise = this.#validateAndProject();
  }
  #updateError(control, message) {
    const row = control.closest(".field");
    const error = row?.querySelector(".error");
    if (error) error.textContent = message;
  }
  #representationError(binding) {
    const normalized = binding.value.trim();
    if (!normalized) return "";
    if (binding.options.length > 0 && !this.#selectedOption(binding)) {
      return "Choose a value permitted by this SHACL shape.";
    }
    if (binding.valueKind === "NamedNode") {
      try {
        const iri2 = new URL(normalized);
        if (!iri2.protocol) throw new Error("Missing scheme.");
      } catch {
        return "Enter an absolute IRI.";
      }
    }
    return "";
  }
  async #validateAndProject() {
    const version = ++this.#validationVersion;
    const active = this.#activeBindings();
    const validationBindings = this.#bindings.map((binding) => {
      const representationError = this.#representationError(binding);
      const object = representationError ? void 0 : this.#bindingTerm(binding);
      return {
        key: binding.key,
        shape: binding.shape,
        subject: binding.subject,
        path: binding.path,
        active: active.has(binding),
        ...object ? { object } : {},
        ...representationError ? { representationError } : {}
      };
    });
    try {
      const validation = await validateShaclAuthoringState(
        this.#sourceQuads,
        validationBindings
      );
      const issues = this.#bindings.flatMap((binding) => {
        const messages = validation.messages.get(binding.key);
        return messages ? [{
          bindingKey: binding.key,
          focusNode: binding.subject,
          label: binding.label,
          messages,
          path: binding.path,
          shape: binding.shape
        }] : [];
      });
      const result = {
        conforms: validation.conforms,
        issues,
        resultCount: validation.resultCount
      };
      if (version !== this.#validationVersion || !this.isConnected) return result;
      this.#validatedVersion = version;
      for (const binding of this.#bindings) {
        binding.error = validation.messages.get(binding.key)?.join(" ") ?? "";
        const control = this.#bindingControls.get(binding.key);
        if (!control) continue;
        const visibleError = binding.touched ? binding.error : "";
        control.setCustomValidity(visibleError);
        control.setAttribute("aria-invalid", visibleError ? "true" : "false");
        this.#updateError(control, visibleError);
      }
      if (this.#dataStatus?.dataset.code === "shacl-validation") {
        this.#dataStatus.hidden = true;
        this.#dataStatus.textContent = "";
        delete this.#dataStatus.dataset.code;
      }
      this.#projectAll();
      this.dispatchEvent(new CustomEvent("ia2-rdf-value-editor-validation", {
        bubbles: true,
        composed: true,
        detail: result
      }));
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const result = {
        conforms: false,
        issues: this.#bindings.filter((binding) => active.has(binding)).map((binding) => ({
          bindingKey: binding.key,
          focusNode: binding.subject,
          label: binding.label,
          messages: ["SHACL validation could not run."],
          path: binding.path,
          shape: binding.shape
        })),
        resultCount: 1
      };
      if (version !== this.#validationVersion || !this.isConnected) return result;
      this.#validatedVersion = version;
      for (const binding of this.#bindings) {
        binding.error = active.has(binding) ? "SHACL validation could not run." : "";
        const control = this.#bindingControls.get(binding.key);
        if (!control) continue;
        const visibleError = binding.touched ? binding.error : "";
        control.setCustomValidity(visibleError);
        control.setAttribute("aria-invalid", visibleError ? "true" : "false");
        this.#updateError(control, visibleError);
      }
      this.#setDataStatus(
        `SHACL validation could not run: ${message}`,
        "error",
        "shacl-validation"
      );
      this.#projectAll();
      this.dispatchEvent(new CustomEvent("ia2-rdf-value-editor-validation", {
        bubbles: true,
        composed: true,
        detail: result
      }));
      return result;
    }
  }
  #projectAll() {
    for (const binding of this.#bindings) {
      const option = this.#selectedOption(binding);
      const displayValue = option?.label ?? binding.value;
      const valid = Boolean(binding.value.trim()) && !binding.error;
      for (const placeholder of binding.placeholders) {
        placeholder.textContent = displayValue || this.#originalText.get(placeholder) || "";
        placeholder.dataset.valueState = !binding.value.trim() ? binding.options.length === 0 && binding.defaultValue !== void 0 ? "default" : "empty" : valid ? "filled" : "invalid";
      }
    }
    this.#projectRenderingAlternatives();
    this.#updateActiveBindings();
    this.#renderRuntimeData();
    this.#updateProgress();
  }
  #projectRenderingAlternatives() {
    for (const [target, state] of this.#renderingTargetStates) {
      target.hidden = state.hidden;
      target.replaceChildren(...state.childNodes);
      delete target.dataset.valueAlternative;
    }
    const active = this.#activeBindings();
    const operations = /* @__PURE__ */ new Map();
    const conflicts = /* @__PURE__ */ new Set();
    for (const binding of active) {
      if (binding.options.length === 0 || !binding.value || binding.error) continue;
      const option = this.#selectedOption(binding);
      if (!option) continue;
      for (const alternative of option.alternatives) {
        const key = alternative.target.id || alternative.resource;
        if (operations.has(key)) conflicts.add(key);
        else operations.set(key, alternative);
      }
    }
    for (const [key, alternative] of operations) {
      if (conflicts.has(key)) continue;
      alternative.target.replaceChildren(...replacementNodes(alternative.template));
      alternative.target.hidden = !alternative.template.content.hasChildNodes();
      alternative.target.dataset.valueAlternative = alternative.resource;
    }
    if (conflicts.size > 0) {
      this.#setDataStatus(
        `${conflicts.size} conflicting active document ${conflicts.size === 1 ? "alternative was" : "alternatives were"} ignored.`,
        "warning",
        "alternative-conflict"
      );
    } else if (this.#dataStatus?.dataset.code === "alternative-conflict") {
      this.#dataStatus.hidden = true;
      this.#dataStatus.textContent = "";
      delete this.#dataStatus.dataset.code;
    }
  }
  #updateActiveBindings() {
    const activeBindings = this.#activeBindings();
    for (const binding of this.#bindings) {
      const active = this.#isBindingActive(binding, activeBindings);
      const row = this.#bindingRows.get(binding.key);
      const control = this.#bindingControls.get(binding.key);
      if (row) {
        row.hidden = !active;
        row.classList.toggle("is-inactive", !active);
      }
      if (control) control.disabled = !active;
    }
    for (const group of this.#controls?.querySelectorAll(".group") ?? []) {
      group.hidden = Array.from(group.querySelectorAll(".field")).every((row) => row.hidden);
    }
    for (const state of this.#backlinkStates) {
      const active = this.#isBindingActive(state.binding, activeBindings);
      const controllingBinding = active ? void 0 : this.#controllingBinding(state.binding);
      const ariaLabel = controllingBinding ? `Resolve ${controllingBinding.label} before editing ${state.binding.label}` : `Edit ${state.binding.label}`;
      const title = `${ariaLabel} in ${this.#panelLabel()}`;
      state.placeholder.setAttribute("aria-label", ariaLabel);
      state.placeholder.setAttribute("title", title);
    }
    if (this.#quickEditor?.hasAttribute("data-open")) {
      this.#updateQuickNavigation();
      this.#positionQuickEditor();
    }
    if (this.#syncMode !== "off" && this.#drawer?.hasAttribute("data-open")) {
      this.#configureSync();
    }
  }
  #bindingTerm(binding) {
    const option = this.#selectedOption(binding);
    if (option) return option.term;
    if (!binding.value.trim() || binding.options.length > 0) return void 0;
    return binding.valueKind === "NamedNode" ? { termType: "NamedNode", value: binding.value.trim() } : {
      termType: "Literal",
      value: binding.value,
      datatype: {
        termType: "NamedNode",
        value: binding.datatype ?? `${XSD}string`
      },
      language: ""
    };
  }
  #completionDocument() {
    const sourceDocument = this.#sourceDocument();
    const view = sourceDocument.defaultView;
    const uuid = view?.crypto?.randomUUID?.();
    const stateIri = uuid ? `urn:uuid:${uuid}` : `urn:ia2:completion-state:${Date.now().toString(36)}`;
    const records = [];
    for (const binding of this.#bindings) {
      if (!this.#isBindingActive(binding) || !binding.value.trim() || binding.error) continue;
      const object = this.#bindingTerm(binding);
      if (!object) continue;
      records.push({
        label: binding.label,
        subject: binding.subject,
        predicate: binding.path,
        object: {
          termType: object.termType,
          value: object.value,
          ...object.termType === "Literal" ? {
            datatype: object.datatype.value,
            ...object.language ? { language: object.language } : {},
            ...object.direction ? { direction: object.direction } : {}
          } : {}
        }
      });
    }
    return {
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      records,
      sourceDocumentIri: this.#sourceDocumentIri,
      stateIri,
      title: `${sourceDocument.title || "Document"} completion values`
    };
  }
  #contentTypeForFilename(filename) {
    if (!filename) return void 0;
    if (/\.html?$/i.test(filename)) return "text/html";
    if (/\.ttl$/i.test(filename)) return "text/turtle";
    if (/\.trig$/i.test(filename)) return "application/trig";
    return void 0;
  }
  #setDataStatus(message, state, code) {
    if (!this.#dataStatus) return;
    this.#dataStatus.textContent = message;
    this.#dataStatus.dataset.state = state;
    if (code) this.#dataStatus.dataset.code = code;
    else delete this.#dataStatus.dataset.code;
    this.#dataStatus.hidden = false;
  }
  #resetCompletion() {
    this.#validationVersion += 1;
    for (const binding of this.#bindings) {
      binding.value = "";
      binding.touched = false;
      binding.error = "";
      const control = this.#bindingControls.get(binding.key);
      if (control) {
        control.value = binding.defaultValue ?? "";
        control.setCustomValidity("");
        control.setAttribute("aria-invalid", "false");
        this.#updateError(control, "");
      }
      for (const placeholder of binding.placeholders) {
        placeholder.textContent = this.#originalText.get(placeholder) ?? "";
        placeholder.dataset.valueState = binding.options.length === 0 && binding.defaultValue !== void 0 ? "default" : "empty";
      }
    }
    this.#projectRenderingAlternatives();
    this.#updateActiveBindings();
    this.#renderRuntimeData();
    this.#updateProgress();
  }
  #applyDefaults() {
    let changed = false;
    for (const binding of this.#bindings) {
      const control = this.#bindingControls.get(binding.key);
      if (!control || !this.#isBindingActive(binding) || binding.defaultValue === void 0 || binding.touched) continue;
      control.value = binding.defaultValue;
      binding.touched = true;
      binding.value = control.value;
      changed = true;
    }
    if (changed) this.#validationPromise = this.#validateAndProject();
  }
  #renderRuntimeData() {
    if (!this.#runtimeData) return;
    this.#runtimeData.replaceChildren();
    const graph = this.getAttribute("runtime-graph") || "#runtime-graph";
    const activeSet = this.#activeBindings();
    const activeBindings = this.#bindings.filter((binding) => activeSet.has(binding));
    for (const binding of activeBindings) {
      if (!binding.value.trim() || binding.error) continue;
      const object = this.#bindingTerm(binding);
      if (!object) continue;
      if (object.termType === "NamedNode") {
        const carrier2 = this.#sourceDocument().createElement("a");
        carrier2.href = object.value;
        carrier2.setAttribute("rdf-subject", binding.subject);
        carrier2.setAttribute("rdf-predicate", binding.path);
        carrier2.setAttribute("rdf-graph", graph);
        this.#runtimeData.append(carrier2);
        continue;
      }
      const carrier = this.#sourceDocument().createElement("data");
      carrier.value = object.value;
      carrier.setAttribute("rdf-subject", binding.subject);
      carrier.setAttribute("rdf-predicate", binding.path);
      carrier.setAttribute("rdf-datatype", object.datatype.value);
      carrier.setAttribute("rdf-graph", graph);
      this.#runtimeData.append(carrier);
    }
    const sourceDocument = this.#sourceDocument();
    const detail = {
      complete: activeBindings.filter((binding) => binding.value.trim() && !binding.error).length,
      total: activeBindings.length
    };
    const EventConstructor = sourceDocument.defaultView?.CustomEvent ?? CustomEvent;
    sourceDocument.dispatchEvent(new EventConstructor(HTML_RDF_DATASET_CHANGE_EVENT, { detail }));
    sourceDocument.dispatchEvent(new EventConstructor("ia2-rdf-value-editor-change", { detail }));
  }
  #updateProgress() {
    const activeBindings = this.#bindings.filter((binding) => this.#isBindingActive(binding));
    const complete = activeBindings.filter((binding) => binding.value.trim() && !binding.error).length;
    const required = activeBindings.filter((binding) => binding.required).length;
    const requiredComplete = activeBindings.filter(
      (binding) => binding.required && binding.value.trim() && !binding.error
    ).length;
    if (this.#progress) {
      this.#progress.textContent = required > 0 ? `${requiredComplete} of ${required} required values complete` : `${complete} values complete`;
    }
    const count = this.#launcher?.querySelector(".count");
    if (count) count.textContent = String(Math.max(required - requiredComplete, 0));
  }
};

// src/index.ts
if (!customElements.get("ia2-rdf-value-editor")) {
  customElements.define("ia2-rdf-value-editor", Ia2RdfValueEditor);
}
export {
  Ia2RdfValueEditor
};
//# sourceMappingURL=rdf-value-editor.js.map
