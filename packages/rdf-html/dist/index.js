var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "../../node_modules/base64-js/index.js"(exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1) validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
  }
});

// ../../node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "../../node_modules/ieee754/index.js"(exports) {
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// ../../node_modules/buffer/index.js
var require_buffer = __commonJS({
  "../../node_modules/buffer/index.js"(exports) {
    "use strict";
    var base64 = require_base64_js();
    var ieee754 = require_ieee754();
    var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer3;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer3.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this)) return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer3.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this)) return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      const buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function Buffer3(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    Buffer3.poolSize = 8192;
    function from(value, encodingOrOffset, length) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      const valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer3.from(valueOf, encodingOrOffset, length);
      }
      const b = fromObject(value);
      if (b) return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer3.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer3, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer3.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer3.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer3.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer3.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length = byteLength(string, encoding) | 0;
      let buf = createBuffer(length);
      const actual = buf.write(string, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      const length = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf = createBuffer(length);
      for (let i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer3.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer3.alloc(+length);
    }
    Buffer3.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer3.prototype;
    };
    Buffer3.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array)) a = Buffer3.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array)) b = Buffer3.from(b, b.offset, b.byteLength);
      if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b) return 0;
      let x = a.length;
      let y = b.length;
      for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    Buffer3.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer3.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer3.alloc(0);
      }
      let i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      const buffer = Buffer3.allocUnsafe(length);
      let pos = 0;
      for (i = 0; i < list.length; ++i) {
        let buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer.length) {
            if (!Buffer3.isBuffer(buf)) buf = Buffer3.from(buf);
            buf.copy(buffer, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer,
              buf,
              pos
            );
          }
        } else if (!Buffer3.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer, pos);
        }
        pos += buf.length;
      }
      return buffer;
    };
    function byteLength(string, encoding) {
      if (Buffer3.isBuffer(string)) {
        return string.length;
      }
      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
        );
      }
      const len = string.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0) return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      let loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding) encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.prototype._isBuffer = true;
    function swap(b, n, m) {
      const i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer3.prototype.swap16 = function swap16() {
      const len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer3.prototype.swap32 = function swap32() {
      const len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer3.prototype.swap64 = function swap64() {
      const len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer3.prototype.toString = function toString() {
      const length = this.length;
      if (length === 0) return "";
      if (arguments.length === 0) return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
    Buffer3.prototype.equals = function equals(b) {
      if (!Buffer3.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
      if (this === b) return true;
      return Buffer3.compare(this, b) === 0;
    };
    Buffer3.prototype.inspect = function inspect() {
      let str = "";
      const max = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max) str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
    }
    Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer3.from(target, target.offset, target.byteLength);
      }
      if (!Buffer3.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
        );
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target) return 0;
      let x = thisEnd - thisStart;
      let y = end - start;
      const len = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start, end);
      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      if (buffer.length === 0) return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
      }
      if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
      }
      if (typeof val === "string") {
        val = Buffer3.from(val, encoding);
      }
      if (Buffer3.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      let i;
      if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found) return i;
        }
      }
      return -1;
    }
    Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      const strLen = string.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      let i;
      for (i = 0; i < length; ++i) {
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    Buffer3.prototype.write = function write(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0) encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      const remaining = this.length - offset;
      if (length === void 0 || length > remaining) length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding) encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer3.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i = start;
      while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      const len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      const len = buf.length;
      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;
      let out = "";
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      const bytes = buf.slice(start, end);
      let res = "";
      for (let i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer3.prototype.slice = function slice(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start) end = start;
      const newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer3.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
      if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      let val = this[offset + --byteLength2];
      let mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });
    Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let i = byteLength2;
      let mul = 1;
      let val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128)) return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });
    Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer3.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
    }
    Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let mul = 1;
      let i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset + 7] = lo;
      lo = lo >> 8;
      buf[offset + 6] = lo;
      lo = lo >> 8;
      buf[offset + 5] = lo;
      lo = lo >> 8;
      buf[offset + 4] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }
    Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = 0;
      let mul = 1;
      let sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      let sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
      if (value < 0) value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0) value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
      if (offset < 0) throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer3.isBuffer(target)) throw new TypeError("argument should be a Buffer");
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;
      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
      if (end < 0) throw new RangeError("sourceEnd out of bounds");
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      const len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        );
      }
      return len;
    };
    Buffer3.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val) val = 0;
      let i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
        const len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    var errors = {};
    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(name) {
        if (name) {
          return `${name} is outside of buffer bounds`;
        }
        return "Attempt to access memory outside buffer bounds";
      },
      RangeError
    );
    E(
      "ERR_INVALID_ARG_TYPE",
      function(name, actual) {
        return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      function(str, range, input) {
        let msg = `The value of "${str}" is out of range.`;
        let received = input;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += ` It must be ${range}. Received ${received}`;
        return msg;
      },
      RangeError
    );
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function checkBounds(buf, offset, byteLength2) {
      validateNumber(offset, "offset");
      if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
        boundsError(offset, buf.length - (byteLength2 + 1));
      }
    }
    function checkIntBI(value, min, max, buf, offset, byteLength2) {
      if (value > max || value < min) {
        const n = typeof min === "bigint" ? "n" : "";
        let range;
        if (byteLength2 > 3) {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
          } else {
            range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
          }
        } else {
          range = `>= ${min}${n} and <= ${max}${n}`;
        }
        throw new errors.ERR_OUT_OF_RANGE("value", range, value);
      }
      checkBounds(buf, offset, byteLength2);
    }
    function validateNumber(value, name) {
      if (typeof value !== "number") {
        throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
      }
    }
    function boundsError(value, length, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
      }
      if (length < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors.ERR_OUT_OF_RANGE(
        type || "offset",
        `>= ${type ? 1 : 0} and <= ${length}`,
        value
      );
    }
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2) return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes(string, units) {
      units = units || Infinity;
      let codePoint;
      const length = string.length;
      let leadSurrogate = null;
      const bytes = [];
      for (let i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0) break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0) break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0) break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo;
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      let i;
      for (i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    var hexSliceLookupTable = (function() {
      const alphabet = "0123456789abcdef";
      const table = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    })();
    function defineBigIntMethod(fn) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  }
});

// src/generated/elements.ts
var RDFHTML = "https://ia2.dev/spec/rdf-html#";
var HTML_SNAPSHOT_DATE = "2026-07-18";
var HTML_VOCABULARY_IRI = "https://ia2.dev/spec/rdf-html/vocabulary/rdf-html-2026-07-18.ttl";
var HTML_SNAPSHOT_SOURCES = {
  "elementIndex": {
    "url": "https://html.spec.whatwg.org/multipage/indices.html#elements-3",
    "sha256": "0f041a55046de178c6b644a0024d5ac0c0e925d7eaf30a946baa13ff6e61fe1e"
  },
  "attributeIndex": {
    "url": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3",
    "sha256": "0f041a55046de178c6b644a0024d5ac0c0e925d7eaf30a946baa13ff6e61fe1e"
  },
  "contentCategoryIndex": {
    "url": "https://html.spec.whatwg.org/multipage/indices.html#element-content-categories",
    "sha256": "0f041a55046de178c6b644a0024d5ac0c0e925d7eaf30a946baa13ff6e61fe1e"
  },
  "syntaxKinds": {
    "url": "https://html.spec.whatwg.org/multipage/syntax.html#elements-2",
    "sha256": "b71c19de942b28a9a86585fe97fde22e492a5666295a0470149fbd98f187323d"
  },
  "webIdl": {
    "url": "https://html.spec.whatwg.org/",
    "sha256": "5c5869be6ff3dbed33594f78be38dfcdc500b059cc4ff61b51f9dfc561494068"
  }
};
var HTML_SNAPSHOT_SOURCE = HTML_SNAPSHOT_SOURCES.elementIndex.url;
var HTML_SYNTAX_KINDS = [
  { "name": "void", "label": "Void elements", "source": "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", "elements": ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"] },
  { "name": "template", "label": "The template element", "source": "https://html.spec.whatwg.org/multipage/syntax.html#the-template-element-2", "elements": ["template"] },
  { "name": "raw-text", "label": "Raw text elements", "source": "https://html.spec.whatwg.org/multipage/syntax.html#raw-text-elements", "elements": ["script", "style"] },
  { "name": "escapable-raw-text", "label": "Escapable raw text elements", "source": "https://html.spec.whatwg.org/multipage/syntax.html#escapable-raw-text-elements", "elements": ["textarea", "title"] },
  { "name": "foreign", "label": "Foreign elements", "source": "https://html.spec.whatwg.org/multipage/syntax.html#foreign-elements", "namespaces": [{ "label": "MathML", "source": "https://infra.spec.whatwg.org/#mathml-namespace" }, { "label": "SVG", "source": "https://infra.spec.whatwg.org/#svg-namespace" }] },
  { "name": "normal", "label": "Normal elements", "source": "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements" }
];
var HTML_CONTENT_CATEGORIES = [
  { classIri: RDFHTML + "MetadataContent", label: "Metadata content", name: "metadata", source: "https://html.spec.whatwg.org/multipage/dom.html#metadata-content-2" },
  { classIri: RDFHTML + "FlowContent", label: "Flow content", name: "flow", source: "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2" },
  { classIri: RDFHTML + "SectioningContent", label: "Sectioning content", name: "sectioning", source: "https://html.spec.whatwg.org/multipage/dom.html#sectioning-content-2" },
  { classIri: RDFHTML + "HeadingContent", label: "Heading content", name: "heading", source: "https://html.spec.whatwg.org/multipage/dom.html#heading-content-2" },
  { classIri: RDFHTML + "PhrasingContent", label: "Phrasing content", name: "phrasing", source: "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2" },
  { classIri: RDFHTML + "EmbeddedContent", label: "Embedded content", name: "embedded", source: "https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category" },
  { classIri: RDFHTML + "InteractiveContent", label: "Interactive content", name: "interactive", source: "https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2" },
  { classIri: RDFHTML + "FormAssociatedElement", label: "Form-associated elements", name: "form-associated", source: "https://html.spec.whatwg.org/multipage/forms.html#form-associated-element" },
  { classIri: RDFHTML + "ListedElement", label: "Listed elements", name: "listed", source: "https://html.spec.whatwg.org/multipage/forms.html#category-listed" },
  { classIri: RDFHTML + "SubmittableElement", label: "Submittable elements", name: "submittable", source: "https://html.spec.whatwg.org/multipage/forms.html#category-submit" },
  { classIri: RDFHTML + "ResettableElement", label: "Resettable elements", name: "resettable", source: "https://html.spec.whatwg.org/multipage/forms.html#category-reset" },
  { classIri: RDFHTML + "AutocapitalizeAndAutocorrectInheritingElement", label: "Autocapitalize-and-autocorrect inheriting elements", name: "autocapitalize-and-autocorrect-inheriting", source: "https://html.spec.whatwg.org/multipage/forms.html#category-autocapitalize" },
  { classIri: RDFHTML + "LabelableElement", label: "Labelable elements", name: "labelable", source: "https://html.spec.whatwg.org/multipage/forms.html#category-label" },
  { classIri: RDFHTML + "PalpableContent", label: "Palpable content", name: "palpable", source: "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2" },
  { classIri: RDFHTML + "ScriptSupportingElement", label: "Script-supporting elements", name: "script-supporting", source: "https://html.spec.whatwg.org/multipage/dom.html#script-supporting-elements-2" }
];
var HTML_SPECIAL_CATEGORY_PARTICIPANTS = [
  {
    "id": "autonomous-custom-elements",
    "label": "autonomous custom elements",
    "source": "https://html.spec.whatwg.org/multipage/custom-elements.html#autonomous-custom-element",
    "categories": [
      {
        "name": "flow",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2",
        "elementIndexNotation": "flow"
      },
      {
        "name": "phrasing",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2",
        "elementIndexNotation": "phrasing"
      },
      {
        "name": "palpable",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2",
        "elementIndexNotation": "palpable"
      }
    ]
  },
  {
    "id": "form-associated-custom-elements",
    "label": "form-associated custom elements",
    "source": "https://html.spec.whatwg.org/multipage/custom-elements.html#form-associated-custom-element",
    "categories": [
      {
        "name": "form-associated",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/forms.html#form-associated-element"
      },
      {
        "name": "listed",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/forms.html#category-listed"
      },
      {
        "name": "submittable",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/forms.html#category-submit"
      },
      {
        "name": "resettable",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/forms.html#category-reset"
      },
      {
        "name": "labelable",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/forms.html#category-label"
      }
    ]
  },
  {
    "id": "mathml-math",
    "label": "MathML math",
    "source": "https://w3c.github.io/mathml-core/#the-top-level-math-element",
    "categories": [
      {
        "name": "flow",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2",
        "elementIndexNotation": "flow"
      },
      {
        "name": "phrasing",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2",
        "elementIndexNotation": "phrasing"
      },
      {
        "name": "embedded",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category",
        "elementIndexNotation": "embedded"
      },
      {
        "name": "palpable",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2",
        "elementIndexNotation": "palpable"
      }
    ]
  },
  {
    "id": "svg-svg",
    "label": "SVG svg",
    "source": "https://w3c.github.io/svgwg/svg2-draft/struct.html#elementdef-svg",
    "categories": [
      {
        "name": "flow",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2",
        "elementIndexNotation": "flow"
      },
      {
        "name": "phrasing",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2",
        "elementIndexNotation": "phrasing"
      },
      {
        "name": "embedded",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category",
        "elementIndexNotation": "embedded"
      },
      {
        "name": "palpable",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2",
        "elementIndexNotation": "palpable"
      }
    ]
  },
  {
    "id": "text",
    "label": "Text",
    "source": "https://html.spec.whatwg.org/multipage/dom.html#text-content",
    "categories": [
      {
        "name": "flow",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2"
      },
      {
        "name": "phrasing",
        "conditional": false,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2"
      },
      {
        "name": "palpable",
        "conditional": true,
        "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2",
        "conditionId": "palpable-text",
        "conditionText": "that is not inter-element whitespace",
        "indexNotation": "Text that is not inter-element whitespace"
      }
    ]
  }
];
var HTML_CLASSIFICATION_CROSS_CHECK_EXCEPTIONS = [
  {
    "scope": "category-index-only",
    "category": "autocapitalize-and-autocorrect-inheriting",
    "reason": "The element table omits this auxiliary forms category from every Categories cell."
  },
  {
    "scope": "category-index-only-membership",
    "element": "hgroup",
    "category": "heading",
    "reason": "The element table lists only flow and palpable for hgroup."
  },
  {
    "scope": "category-index-only-membership",
    "element": "label",
    "category": "form-associated",
    "reason": "The compact element table omits this association-only membership."
  },
  {
    "scope": "category-index-only-membership",
    "element": "selectedcontent",
    "category": "phrasing",
    "reason": "The element table currently lists no categories for selectedcontent."
  },
  {
    "scope": "element-index-only-conditional",
    "element": "object",
    "category": "interactive",
    "reason": "The element table says interactive* while the dedicated category table omits object; preserve the asterisk without asserting a universal subclass."
  },
  {
    "scope": "element-index-only-conditional",
    "element": "th",
    "category": "interactive",
    "reason": "The element table says interactive* while the dedicated category table omits th; preserve the asterisk without asserting a universal subclass."
  }
];
var HTML_ATTRIBUTE_CROSS_CHECK_EXCEPTIONS = [
  {
    "scope": "attribute-index-only",
    "element": "dialog",
    "attribute": "closedby",
    "reason": "The dedicated attribute index includes closedby while the compact element table currently omits it."
  },
  {
    "scope": "element-index-only",
    "element": "form",
    "attribute": "rel",
    "reason": "The compact element table includes rel for form while the dedicated attribute index currently omits that context."
  }
];
var HTML_ATTRIBUTE_INDEX_EXCLUSION = {
  "description": "Event handler content attributes are explicitly excluded from the WHATWG attribute index and remain generic RDF/HTML attributes.",
  "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3"
};
var HTML_ELEMENTS = [
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing*" }, { "name": "interactive", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2", "conditionId": "interactive-a", "conditionText": "if the href attribute is present", "indexNotation": "a (if the href attribute is present)", "elementIndexNotation": "interactive" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "A", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element", tagName: "a" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Abbr", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-abbr-element", tagName: "abbr" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Address", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-address-element", tagName: "address" },
  { categories: [{ "name": "flow", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "conditionId": "flow-area", "conditionText": "if it is a descendant of a map element", "indexNotation": "area (if it is a descendant of a map element)", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "conditionId": "phrasing-area", "conditionText": "if it is a descendant of a map element", "indexNotation": "area (if it is a descendant of a map element)", "elementIndexNotation": "phrasing" }], classIri: RDFHTML + "Area", kind: "void", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", source: "https://html.spec.whatwg.org/multipage/image-maps.html#the-area-element", tagName: "area" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "sectioning", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#sectioning-content-2", "elementIndexNotation": "sectioning" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Article", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-article-element", tagName: "article" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "sectioning", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#sectioning-content-2", "elementIndexNotation": "sectioning" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Aside", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-aside-element", tagName: "aside" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "embedded", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category", "elementIndexNotation": "embedded" }, { "name": "interactive", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2", "conditionId": "interactive-audio", "conditionText": "if the controls attribute is present", "indexNotation": "audio (if the controls attribute is present)", "elementIndexNotation": "interactive" }, { "name": "palpable", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "conditionId": "palpable-audio", "conditionText": "if the controls attribute is present", "indexNotation": "audio (if the controls attribute is present)", "elementIndexNotation": "palpable*" }], classIri: RDFHTML + "Audio", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/media.html#the-audio-element", tagName: "audio" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "B", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-b-element", tagName: "b" },
  { categories: [{ "name": "metadata", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#metadata-content-2", "elementIndexNotation": "metadata" }], classIri: RDFHTML + "Base", kind: "void", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", source: "https://html.spec.whatwg.org/multipage/semantics.html#the-base-element", tagName: "base" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Bdi", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-bdi-element", tagName: "bdi" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Bdo", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-bdo-element", tagName: "bdo" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Blockquote", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-blockquote-element", tagName: "blockquote" },
  { categories: [], classIri: RDFHTML + "Body", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-body-element", tagName: "body" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }], classIri: RDFHTML + "Br", kind: "void", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-br-element", tagName: "br" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "interactive", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2", "elementIndexNotation": "interactive" }, { "name": "form-associated", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#form-associated-element", "elementIndexNotation": "form-associated" }, { "name": "listed", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-listed", "elementIndexNotation": "listed" }, { "name": "submittable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-submit", "elementIndexNotation": "submittable" }, { "name": "autocapitalize-and-autocorrect-inheriting", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-autocapitalize" }, { "name": "labelable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-label", "elementIndexNotation": "labelable" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Button", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element", tagName: "button" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "embedded", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category", "elementIndexNotation": "embedded" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Canvas", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element", tagName: "canvas" },
  { categories: [], classIri: RDFHTML + "Caption", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/tables.html#the-caption-element", tagName: "caption" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Cite", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-cite-element", tagName: "cite" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Code", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-code-element", tagName: "code" },
  { categories: [], classIri: RDFHTML + "Col", kind: "void", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", source: "https://html.spec.whatwg.org/multipage/tables.html#the-col-element", tagName: "col" },
  { categories: [], classIri: RDFHTML + "Colgroup", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/tables.html#the-colgroup-element", tagName: "colgroup" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Data", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-data-element", tagName: "data" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }], classIri: RDFHTML + "Datalist", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/form-elements.html#the-datalist-element", tagName: "datalist" },
  { categories: [], classIri: RDFHTML + "Dd", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-dd-element", tagName: "dd" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing*" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Del", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/edits.html#the-del-element", tagName: "del" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "interactive", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2", "elementIndexNotation": "interactive" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Details", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element", tagName: "details" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Dfn", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-dfn-element", tagName: "dfn" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }], classIri: RDFHTML + "Dialog", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element", tagName: "dialog" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Div", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-div-element", tagName: "div" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "conditionId": "palpable-dl", "conditionText": "if the element's children include at least one name-value group", "indexNotation": "dl (if the element's children include at least one name-value group)", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Dl", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element", tagName: "dl" },
  { categories: [], classIri: RDFHTML + "Dt", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-dt-element", tagName: "dt" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Em", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-em-element", tagName: "em" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "embedded", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category", "elementIndexNotation": "embedded" }, { "name": "interactive", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2", "elementIndexNotation": "interactive" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Embed", kind: "void", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", source: "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-embed-element", tagName: "embed" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "form-associated", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#form-associated-element", "elementIndexNotation": "form-associated" }, { "name": "listed", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-listed", "elementIndexNotation": "listed" }, { "name": "autocapitalize-and-autocorrect-inheriting", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-autocapitalize" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Fieldset", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element", tagName: "fieldset" },
  { categories: [], classIri: RDFHTML + "Figcaption", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-figcaption-element", tagName: "figcaption" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Figure", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-figure-element", tagName: "figure" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Footer", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-footer-element", tagName: "footer" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Form", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/forms.html#the-form-element", tagName: "form" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "heading", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#heading-content-2", "elementIndexNotation": "heading" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "H1", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements", tagName: "h1" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "heading", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#heading-content-2", "elementIndexNotation": "heading" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "H2", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements", tagName: "h2" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "heading", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#heading-content-2", "elementIndexNotation": "heading" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "H3", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements", tagName: "h3" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "heading", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#heading-content-2", "elementIndexNotation": "heading" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "H4", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements", tagName: "h4" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "heading", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#heading-content-2", "elementIndexNotation": "heading" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "H5", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements", tagName: "h5" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "heading", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#heading-content-2", "elementIndexNotation": "heading" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "H6", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-h1,-h2,-h3,-h4,-h5,-and-h6-elements", tagName: "h6" },
  { categories: [], classIri: RDFHTML + "Head", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/semantics.html#the-head-element", tagName: "head" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Header", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-header-element", tagName: "header" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "heading", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#heading-content-2" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Hgroup", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-hgroup-element", tagName: "hgroup" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }], classIri: RDFHTML + "Hr", kind: "void", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-hr-element", tagName: "hr" },
  { categories: [], classIri: RDFHTML + "Html", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/semantics.html#the-html-element", tagName: "html" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "I", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-i-element", tagName: "i" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "embedded", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category", "elementIndexNotation": "embedded" }, { "name": "interactive", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2", "elementIndexNotation": "interactive" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Iframe", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element", tagName: "iframe" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "embedded", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category", "elementIndexNotation": "embedded" }, { "name": "interactive", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2", "conditionId": "interactive-img", "conditionText": "if the usemap or controls attribute is present", "indexNotation": "img (if the usemap or controls attribute is present)", "elementIndexNotation": "interactive*" }, { "name": "form-associated", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#form-associated-element", "elementIndexNotation": "form-associated" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Img", kind: "void", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", source: "https://html.spec.whatwg.org/multipage/embedded-content.html#the-img-element", tagName: "img" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "interactive", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2", "conditionId": "interactive-input", "conditionText": "if the type attribute is not in the Hidden state", "indexNotation": "input (if the type attribute is not in the Hidden state)", "elementIndexNotation": "interactive*" }, { "name": "form-associated", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#form-associated-element", "elementIndexNotation": "form-associated" }, { "name": "listed", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-listed", "elementIndexNotation": "listed" }, { "name": "submittable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-submit", "elementIndexNotation": "submittable" }, { "name": "resettable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-reset", "elementIndexNotation": "resettable" }, { "name": "autocapitalize-and-autocorrect-inheriting", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-autocapitalize" }, { "name": "labelable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-label", "elementIndexNotation": "labelable" }, { "name": "palpable", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "conditionId": "palpable-input", "conditionText": "if the type attribute is not in the Hidden state", "indexNotation": "input (if the type attribute is not in the Hidden state)", "elementIndexNotation": "palpable*" }], classIri: RDFHTML + "Input", kind: "void", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", source: "https://html.spec.whatwg.org/multipage/input.html#the-input-element", tagName: "input" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing*" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Ins", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/edits.html#the-ins-element", tagName: "ins" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Kbd", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-kbd-element", tagName: "kbd" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "interactive", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2", "elementIndexNotation": "interactive" }, { "name": "form-associated", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#form-associated-element" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Label", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/forms.html#the-label-element", tagName: "label" },
  { categories: [], classIri: RDFHTML + "Legend", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/form-elements.html#the-legend-element", tagName: "legend" },
  { categories: [], classIri: RDFHTML + "Li", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-li-element", tagName: "li" },
  { categories: [{ "name": "metadata", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#metadata-content-2", "elementIndexNotation": "metadata" }, { "name": "flow", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "conditionId": "flow-link", "conditionText": "if it is allowed in the body", "indexNotation": "link (if it is allowed in the body)", "elementIndexNotation": "flow*" }, { "name": "phrasing", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "conditionId": "phrasing-link", "conditionText": "if it is allowed in the body", "indexNotation": "link (if it is allowed in the body)", "elementIndexNotation": "phrasing*" }], classIri: RDFHTML + "Link", kind: "void", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", source: "https://html.spec.whatwg.org/multipage/semantics.html#the-link-element", tagName: "link" },
  { categories: [{ "name": "flow", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "conditionId": "flow-main", "conditionText": "if it is a hierarchically correct main element", "indexNotation": "main (if it is a hierarchically correct main element)", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Main", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-main-element", tagName: "main" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing*" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Map", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/image-maps.html#the-map-element", tagName: "map" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Mark", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-mark-element", tagName: "mark" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "conditionId": "palpable-menu", "conditionText": "if the element's children include at least one li element", "indexNotation": "menu (if the element's children include at least one li element)", "elementIndexNotation": "palpable*" }], classIri: RDFHTML + "Menu", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-menu-element", tagName: "menu" },
  { categories: [{ "name": "metadata", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#metadata-content-2", "elementIndexNotation": "metadata" }, { "name": "flow", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "conditionId": "flow-meta", "conditionText": "if the itemprop attribute is present", "indexNotation": "meta (if the itemprop attribute is present)", "elementIndexNotation": "flow*" }, { "name": "phrasing", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "conditionId": "phrasing-meta", "conditionText": "if the itemprop attribute is present", "indexNotation": "meta (if the itemprop attribute is present)", "elementIndexNotation": "phrasing*" }], classIri: RDFHTML + "Meta", kind: "void", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", source: "https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element", tagName: "meta" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "labelable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-label", "elementIndexNotation": "labelable" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Meter", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/form-elements.html#the-meter-element", tagName: "meter" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "sectioning", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#sectioning-content-2", "elementIndexNotation": "sectioning" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Nav", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-nav-element", tagName: "nav" },
  { categories: [{ "name": "metadata", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#metadata-content-2", "elementIndexNotation": "metadata" }, { "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }], classIri: RDFHTML + "Noscript", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/scripting.html#the-noscript-element", tagName: "noscript" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "embedded", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category", "elementIndexNotation": "embedded" }, { "name": "form-associated", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#form-associated-element", "elementIndexNotation": "form-associated" }, { "name": "listed", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-listed", "elementIndexNotation": "listed" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }, { "name": "interactive", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-object-element", "conditionId": "interactive-object", "indexNotation": "interactive*", "elementIndexNotation": "interactive*" }], classIri: RDFHTML + "Object", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-object-element", tagName: "object" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "conditionId": "palpable-ol", "conditionText": "if the element's children include at least one li element", "indexNotation": "ol (if the element's children include at least one li element)", "elementIndexNotation": "palpable*" }], classIri: RDFHTML + "Ol", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-ol-element", tagName: "ol" },
  { categories: [], classIri: RDFHTML + "Optgroup", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/form-elements.html#the-optgroup-element", tagName: "optgroup" },
  { categories: [], classIri: RDFHTML + "Option", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/form-elements.html#the-option-element", tagName: "option" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "form-associated", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#form-associated-element", "elementIndexNotation": "form-associated" }, { "name": "listed", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-listed", "elementIndexNotation": "listed" }, { "name": "resettable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-reset", "elementIndexNotation": "resettable" }, { "name": "autocapitalize-and-autocorrect-inheriting", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-autocapitalize" }, { "name": "labelable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-label", "elementIndexNotation": "labelable" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Output", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/form-elements.html#the-output-element", tagName: "output" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "P", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-p-element", tagName: "p" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "embedded", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category", "elementIndexNotation": "embedded" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Picture", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element", tagName: "picture" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Pre", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element", tagName: "pre" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "labelable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-label", "elementIndexNotation": "labelable" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Progress", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element", tagName: "progress" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Q", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-q-element", tagName: "q" },
  { categories: [], classIri: RDFHTML + "Rp", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-rp-element", tagName: "rp" },
  { categories: [], classIri: RDFHTML + "Rt", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-rt-element", tagName: "rt" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Ruby", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-ruby-element", tagName: "ruby" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "S", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-s-element", tagName: "s" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Samp", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-samp-element", tagName: "samp" },
  { categories: [{ "name": "metadata", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#metadata-content-2", "elementIndexNotation": "metadata" }, { "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "script-supporting", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#script-supporting-elements-2", "elementIndexNotation": "script-supporting" }], classIri: RDFHTML + "Script", kind: "raw-text", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#raw-text-elements", source: "https://html.spec.whatwg.org/multipage/scripting.html#the-script-element", tagName: "script" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Search", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-search-element", tagName: "search" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "sectioning", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#sectioning-content-2", "elementIndexNotation": "sectioning" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Section", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/sections.html#the-section-element", tagName: "section" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "interactive", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2", "elementIndexNotation": "interactive" }, { "name": "form-associated", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#form-associated-element", "elementIndexNotation": "form-associated" }, { "name": "listed", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-listed", "elementIndexNotation": "listed" }, { "name": "submittable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-submit", "elementIndexNotation": "submittable" }, { "name": "resettable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-reset", "elementIndexNotation": "resettable" }, { "name": "autocapitalize-and-autocorrect-inheriting", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-autocapitalize" }, { "name": "labelable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-label", "elementIndexNotation": "labelable" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Select", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/form-elements.html#the-select-element", tagName: "select" },
  { categories: [{ "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2" }], classIri: RDFHTML + "Selectedcontent", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/form-elements.html#the-selectedcontent-element", tagName: "selectedcontent" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }], classIri: RDFHTML + "Slot", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/scripting.html#the-slot-element", tagName: "slot" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Small", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-small-element", tagName: "small" },
  { categories: [], classIri: RDFHTML + "Source", kind: "void", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", source: "https://html.spec.whatwg.org/multipage/embedded-content.html#the-source-element", tagName: "source" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Span", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-span-element", tagName: "span" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Strong", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-strong-element", tagName: "strong" },
  { categories: [{ "name": "metadata", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#metadata-content-2", "elementIndexNotation": "metadata" }], classIri: RDFHTML + "Style", kind: "raw-text", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#raw-text-elements", source: "https://html.spec.whatwg.org/multipage/semantics.html#the-style-element", tagName: "style" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Sub", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-sub-and-sup-elements", tagName: "sub" },
  { categories: [], classIri: RDFHTML + "Summary", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/interactive-elements.html#the-summary-element", tagName: "summary" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Sup", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-sub-and-sup-elements", tagName: "sup" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Table", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/tables.html#the-table-element", tagName: "table" },
  { categories: [], classIri: RDFHTML + "Tbody", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/tables.html#the-tbody-element", tagName: "tbody" },
  { categories: [], classIri: RDFHTML + "Td", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/tables.html#the-td-element", tagName: "td" },
  { categories: [{ "name": "metadata", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#metadata-content-2", "elementIndexNotation": "metadata" }, { "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "script-supporting", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#script-supporting-elements-2", "elementIndexNotation": "script-supporting" }], classIri: RDFHTML + "Template", kind: "template", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#the-template-element-2", source: "https://html.spec.whatwg.org/multipage/scripting.html#the-template-element", tagName: "template" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "interactive", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2", "elementIndexNotation": "interactive" }, { "name": "form-associated", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#form-associated-element", "elementIndexNotation": "form-associated" }, { "name": "listed", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-listed", "elementIndexNotation": "listed" }, { "name": "submittable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-submit", "elementIndexNotation": "submittable" }, { "name": "resettable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-reset", "elementIndexNotation": "resettable" }, { "name": "autocapitalize-and-autocorrect-inheriting", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-autocapitalize" }, { "name": "labelable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/forms.html#category-label", "elementIndexNotation": "labelable" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Textarea", kind: "escapable-raw-text", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#escapable-raw-text-elements", source: "https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element", tagName: "textarea" },
  { categories: [], classIri: RDFHTML + "Tfoot", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/tables.html#the-tfoot-element", tagName: "tfoot" },
  { categories: [{ "name": "interactive", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/tables.html#the-th-element", "conditionId": "interactive-th", "indexNotation": "interactive*", "elementIndexNotation": "interactive*" }], classIri: RDFHTML + "Th", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/tables.html#the-th-element", tagName: "th" },
  { categories: [], classIri: RDFHTML + "Thead", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/tables.html#the-thead-element", tagName: "thead" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Time", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-time-element", tagName: "time" },
  { categories: [{ "name": "metadata", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#metadata-content-2", "elementIndexNotation": "metadata" }], classIri: RDFHTML + "Title", kind: "escapable-raw-text", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#escapable-raw-text-elements", source: "https://html.spec.whatwg.org/multipage/semantics.html#the-title-element", tagName: "title" },
  { categories: [], classIri: RDFHTML + "Tr", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/tables.html#the-tr-element", tagName: "tr" },
  { categories: [], classIri: RDFHTML + "Track", kind: "void", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", source: "https://html.spec.whatwg.org/multipage/media.html#the-track-element", tagName: "track" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "U", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-u-element", tagName: "u" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "palpable", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "conditionId": "palpable-ul", "conditionText": "if the element's children include at least one li element", "indexNotation": "ul (if the element's children include at least one li element)", "elementIndexNotation": "palpable*" }], classIri: RDFHTML + "Ul", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/grouping-content.html#the-ul-element", tagName: "ul" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Var", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-var-element", tagName: "var" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }, { "name": "embedded", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#embedded-content-category", "elementIndexNotation": "embedded" }, { "name": "interactive", "conditional": true, "source": "https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2", "conditionId": "interactive-video", "conditionText": "if the controls attribute is present", "indexNotation": "video (if the controls attribute is present)", "elementIndexNotation": "interactive" }, { "name": "palpable", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#palpable-content-2", "elementIndexNotation": "palpable" }], classIri: RDFHTML + "Video", kind: "normal", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#normal-elements", source: "https://html.spec.whatwg.org/multipage/media.html#the-video-element", tagName: "video" },
  { categories: [{ "name": "flow", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#flow-content-2", "elementIndexNotation": "flow" }, { "name": "phrasing", "conditional": false, "source": "https://html.spec.whatwg.org/multipage/dom.html#phrasing-content-2", "elementIndexNotation": "phrasing" }], classIri: RDFHTML + "Wbr", kind: "void", kindSource: "https://html.spec.whatwg.org/multipage/syntax.html#void-elements", source: "https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-wbr-element", tagName: "wbr" }
];
var HTML_ATTRIBUTES = [
  { contexts: [{ "id": "abbr-th", "global": false, "elements": ["th"], "specialParticipants": [], "description": "Alternative label to use for the header cell when referencing the cell in other contexts", "valueSyntaxText": "Text*", "definitionSources": ["https://html.spec.whatwg.org/multipage/tables.html#attr-th-abbr"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "abbr", idlReflections: [{ "idlName": "abbr", "sources": ["https://html.spec.whatwg.org/#dom-th-abbr"] }], localName: "abbr", termName: "abbr" },
  { contexts: [{ "id": "accept-input", "global": false, "elements": ["input"], "specialParticipants": [], "description": "Hint for expected file type in file upload controls", "valueSyntaxText": "Set of comma-separated tokens* consisting of valid MIME type strings with no parameters or audio/*, video/*, or image/*", "definitionSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-accept"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#set-of-comma-separated-tokens", "https://mimesniff.spec.whatwg.org/#valid-mime-type-with-no-parameters"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "accept", idlReflections: [{ "idlName": "accept", "sources": ["https://html.spec.whatwg.org/#dom-input-accept"] }], localName: "accept", termName: "accept" },
  { contexts: [{ "id": "accept-charset-form", "global": false, "elements": ["form"], "specialParticipants": [], "description": "Character encodings to use for form submission", "valueSyntaxText": 'ASCII case-insensitive match for "UTF-8"', "definitionSources": ["https://html.spec.whatwg.org/multipage/forms.html#attr-form-accept-charset"], "valueSyntaxSources": ["https://infra.spec.whatwg.org/#ascii-case-insensitive"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "acceptCharset", idlReflections: [{ "idlName": "acceptCharset", "sources": ["https://html.spec.whatwg.org/#dom-form-acceptcharset"] }], localName: "accept-charset", termName: "acceptCharset" },
  { contexts: [{ "id": "accesskey-global", "global": true, "elements": [], "specialParticipants": [], "description": "Keyboard shortcut to activate or focus element", "valueSyntaxText": "Ordered set of unique space-separated tokens, none of which are identical to another, each consisting of one code point in length", "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#the-accesskey-attribute"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#ordered-set-of-unique-space-separated-tokens", "https://infra.spec.whatwg.org/#string-is"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "accessKey", idlReflections: [{ "idlName": "accessKey", "sources": ["https://html.spec.whatwg.org/#dom-accesskey"] }], localName: "accesskey", termName: "accessKey" },
  { contexts: [{ "id": "action-form", "global": false, "elements": ["form"], "specialParticipants": [], "description": "URL to use for form submission", "valueSyntaxText": "Valid non-empty URL potentially surrounded by spaces", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-action"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#valid-non-empty-url-potentially-surrounded-by-spaces"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "action", idlReflections: [{ "idlName": "action", "sources": ["https://html.spec.whatwg.org/#dom-fs-action"] }], localName: "action", termName: "action" },
  { contexts: [{ "id": "allow-iframe", "global": false, "elements": ["iframe"], "specialParticipants": [], "description": "Permissions policy to be applied to the iframe's contents", "valueSyntaxText": "Serialized permissions policy", "definitionSources": ["https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-allow"], "valueSyntaxSources": ["https://w3c.github.io/webappsec-feature-policy/#serialized-permissions-policy"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "allow", idlReflections: [{ "idlName": "allow", "sources": ["https://html.spec.whatwg.org/#dom-iframe-allow"] }], localName: "allow", termName: "allow" },
  { contexts: [{ "id": "allowfullscreen-iframe", "global": false, "elements": ["iframe"], "specialParticipants": [], "description": "Whether to allow the iframe's contents to use requestFullscreen()", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-allowfullscreen"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "allowFullscreen", idlReflections: [{ "idlName": "allowFullscreen", "sources": ["https://html.spec.whatwg.org/#dom-iframe-allowfullscreen"] }], localName: "allowfullscreen", termName: "allowFullscreen" },
  { contexts: [{ "id": "alpha-input", "global": false, "elements": ["input"], "specialParticipants": [], "description": "Allow the color's alpha component to be set", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-alpha"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "alpha", idlReflections: [{ "idlName": "alpha", "sources": ["https://html.spec.whatwg.org/#dom-input-alpha"] }], localName: "alpha", termName: "alpha" },
  { contexts: [{ "id": "alt-area-img-input", "global": false, "elements": ["area", "img", "input"], "specialParticipants": [], "description": "Replacement text for use when images are not available", "valueSyntaxText": "Text*", "definitionSources": ["https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-alt", "https://html.spec.whatwg.org/multipage/image-maps.html#attr-area-alt", "https://html.spec.whatwg.org/multipage/input.html#attr-input-alt"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "alt", idlReflections: [{ "idlName": "alt", "sources": ["https://html.spec.whatwg.org/#dom-area-alt", "https://html.spec.whatwg.org/#dom-img-alt", "https://html.spec.whatwg.org/#dom-input-alt"] }], localName: "alt", termName: "alt" },
  { contexts: [{ "id": "as-link", "global": false, "elements": ["link"], "specialParticipants": [], "description": 'Destination for a preload request (for rel="preload" and rel="modulepreload")', "valueSyntaxText": 'Preload destination, for rel="preload"; module preload destination, for rel="modulepreload"', "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-link-as"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/links.html#link-type-modulepreload", "https://html.spec.whatwg.org/multipage/links.html#link-type-preload", "https://html.spec.whatwg.org/multipage/links.html#module-preload-destination", "https://html.spec.whatwg.org/multipage/links.html#preload-destination", "https://html.spec.whatwg.org/multipage/semantics.html#attr-link-rel"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "as", idlReflections: [], localName: "as", termName: "as" },
  { contexts: [{ "id": "async-script", "global": false, "elements": ["script"], "specialParticipants": [], "description": "Execute script when available, without blocking while fetching", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/scripting.html#attr-script-async"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "async", idlReflections: [], localName: "async", termName: "async" },
  { contexts: [{ "id": "autocapitalize-global", "global": true, "elements": [], "specialParticipants": [], "description": "Recommended autocapitalization behavior (for supported input methods)", "valueSyntaxText": '"on"; "off"; "none"; "sentences"; "words"; "characters"', "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-autocapitalize"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-autocapitalize-characters", "https://html.spec.whatwg.org/multipage/interaction.html#attr-autocapitalize-none", "https://html.spec.whatwg.org/multipage/interaction.html#attr-autocapitalize-off", "https://html.spec.whatwg.org/multipage/interaction.html#attr-autocapitalize-on", "https://html.spec.whatwg.org/multipage/interaction.html#attr-autocapitalize-sentences", "https://html.spec.whatwg.org/multipage/interaction.html#attr-autocapitalize-words"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "autocapitalize", idlReflections: [{ "idlName": "autocapitalize", "sources": ["https://html.spec.whatwg.org/#dom-autocapitalize"] }], localName: "autocapitalize", termName: "autocapitalize" },
  { contexts: [{ "id": "autocomplete-form", "global": false, "elements": ["form"], "specialParticipants": [], "description": "Default setting for autofill feature for controls in the form", "valueSyntaxText": '"on"; "off"', "definitionSources": ["https://html.spec.whatwg.org/multipage/forms.html#attr-form-autocomplete"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "autocomplete-input-select-textarea", "global": false, "elements": ["input", "select", "textarea"], "specialParticipants": [], "description": "Hint for form autofill feature", "valueSyntaxText": "Autofill field name and related tokens*", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-autocomplete"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill-field"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "autocomplete", idlReflections: [{ "idlName": "autocomplete", "sources": ["https://html.spec.whatwg.org/#dom-fe-autocomplete"] }], localName: "autocomplete", termName: "autocomplete" },
  { contexts: [{ "id": "autocorrect-global", "global": true, "elements": [], "specialParticipants": [], "description": "Recommended autocorrection behavior (for supported input methods)", "valueSyntaxText": '"on"; "off"; the empty string', "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-autocorrect"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-autocorrect-off", "https://html.spec.whatwg.org/multipage/interaction.html#attr-autocorrect-on"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "autocorrect", idlReflections: [], localName: "autocorrect", termName: "autocorrect" },
  { contexts: [{ "id": "autofocus-global", "global": true, "elements": [], "specialParticipants": [], "description": "Automatically focus the element when the page is loaded", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-fe-autofocus"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "autofocus", idlReflections: [{ "idlName": "autofocus", "sources": ["https://html.spec.whatwg.org/#dom-fe-autofocus"] }], localName: "autofocus", termName: "autofocus" },
  { contexts: [{ "id": "autoplay-audio-video", "global": false, "elements": ["audio", "video"], "specialParticipants": [], "description": "Hint that the media resource can be started automatically when the page is loaded", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/media.html#attr-media-autoplay"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "autoplay", idlReflections: [{ "idlName": "autoplay", "sources": ["https://html.spec.whatwg.org/#dom-media-autoplay"] }], localName: "autoplay", termName: "autoplay" },
  { contexts: [{ "id": "blocking-link-script-style", "global": false, "elements": ["link", "script", "style"], "specialParticipants": [], "description": "Whether the element is potentially render-blocking", "valueSyntaxText": "Unordered set of unique space-separated tokens*", "definitionSources": ["https://html.spec.whatwg.org/multipage/scripting.html#attr-script-blocking", "https://html.spec.whatwg.org/multipage/semantics.html#attr-link-blocking", "https://html.spec.whatwg.org/multipage/semantics.html#attr-style-blocking"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#unordered-set-of-unique-space-separated-tokens"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "blocking", idlReflections: [{ "idlName": "blocking", "sources": ["https://html.spec.whatwg.org/#dom-link-blocking", "https://html.spec.whatwg.org/#dom-script-blocking", "https://html.spec.whatwg.org/#dom-style-blocking"] }], localName: "blocking", termName: "blocking" },
  { contexts: [{ "id": "charset-meta", "global": false, "elements": ["meta"], "specialParticipants": [], "description": "Character encoding declaration", "valueSyntaxText": '"utf-8"', "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-charset"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "charset", idlReflections: [], localName: "charset", termName: "charset" },
  { contexts: [{ "id": "checked-input", "global": false, "elements": ["input"], "specialParticipants": [], "description": "Whether the control is checked", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-checked"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "checked", idlReflections: [{ "idlName": "defaultChecked", "sources": ["https://html.spec.whatwg.org/#dom-input-defaultchecked"] }], localName: "checked", termName: "checked" },
  { contexts: [{ "id": "cite-blockquote-del-ins-q", "global": false, "elements": ["blockquote", "del", "ins", "q"], "specialParticipants": [], "description": "Link to the source of the quotation or more information about the edit", "valueSyntaxText": "Valid URL potentially surrounded by spaces", "definitionSources": ["https://html.spec.whatwg.org/multipage/edits.html#attr-mod-cite", "https://html.spec.whatwg.org/multipage/grouping-content.html#attr-blockquote-cite", "https://html.spec.whatwg.org/multipage/text-level-semantics.html#attr-q-cite"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#valid-url-potentially-surrounded-by-spaces"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "cite", idlReflections: [{ "idlName": "cite", "sources": ["https://html.spec.whatwg.org/#dom-mod-cite", "https://html.spec.whatwg.org/#dom-quote-cite"] }], localName: "cite", termName: "cite" },
  { contexts: [{ "id": "class-global", "global": true, "elements": [], "specialParticipants": [], "description": "Classes to which the element belongs", "valueSyntaxText": "Set of space-separated tokens", "definitionSources": ["https://html.spec.whatwg.org/multipage/dom.html#classes"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#set-of-space-separated-tokens"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "class", idlReflections: [], localName: "class", termName: "class" },
  { contexts: [{ "id": "closedby-dialog", "global": false, "elements": ["dialog"], "specialParticipants": [], "description": "Which user actions will close the dialog", "valueSyntaxText": '"any"; "closerequest"; "none";', "definitionSources": ["https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-dialog-closedby"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-dialog-closedby-any", "https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-dialog-closedby-closerequest", "https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-dialog-closedby-none"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "closedBy", idlReflections: [{ "idlName": "closedBy", "sources": ["https://html.spec.whatwg.org/#dom-dialog-closedby"] }], localName: "closedby", termName: "closedBy" },
  { contexts: [{ "id": "color-link", "global": false, "elements": ["link"], "specialParticipants": [], "description": `Color to use when customizing a site's icon (for rel="mask-icon")`, "valueSyntaxText": "CSS <color>", "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-link-color"], "valueSyntaxSources": ["https://drafts.csswg.org/css-color/#typedef-color"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "color", idlReflections: [], localName: "color", termName: "color" },
  { contexts: [{ "id": "colorspace-input", "global": false, "elements": ["input"], "specialParticipants": [], "description": "The color space of the serialized color", "valueSyntaxText": '"limited-srgb"; "display-p3"', "definitionSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-colorspace"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-colorspace-display-p3", "https://html.spec.whatwg.org/multipage/input.html#attr-input-colorspace-limited-srgb"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "colorspace", idlReflections: [], localName: "colorspace", termName: "colorspace" },
  { contexts: [{ "id": "cols-textarea", "global": false, "elements": ["textarea"], "specialParticipants": [], "description": "Maximum number of characters per line", "valueSyntaxText": "Valid non-negative integer greater than zero", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-textarea-cols"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "cols", idlReflections: [{ "idlName": "cols", "sources": ["https://html.spec.whatwg.org/#dom-textarea-cols"] }], localName: "cols", termName: "cols" },
  { contexts: [{ "id": "colspan-td-th", "global": false, "elements": ["td", "th"], "specialParticipants": [], "description": "Number of columns that the cell is to span", "valueSyntaxText": "Valid non-negative integer greater than zero", "definitionSources": ["https://html.spec.whatwg.org/multipage/tables.html#attr-tdth-colspan"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "colSpan", idlReflections: [{ "idlName": "colSpan", "sources": ["https://html.spec.whatwg.org/#dom-tdth-colspan"] }], localName: "colspan", termName: "colSpan" },
  { contexts: [{ "id": "command-button", "global": false, "elements": ["button"], "specialParticipants": [], "description": "Indicates to the targeted element which action to take.", "valueSyntaxText": '"toggle-popover"; "show-popover"; "hide-popover"; "close"; "request-close"; "show-modal"; a custom command keyword', "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command-close", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command-custom", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command-hide-popover", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command-request-close", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command-show-modal", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command-show-popover", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command-toggle-popover"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "command", idlReflections: [{ "idlName": "command", "sources": ["https://html.spec.whatwg.org/#dom-button-command"] }], localName: "command", termName: "command" },
  { contexts: [{ "id": "commandfor-button", "global": false, "elements": ["button"], "specialParticipants": [], "description": "Targets another element to be invoked.", "valueSyntaxText": "ID*", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-commandfor"], "valueSyntaxSources": ["https://dom.spec.whatwg.org/#concept-id"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "commandfor", idlReflections: [], localName: "commandfor", termName: "commandfor" },
  { contexts: [{ "id": "content-meta", "global": false, "elements": ["meta"], "specialParticipants": [], "description": "Value of the element", "valueSyntaxText": "Text*", "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-content"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "content", idlReflections: [{ "idlName": "content", "sources": ["https://html.spec.whatwg.org/#dom-meta-content"] }], localName: "content", termName: "content" },
  { contexts: [{ "id": "contenteditable-global", "global": true, "elements": [], "specialParticipants": [], "description": "Whether the element is editable", "valueSyntaxText": '"true"; "false"; "plaintext-only"; the empty string', "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-contenteditable"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "contenteditable", idlReflections: [], localName: "contenteditable", termName: "contenteditable" },
  { contexts: [{ "id": "controls-audio-img-video", "global": false, "elements": ["audio", "img", "video"], "specialParticipants": [], "description": "Show user agent controls", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-controls", "https://html.spec.whatwg.org/multipage/media.html#attr-media-controls"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "controls", idlReflections: [{ "idlName": "controls", "sources": ["https://html.spec.whatwg.org/#dom-img-controls", "https://html.spec.whatwg.org/#dom-media-controls"] }], localName: "controls", termName: "controls" },
  { contexts: [{ "id": "coords-area", "global": false, "elements": ["area"], "specialParticipants": [], "description": "Coordinates for the shape to be created in an image map", "valueSyntaxText": "Valid list of floating-point numbers*", "definitionSources": ["https://html.spec.whatwg.org/multipage/image-maps.html#attr-area-coords"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-list-of-floating-point-numbers"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "coords", idlReflections: [{ "idlName": "coords", "sources": ["https://html.spec.whatwg.org/#dom-area-coords"] }], localName: "coords", termName: "coords" },
  { contexts: [{ "id": "crossorigin-audio-img-link-script-video", "global": false, "elements": ["audio", "img", "link", "script", "video"], "specialParticipants": [], "description": "How the element handles crossorigin requests", "valueSyntaxText": '"anonymous"; "use-credentials"; the empty string', "definitionSources": ["https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-crossorigin", "https://html.spec.whatwg.org/multipage/media.html#attr-media-crossorigin", "https://html.spec.whatwg.org/multipage/scripting.html#attr-script-crossorigin", "https://html.spec.whatwg.org/multipage/semantics.html#attr-link-crossorigin"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#attr-crossorigin-anonymous-keyword", "https://html.spec.whatwg.org/multipage/urls-and-fetching.html#attr-crossorigin-use-credentials-keyword"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "crossorigin", idlReflections: [], localName: "crossorigin", termName: "crossorigin" },
  { contexts: [{ "id": "data-object", "global": false, "elements": ["object"], "specialParticipants": [], "description": "Address of the resource", "valueSyntaxText": "Valid non-empty URL potentially surrounded by spaces", "definitionSources": ["https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-object-data"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#valid-non-empty-url-potentially-surrounded-by-spaces"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "dataAttribute", idlReflections: [{ "idlName": "data", "sources": ["https://html.spec.whatwg.org/#dom-object-data"] }], localName: "data", termName: "dataAttribute" },
  { contexts: [{ "id": "datetime-del-ins", "global": false, "elements": ["del", "ins"], "specialParticipants": [], "description": "Date and (optionally) time of the change", "valueSyntaxText": "Valid date string with optional time", "definitionSources": ["https://html.spec.whatwg.org/multipage/edits.html#attr-mod-datetime"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string-with-optional-time"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "datetime-time", "global": false, "elements": ["time"], "specialParticipants": [], "description": "Machine-readable value", "valueSyntaxText": "Valid month string, valid date string, valid yearless date string, valid time string, valid local date and time string, valid time-zone offset string, valid global date and time string, valid week string, valid non-negative integer, or valid duration string", "definitionSources": ["https://html.spec.whatwg.org/multipage/text-level-semantics.html#attr-time-datetime"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string", "https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-duration-string", "https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-global-date-and-time-string", "https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-local-date-and-time-string", "https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-month-string", "https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer", "https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-time-string", "https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-time-zone-offset-string", "https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-week-string", "https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-yearless-date-string"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "dateTime", idlReflections: [{ "idlName": "dateTime", "sources": ["https://html.spec.whatwg.org/#dom-mod-datetime", "https://html.spec.whatwg.org/#dom-time-datetime"] }], localName: "datetime", termName: "dateTime" },
  { contexts: [{ "id": "decoding-img", "global": false, "elements": ["img"], "specialParticipants": [], "description": "Decoding hint to use when processing this image for presentation", "valueSyntaxText": '"sync"; "async"; "auto"', "definitionSources": ["https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-decoding"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/images.html#attr-img-decoding-async", "https://html.spec.whatwg.org/multipage/images.html#attr-img-decoding-auto", "https://html.spec.whatwg.org/multipage/images.html#attr-img-decoding-sync"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "decoding", idlReflections: [], localName: "decoding", termName: "decoding" },
  { contexts: [{ "id": "default-track", "global": false, "elements": ["track"], "specialParticipants": [], "description": "Enable the track if no other text track is more suitable", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/media.html#attr-track-default"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "default", idlReflections: [{ "idlName": "default", "sources": ["https://html.spec.whatwg.org/#dom-track-default"] }], localName: "default", termName: "default" },
  { contexts: [{ "id": "defer-script", "global": false, "elements": ["script"], "specialParticipants": [], "description": "Defer script execution", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/scripting.html#attr-script-defer"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "defer", idlReflections: [{ "idlName": "defer", "sources": ["https://html.spec.whatwg.org/#dom-script-defer"] }], localName: "defer", termName: "defer" },
  { contexts: [{ "id": "dir-global", "global": true, "elements": [], "specialParticipants": [], "description": "The text directionality of the element", "valueSyntaxText": '"ltr"; "rtl"; "auto"', "definitionSources": ["https://html.spec.whatwg.org/multipage/dom.html#attr-dir"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attr-dir-auto", "https://html.spec.whatwg.org/multipage/dom.html#attr-dir-ltr", "https://html.spec.whatwg.org/multipage/dom.html#attr-dir-rtl"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "dir-bdo", "global": false, "elements": ["bdo"], "specialParticipants": [], "description": "The text directionality of the element", "valueSyntaxText": '"ltr"; "rtl"', "definitionSources": ["https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-bdo-element"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attr-dir-ltr", "https://html.spec.whatwg.org/multipage/dom.html#attr-dir-rtl"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "dir", idlReflections: [], localName: "dir", termName: "dir" },
  { contexts: [{ "id": "dirname-input-textarea", "global": false, "elements": ["input", "textarea"], "specialParticipants": [], "description": "Name of form control to use for sending the element's directionality in form submission", "valueSyntaxText": "Text*", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-dirname"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "dirName", idlReflections: [{ "idlName": "dirName", "sources": ["https://html.spec.whatwg.org/#dom-input-dirname", "https://html.spec.whatwg.org/#dom-textarea-dirname"] }], localName: "dirname", termName: "dirName" },
  { contexts: [{ "id": "disabled-button-input-optgroup-option-select-textarea-form-associated-custom-elements", "global": false, "elements": ["button", "input", "optgroup", "option", "select", "textarea"], "specialParticipants": ["form-associated-custom-elements"], "description": "Whether the form control is disabled", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-disabled", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-optgroup-disabled", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-option-disabled"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "disabled-fieldset", "global": false, "elements": ["fieldset"], "specialParticipants": [], "description": "Whether the descendant form controls, except any inside legend, are disabled", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-fieldset-disabled"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "disabled-link", "global": false, "elements": ["link"], "specialParticipants": [], "description": "Whether the link is disabled", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-link-disabled"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "disabled", idlReflections: [{ "idlName": "disabled", "sources": ["https://html.spec.whatwg.org/#dom-button-disabled", "https://html.spec.whatwg.org/#dom-fe-disabled", "https://html.spec.whatwg.org/#dom-fieldset-disabled", "https://html.spec.whatwg.org/#dom-link-disabled", "https://html.spec.whatwg.org/#dom-optgroup-disabled", "https://html.spec.whatwg.org/#dom-option-disabled", "https://html.spec.whatwg.org/#dom-select-disabled", "https://html.spec.whatwg.org/#dom-textarea-disabled"] }], localName: "disabled", termName: "disabled" },
  { contexts: [{ "id": "download-a-area", "global": false, "elements": ["a", "area"], "specialParticipants": [], "description": "Whether to download the resource instead of navigating to it, and its filename if so", "valueSyntaxText": "Text", "definitionSources": ["https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-download"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "download", idlReflections: [{ "idlName": "download", "sources": ["https://html.spec.whatwg.org/#dom-a-download", "https://html.spec.whatwg.org/#dom-area-download"] }], localName: "download", termName: "download" },
  { contexts: [{ "id": "draggable-global", "global": true, "elements": [], "specialParticipants": [], "description": "Whether the element is draggable", "valueSyntaxText": '"true"; "false"', "definitionSources": ["https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "draggable", idlReflections: [], localName: "draggable", termName: "draggable" },
  { contexts: [{ "id": "enctype-form", "global": false, "elements": ["form"], "specialParticipants": [], "description": "Entry list encoding type to use for form submission", "valueSyntaxText": '"application/x-www-form-urlencoded"; "multipart/form-data"; "text/plain"', "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-enctype"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-enctype-formdata", "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-enctype-text", "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-enctype-urlencoded"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "enctype", idlReflections: [], localName: "enctype", termName: "enctype" },
  { contexts: [{ "id": "enterkeyhint-global", "global": true, "elements": [], "specialParticipants": [], "description": "Hint for selecting an enter key action", "valueSyntaxText": '"enter"; "done"; "go"; "next"; "previous"; "search"; "send"', "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-enterkeyhint"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-enterkeyhint-keyword-done", "https://html.spec.whatwg.org/multipage/interaction.html#attr-enterkeyhint-keyword-enter", "https://html.spec.whatwg.org/multipage/interaction.html#attr-enterkeyhint-keyword-go", "https://html.spec.whatwg.org/multipage/interaction.html#attr-enterkeyhint-keyword-next", "https://html.spec.whatwg.org/multipage/interaction.html#attr-enterkeyhint-keyword-previous", "https://html.spec.whatwg.org/multipage/interaction.html#attr-enterkeyhint-keyword-search", "https://html.spec.whatwg.org/multipage/interaction.html#attr-enterkeyhint-keyword-send"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "enterkeyhint", idlReflections: [], localName: "enterkeyhint", termName: "enterkeyhint" },
  { contexts: [{ "id": "fetchpriority-img-link-script", "global": false, "elements": ["img", "link", "script"], "specialParticipants": [], "description": "Sets the priority for fetches initiated by the element", "valueSyntaxText": '"auto"; "high"; "low"', "definitionSources": ["https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-fetchpriority", "https://html.spec.whatwg.org/multipage/scripting.html#attr-script-fetchpriority", "https://html.spec.whatwg.org/multipage/semantics.html#attr-link-fetchpriority"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#attr-fetchpriority-auto", "https://html.spec.whatwg.org/multipage/urls-and-fetching.html#attr-fetchpriority-high", "https://html.spec.whatwg.org/multipage/urls-and-fetching.html#attr-fetchpriority-low"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "fetchpriority", idlReflections: [], localName: "fetchpriority", termName: "fetchpriority" },
  { contexts: [{ "id": "for-label", "global": false, "elements": ["label"], "specialParticipants": [], "description": "Associate the label with form control", "valueSyntaxText": "ID*", "definitionSources": ["https://html.spec.whatwg.org/multipage/forms.html#attr-label-for"], "valueSyntaxSources": ["https://dom.spec.whatwg.org/#concept-id"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "for-output", "global": false, "elements": ["output"], "specialParticipants": [], "description": "Specifies controls from which the output was calculated", "valueSyntaxText": "Unordered set of unique space-separated tokens consisting of IDs*", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-output-for"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#unordered-set-of-unique-space-separated-tokens"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "for", idlReflections: [{ "idlName": "htmlFor", "sources": ["https://html.spec.whatwg.org/#dom-label-htmlfor", "https://html.spec.whatwg.org/#dom-output-htmlfor"] }], localName: "for", termName: "for" },
  { contexts: [{ "id": "form-button-fieldset-input-object-output-select-textarea-form-associated-custom-elements", "global": false, "elements": ["button", "fieldset", "input", "object", "output", "select", "textarea"], "specialParticipants": ["form-associated-custom-elements"], "description": "Associates the element with a form element", "valueSyntaxText": "ID*", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fae-form"], "valueSyntaxSources": ["https://dom.spec.whatwg.org/#concept-id"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "form", idlReflections: [], localName: "form", termName: "form" },
  { contexts: [{ "id": "formaction-button-input", "global": false, "elements": ["button", "input"], "specialParticipants": [], "description": "URL to use for form submission", "valueSyntaxText": "Valid non-empty URL potentially surrounded by spaces", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-formaction"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#valid-non-empty-url-potentially-surrounded-by-spaces"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "formAction", idlReflections: [{ "idlName": "formAction", "sources": ["https://html.spec.whatwg.org/#dom-fs-formaction"] }], localName: "formaction", termName: "formAction" },
  { contexts: [{ "id": "formenctype-button-input", "global": false, "elements": ["button", "input"], "specialParticipants": [], "description": "Entry list encoding type to use for form submission", "valueSyntaxText": '"application/x-www-form-urlencoded"; "multipart/form-data"; "text/plain"', "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-formenctype"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-enctype-formdata", "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-enctype-text", "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-enctype-urlencoded"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "formenctype", idlReflections: [], localName: "formenctype", termName: "formenctype" },
  { contexts: [{ "id": "formmethod-button-input", "global": false, "elements": ["button", "input"], "specialParticipants": [], "description": "Variant to use for form submission", "valueSyntaxText": '"get"; "post"; "dialog"', "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-formmethod"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-method-dialog-keyword", "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-method-get-keyword", "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-method-post-keyword"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "formmethod", idlReflections: [], localName: "formmethod", termName: "formmethod" },
  { contexts: [{ "id": "formnovalidate-button-input", "global": false, "elements": ["button", "input"], "specialParticipants": [], "description": "Bypass form control validation for form submission", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-formnovalidate"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "formNoValidate", idlReflections: [{ "idlName": "formNoValidate", "sources": ["https://html.spec.whatwg.org/#dom-button-formnovalidate", "https://html.spec.whatwg.org/#dom-fs-formnovalidate"] }], localName: "formnovalidate", termName: "formNoValidate" },
  { contexts: [{ "id": "formtarget-button-input", "global": false, "elements": ["button", "input"], "specialParticipants": [], "description": "Navigable for form submission", "valueSyntaxText": "Valid navigable target name or keyword", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-formtarget"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/document-sequences.html#valid-navigable-target-name-or-keyword"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "formTarget", idlReflections: [{ "idlName": "formTarget", "sources": ["https://html.spec.whatwg.org/#dom-button-formtarget", "https://html.spec.whatwg.org/#dom-fs-formtarget"] }], localName: "formtarget", termName: "formTarget" },
  { contexts: [{ "id": "headers-td-th", "global": false, "elements": ["td", "th"], "specialParticipants": [], "description": "The header cells for this cell", "valueSyntaxText": "Unordered set of unique space-separated tokens consisting of IDs*", "definitionSources": ["https://html.spec.whatwg.org/multipage/tables.html#attr-tdth-headers"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#unordered-set-of-unique-space-separated-tokens"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "headers", idlReflections: [{ "idlName": "headers", "sources": ["https://html.spec.whatwg.org/#dom-tdth-headers"] }], localName: "headers", termName: "headers" },
  { contexts: [{ "id": "headingoffset-global", "global": true, "elements": [], "specialParticipants": [], "description": "Offsets heading levels for descendants", "valueSyntaxText": "Valid non-negative integer between 0 and 8", "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-tabindex"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "headingOffset", idlReflections: [{ "idlName": "headingOffset", "sources": ["https://html.spec.whatwg.org/#dom-headingoffset"] }], localName: "headingoffset", termName: "headingOffset" },
  { contexts: [{ "id": "headingreset-global", "global": true, "elements": [], "specialParticipants": [], "description": "Prevents a heading offset computation from traversing beyond the element with the attribute", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-tabindex"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "headingReset", idlReflections: [{ "idlName": "headingReset", "sources": ["https://html.spec.whatwg.org/#dom-headingreset"] }], localName: "headingreset", termName: "headingReset" },
  { contexts: [{ "id": "height-canvas-embed-iframe-img-input-object-source-video", "global": false, "elements": ["canvas", "embed", "iframe", "img", "input", "object", "source", "video"], "specialParticipants": [], "description": "Vertical dimension", "valueSyntaxText": "Valid non-negative integer", "definitionSources": ["https://html.spec.whatwg.org/multipage/canvas.html#attr-canvas-height", "https://html.spec.whatwg.org/multipage/embedded-content-other.html#attr-dim-height"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "height", idlReflections: [{ "idlName": "height", "sources": ["https://html.spec.whatwg.org/#dom-dim-height", "https://html.spec.whatwg.org/#dom-embed-height", "https://html.spec.whatwg.org/#dom-img-height", "https://html.spec.whatwg.org/#dom-input-height", "https://html.spec.whatwg.org/#dom-object-height", "https://html.spec.whatwg.org/#dom-source-height", "https://html.spec.whatwg.org/#dom-video-height"] }], localName: "height", termName: "height" },
  { contexts: [{ "id": "hidden-global", "global": true, "elements": [], "specialParticipants": [], "description": "Whether the element is relevant", "valueSyntaxText": '"until-found"; "hidden"; the empty string', "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-hidden"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-hidden", "https://html.spec.whatwg.org/multipage/interaction.html#attr-hidden-until-found"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "hidden", idlReflections: [], localName: "hidden", termName: "hidden" },
  { contexts: [{ "id": "high-meter", "global": false, "elements": ["meter"], "specialParticipants": [], "description": "Low limit of high range", "valueSyntaxText": "Valid floating-point number*", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-meter-high"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-floating-point-number"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "high", idlReflections: [{ "idlName": "high", "sources": ["https://html.spec.whatwg.org/#dom-meter-high"] }], localName: "high", termName: "high" },
  { contexts: [{ "id": "href-a-area", "global": false, "elements": ["a", "area"], "specialParticipants": [], "description": "Address of the hyperlink", "valueSyntaxText": "Valid URL potentially surrounded by spaces", "definitionSources": ["https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-href"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#valid-url-potentially-surrounded-by-spaces"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "href-link", "global": false, "elements": ["link"], "specialParticipants": [], "description": "Address of the hyperlink", "valueSyntaxText": "Valid non-empty URL potentially surrounded by spaces", "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-link-href"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#valid-non-empty-url-potentially-surrounded-by-spaces"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "href-base", "global": false, "elements": ["base"], "specialParticipants": [], "description": "Document base URL", "valueSyntaxText": "Valid URL potentially surrounded by spaces", "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-base-href"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#valid-url-potentially-surrounded-by-spaces"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "href", idlReflections: [{ "idlName": "href", "sources": ["https://html.spec.whatwg.org/#dom-base-href", "https://html.spec.whatwg.org/#dom-hyperlink-href", "https://html.spec.whatwg.org/#dom-link-href"] }], localName: "href", termName: "href" },
  { contexts: [{ "id": "hreflang-a-link", "global": false, "elements": ["a", "link"], "specialParticipants": [], "description": "Language of the linked resource", "valueSyntaxText": "Valid BCP 47 language tag", "definitionSources": ["https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-hreflang", "https://html.spec.whatwg.org/multipage/semantics.html#attr-link-hreflang"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "hreflang", idlReflections: [{ "idlName": "hreflang", "sources": ["https://html.spec.whatwg.org/#dom-a-hreflang", "https://html.spec.whatwg.org/#dom-link-hreflang"] }], localName: "hreflang", termName: "hreflang" },
  { contexts: [{ "id": "http-equiv-meta", "global": false, "elements": ["meta"], "specialParticipants": [], "description": "Pragma directive", "valueSyntaxText": '"content-type"; "default-style"; "refresh"; "x-ua-compatible"; "content-security-policy"', "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-http-equiv"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-http-equiv-keyword-content-security-policy", "https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-http-equiv-keyword-content-type", "https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-http-equiv-keyword-default-style", "https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-http-equiv-keyword-refresh", "https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-http-equiv-keyword-x-ua-compatible"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "httpEquiv", idlReflections: [{ "idlName": "httpEquiv", "sources": ["https://html.spec.whatwg.org/#dom-meta-httpequiv"] }], localName: "http-equiv", termName: "httpEquiv" },
  { contexts: [{ "id": "id-global", "global": true, "elements": [], "specialParticipants": [], "description": "The element's ID", "valueSyntaxText": "Text*", "definitionSources": ["https://html.spec.whatwg.org/multipage/dom.html#the-id-attribute"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "id", idlReflections: [], localName: "id", termName: "id" },
  { contexts: [{ "id": "imagesizes-link", "global": false, "elements": ["link"], "specialParticipants": [], "description": 'Image sizes for different page layouts (for rel="preload")', "valueSyntaxText": "Valid source size list", "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesizes"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/images.html#valid-source-size-list"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "imageSizes", idlReflections: [{ "idlName": "imageSizes", "sources": ["https://html.spec.whatwg.org/#dom-link-imagesizes"] }], localName: "imagesizes", termName: "imageSizes" },
  { contexts: [{ "id": "imagesrcset-link", "global": false, "elements": ["link"], "specialParticipants": [], "description": 'Images to use in different situations, e.g., high-resolution displays, small monitors, etc. (for rel="preload")', "valueSyntaxText": "Comma-separated list of image candidate strings", "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-link-imagesrcset"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/images.html#image-candidate-string"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "imageSrcset", idlReflections: [{ "idlName": "imageSrcset", "sources": ["https://html.spec.whatwg.org/#dom-link-imagesrcset"] }], localName: "imagesrcset", termName: "imageSrcset" },
  { contexts: [{ "id": "inert-global", "global": true, "elements": [], "specialParticipants": [], "description": "Whether the element is inert.", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#the-inert-attribute"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "inert", idlReflections: [{ "idlName": "inert", "sources": ["https://html.spec.whatwg.org/#dom-inert"] }], localName: "inert", termName: "inert" },
  { contexts: [{ "id": "inputmode-global", "global": true, "elements": [], "specialParticipants": [], "description": "Hint for selecting an input modality", "valueSyntaxText": '"none"; "text"; "tel"; "email"; "url"; "numeric"; "decimal"; "search"', "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode-keyword-decimal", "https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode-keyword-email", "https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode-keyword-none", "https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode-keyword-numeric", "https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode-keyword-search", "https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode-keyword-tel", "https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode-keyword-text", "https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode-keyword-url"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "inputmode", idlReflections: [], localName: "inputmode", termName: "inputmode" },
  { contexts: [{ "id": "integrity-link-script", "global": false, "elements": ["link", "script"], "specialParticipants": [], "description": "Integrity metadata used in Subresource Integrity checks [SRI]", "valueSyntaxText": "Text", "definitionSources": ["https://html.spec.whatwg.org/multipage/scripting.html#attr-script-integrity", "https://html.spec.whatwg.org/multipage/semantics.html#attr-link-integrity"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "integrity", idlReflections: [{ "idlName": "integrity", "sources": ["https://html.spec.whatwg.org/#dom-link-integrity", "https://html.spec.whatwg.org/#dom-script-integrity"] }], localName: "integrity", termName: "integrity" },
  { contexts: [{ "id": "is-global", "global": true, "elements": [], "specialParticipants": [], "description": "Creates a customized built-in element", "valueSyntaxText": "Valid custom element name of a defined customized built-in element", "definitionSources": ["https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/custom-elements.html#customized-built-in-element", "https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "is", idlReflections: [], localName: "is", termName: "is" },
  { contexts: [{ "id": "ismap-img", "global": false, "elements": ["img"], "specialParticipants": [], "description": "Whether the image is a server-side image map", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-ismap"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "isMap", idlReflections: [{ "idlName": "isMap", "sources": ["https://html.spec.whatwg.org/#dom-img-ismap"] }], localName: "ismap", termName: "isMap" },
  { contexts: [{ "id": "itemid-global", "global": true, "elements": [], "specialParticipants": [], "description": "Global identifier for a microdata item", "valueSyntaxText": "Valid URL potentially surrounded by spaces", "definitionSources": ["https://html.spec.whatwg.org/multipage/microdata.html#attr-itemid"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#valid-url-potentially-surrounded-by-spaces"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "itemid", idlReflections: [], localName: "itemid", termName: "itemid" },
  { contexts: [{ "id": "itemprop-global", "global": true, "elements": [], "specialParticipants": [], "description": "Property names of a microdata item", "valueSyntaxText": "Unordered set of unique space-separated tokens consisting of valid absolute URLs, defined property names, or text*", "definitionSources": ["https://html.spec.whatwg.org/multipage/microdata.html#names:-the-itemprop-attribute"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#unordered-set-of-unique-space-separated-tokens", "https://html.spec.whatwg.org/multipage/microdata.html#defined-property-name", "https://url.spec.whatwg.org/#syntax-url-absolute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "itemprop", idlReflections: [], localName: "itemprop", termName: "itemprop" },
  { contexts: [{ "id": "itemref-global", "global": true, "elements": [], "specialParticipants": [], "description": "Referenced elements", "valueSyntaxText": "Unordered set of unique space-separated tokens consisting of IDs*", "definitionSources": ["https://html.spec.whatwg.org/multipage/microdata.html#attr-itemref"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#unordered-set-of-unique-space-separated-tokens"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "itemref", idlReflections: [], localName: "itemref", termName: "itemref" },
  { contexts: [{ "id": "itemscope-global", "global": true, "elements": [], "specialParticipants": [], "description": "Introduces a microdata item", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/microdata.html#attr-itemscope"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "itemscope", idlReflections: [], localName: "itemscope", termName: "itemscope" },
  { contexts: [{ "id": "itemtype-global", "global": true, "elements": [], "specialParticipants": [], "description": "Item types of a microdata item", "valueSyntaxText": "Unordered set of unique space-separated tokens consisting of valid absolute URLs*", "definitionSources": ["https://html.spec.whatwg.org/multipage/microdata.html#attr-itemtype"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#unordered-set-of-unique-space-separated-tokens", "https://url.spec.whatwg.org/#syntax-url-absolute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "itemtype", idlReflections: [], localName: "itemtype", termName: "itemtype" },
  { contexts: [{ "id": "kind-track", "global": false, "elements": ["track"], "specialParticipants": [], "description": "The type of text track", "valueSyntaxText": '"subtitles"; "captions"; "descriptions"; "chapters"; "metadata"', "definitionSources": ["https://html.spec.whatwg.org/multipage/media.html#attr-track-kind"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/media.html#attr-track-kind-keyword-captions", "https://html.spec.whatwg.org/multipage/media.html#attr-track-kind-keyword-chapters", "https://html.spec.whatwg.org/multipage/media.html#attr-track-kind-keyword-descriptions", "https://html.spec.whatwg.org/multipage/media.html#attr-track-kind-keyword-metadata", "https://html.spec.whatwg.org/multipage/media.html#attr-track-kind-keyword-subtitles"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "kind", idlReflections: [], localName: "kind", termName: "kind" },
  { contexts: [{ "id": "label-optgroup-option-track", "global": false, "elements": ["optgroup", "option", "track"], "specialParticipants": [], "description": "User-visible label", "valueSyntaxText": "Text", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-optgroup-label", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-option-label", "https://html.spec.whatwg.org/multipage/media.html#attr-track-label"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "label", idlReflections: [{ "idlName": "label", "sources": ["https://html.spec.whatwg.org/#dom-optgroup-label", "https://html.spec.whatwg.org/#dom-option-label", "https://html.spec.whatwg.org/#dom-track-label"] }], localName: "label", termName: "label" },
  { contexts: [{ "id": "lang-global", "global": true, "elements": [], "specialParticipants": [], "description": "Language of the element", "valueSyntaxText": "Valid BCP 47 language tag or the empty string", "definitionSources": ["https://html.spec.whatwg.org/multipage/dom.html#attr-lang"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "lang", idlReflections: [{ "idlName": "lang", "sources": ["https://html.spec.whatwg.org/#dom-lang"] }], localName: "lang", termName: "lang" },
  { contexts: [{ "id": "list-input", "global": false, "elements": ["input"], "specialParticipants": [], "description": "List of autocomplete options", "valueSyntaxText": "ID*", "definitionSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-list"], "valueSyntaxSources": ["https://dom.spec.whatwg.org/#concept-id"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "list", idlReflections: [], localName: "list", termName: "list" },
  { contexts: [{ "id": "loading-audio-iframe-img-video", "global": false, "elements": ["audio", "iframe", "img", "video"], "specialParticipants": [], "description": "Used when determining loading deferral", "valueSyntaxText": '"lazy"; "eager"', "definitionSources": ["https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-loading", "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-loading", "https://html.spec.whatwg.org/multipage/media.html#attr-media-loading"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#attr-loading-eager", "https://html.spec.whatwg.org/multipage/urls-and-fetching.html#attr-loading-lazy"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "loading", idlReflections: [], localName: "loading", termName: "loading" },
  { contexts: [{ "id": "loop-audio-video", "global": false, "elements": ["audio", "video"], "specialParticipants": [], "description": "Whether to loop the media resource", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/media.html#attr-media-loop"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "loop", idlReflections: [{ "idlName": "loop", "sources": ["https://html.spec.whatwg.org/#dom-media-loop"] }], localName: "loop", termName: "loop" },
  { contexts: [{ "id": "low-meter", "global": false, "elements": ["meter"], "specialParticipants": [], "description": "High limit of low range", "valueSyntaxText": "Valid floating-point number*", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-meter-low"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-floating-point-number"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "low", idlReflections: [{ "idlName": "low", "sources": ["https://html.spec.whatwg.org/#dom-meter-low"] }], localName: "low", termName: "low" },
  { contexts: [{ "id": "max-input", "global": false, "elements": ["input"], "specialParticipants": [], "description": "Maximum value", "valueSyntaxText": "Varies*", "definitionSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-max"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "max-meter-progress", "global": false, "elements": ["meter", "progress"], "specialParticipants": [], "description": "Upper bound of range", "valueSyntaxText": "Valid floating-point number*", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-meter-max", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-progress-max"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-floating-point-number"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "max", idlReflections: [{ "idlName": "max", "sources": ["https://html.spec.whatwg.org/#dom-input-max", "https://html.spec.whatwg.org/#dom-meter-max", "https://html.spec.whatwg.org/#dom-progress-max"] }], localName: "max", termName: "max" },
  { contexts: [{ "id": "maxlength-input-textarea", "global": false, "elements": ["input", "textarea"], "specialParticipants": [], "description": "Maximum length of value", "valueSyntaxText": "Valid non-negative integer", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-textarea-maxlength", "https://html.spec.whatwg.org/multipage/input.html#attr-input-maxlength"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "maxLength", idlReflections: [{ "idlName": "maxLength", "sources": ["https://html.spec.whatwg.org/#dom-input-maxlength", "https://html.spec.whatwg.org/#dom-textarea-maxlength"] }], localName: "maxlength", termName: "maxLength" },
  { contexts: [{ "id": "media-link-meta-source-style", "global": false, "elements": ["link", "meta", "source", "style"], "specialParticipants": [], "description": "Applicable media", "valueSyntaxText": "Valid media query list", "definitionSources": ["https://html.spec.whatwg.org/multipage/embedded-content.html#attr-source-media", "https://html.spec.whatwg.org/multipage/semantics.html#attr-link-media", "https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-media", "https://html.spec.whatwg.org/multipage/semantics.html#attr-style-media"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-media-query-list"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "media", idlReflections: [{ "idlName": "media", "sources": ["https://html.spec.whatwg.org/#dom-link-media", "https://html.spec.whatwg.org/#dom-meta-media", "https://html.spec.whatwg.org/#dom-source-media", "https://html.spec.whatwg.org/#dom-style-media"] }], localName: "media", termName: "media" },
  { contexts: [{ "id": "method-form", "global": false, "elements": ["form"], "specialParticipants": [], "description": "Variant to use for form submission", "valueSyntaxText": '"get"; "post"; "dialog"', "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-method"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-method-dialog-keyword", "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-method-get-keyword", "https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-method-post-keyword"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "method", idlReflections: [], localName: "method", termName: "method" },
  { contexts: [{ "id": "min-input", "global": false, "elements": ["input"], "specialParticipants": [], "description": "Minimum value", "valueSyntaxText": "Varies*", "definitionSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-min"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "min-meter", "global": false, "elements": ["meter"], "specialParticipants": [], "description": "Lower bound of range", "valueSyntaxText": "Valid floating-point number*", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-meter-min"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-floating-point-number"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "min", idlReflections: [{ "idlName": "min", "sources": ["https://html.spec.whatwg.org/#dom-input-min", "https://html.spec.whatwg.org/#dom-meter-min"] }], localName: "min", termName: "min" },
  { contexts: [{ "id": "minlength-input-textarea", "global": false, "elements": ["input", "textarea"], "specialParticipants": [], "description": "Minimum length of value", "valueSyntaxText": "Valid non-negative integer", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-textarea-minlength", "https://html.spec.whatwg.org/multipage/input.html#attr-input-minlength"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "minLength", idlReflections: [{ "idlName": "minLength", "sources": ["https://html.spec.whatwg.org/#dom-input-minlength", "https://html.spec.whatwg.org/#dom-textarea-minlength"] }], localName: "minlength", termName: "minLength" },
  { contexts: [{ "id": "multiple-input-select", "global": false, "elements": ["input", "select"], "specialParticipants": [], "description": "Whether to allow multiple values", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-select-multiple", "https://html.spec.whatwg.org/multipage/input.html#attr-input-multiple"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "multiple", idlReflections: [{ "idlName": "multiple", "sources": ["https://html.spec.whatwg.org/#dom-input-multiple", "https://html.spec.whatwg.org/#dom-select-multiple"] }], localName: "multiple", termName: "multiple" },
  { contexts: [{ "id": "muted-audio-video", "global": false, "elements": ["audio", "video"], "specialParticipants": [], "description": "Whether to mute the media resource by default", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/media.html#attr-media-muted"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "muted", idlReflections: [{ "idlName": "defaultMuted", "sources": ["https://html.spec.whatwg.org/#dom-media-defaultmuted"] }], localName: "muted", termName: "muted" },
  { contexts: [{ "id": "name-button-fieldset-input-output-select-textarea-form-associated-custom-elements", "global": false, "elements": ["button", "fieldset", "input", "output", "select", "textarea"], "specialParticipants": ["form-associated-custom-elements"], "description": "Name of the element to use for form submission and in the form.elements API", "valueSyntaxText": "Text*", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-name"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "name-details", "global": false, "elements": ["details"], "specialParticipants": [], "description": "Name of group of mutually-exclusive details elements", "valueSyntaxText": "Text*", "definitionSources": ["https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-details-name"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "name-form", "global": false, "elements": ["form"], "specialParticipants": [], "description": "Name of form to use in the document.forms API", "valueSyntaxText": "Text*", "definitionSources": ["https://html.spec.whatwg.org/multipage/forms.html#attr-form-name"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "name-iframe-object", "global": false, "elements": ["iframe", "object"], "specialParticipants": [], "description": "Name of content navigable", "valueSyntaxText": "Valid navigable target name or keyword", "definitionSources": ["https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-name", "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-object-name"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/document-sequences.html#valid-navigable-target-name-or-keyword"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "name-map", "global": false, "elements": ["map"], "specialParticipants": [], "description": "Name of image map to reference from the usemap attribute", "valueSyntaxText": "Text*", "definitionSources": ["https://html.spec.whatwg.org/multipage/image-maps.html#attr-map-name"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "name-meta", "global": false, "elements": ["meta"], "specialParticipants": [], "description": "Metadata name", "valueSyntaxText": "Text*", "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-meta-name"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "name-slot", "global": false, "elements": ["slot"], "specialParticipants": [], "description": "Name of shadow tree slot", "valueSyntaxText": "Text", "definitionSources": ["https://html.spec.whatwg.org/multipage/scripting.html#attr-slot-name"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "name", idlReflections: [{ "idlName": "name", "sources": ["https://html.spec.whatwg.org/#dom-button-name", "https://html.spec.whatwg.org/#dom-details-name", "https://html.spec.whatwg.org/#dom-fe-name", "https://html.spec.whatwg.org/#dom-fieldset-name", "https://html.spec.whatwg.org/#dom-form-name", "https://html.spec.whatwg.org/#dom-iframe-name", "https://html.spec.whatwg.org/#dom-map-name", "https://html.spec.whatwg.org/#dom-meta-name", "https://html.spec.whatwg.org/#dom-object-name", "https://html.spec.whatwg.org/#dom-output-name", "https://html.spec.whatwg.org/#dom-select-name", "https://html.spec.whatwg.org/#dom-slot-name", "https://html.spec.whatwg.org/#dom-textarea-name"] }], localName: "name", termName: "name" },
  { contexts: [{ "id": "nomodule-script", "global": false, "elements": ["script"], "specialParticipants": [], "description": "Prevents execution in user agents that support module scripts", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/scripting.html#attr-script-nomodule"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "noModule", idlReflections: [{ "idlName": "noModule", "sources": ["https://html.spec.whatwg.org/#dom-script-nomodule"] }], localName: "nomodule", termName: "noModule" },
  { contexts: [{ "id": "nonce-global", "global": true, "elements": [], "specialParticipants": [], "description": "Cryptographic nonce used in Content Security Policy checks [CSP]", "valueSyntaxText": "Text", "definitionSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#attr-nonce"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "nonce", idlReflections: [], localName: "nonce", termName: "nonce" },
  { contexts: [{ "id": "novalidate-form", "global": false, "elements": ["form"], "specialParticipants": [], "description": "Bypass form control validation for form submission", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-novalidate"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "noValidate", idlReflections: [{ "idlName": "noValidate", "sources": ["https://html.spec.whatwg.org/#dom-fs-novalidate"] }], localName: "novalidate", termName: "noValidate" },
  { contexts: [{ "id": "open-details", "global": false, "elements": ["details"], "specialParticipants": [], "description": "Whether the details are visible", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-details-open"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "open-dialog", "global": false, "elements": ["dialog"], "specialParticipants": [], "description": "Whether the dialog box is showing", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/interactive-elements.html#attr-dialog-open"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "open", idlReflections: [{ "idlName": "open", "sources": ["https://html.spec.whatwg.org/#dom-details-open", "https://html.spec.whatwg.org/#dom-dialog-open"] }], localName: "open", termName: "open" },
  { contexts: [{ "id": "optimum-meter", "global": false, "elements": ["meter"], "specialParticipants": [], "description": "Optimum value in gauge", "valueSyntaxText": "Valid floating-point number*", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-meter-optimum"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-floating-point-number"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "optimum", idlReflections: [{ "idlName": "optimum", "sources": ["https://html.spec.whatwg.org/#dom-meter-optimum"] }], localName: "optimum", termName: "optimum" },
  { contexts: [{ "id": "pattern-input", "global": false, "elements": ["input"], "specialParticipants": [], "description": "Pattern to be matched by the form control's value", "valueSyntaxText": "Regular expression matching the JavaScript Pattern production", "definitionSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-pattern"], "valueSyntaxSources": ["https://tc39.es/ecma262/#prod-Pattern"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "pattern", idlReflections: [{ "idlName": "pattern", "sources": ["https://html.spec.whatwg.org/#dom-input-pattern"] }], localName: "pattern", termName: "pattern" },
  { contexts: [{ "id": "ping-a-area", "global": false, "elements": ["a", "area"], "specialParticipants": [], "description": "URLs to ping", "valueSyntaxText": "Set of space-separated tokens consisting of valid non-empty URLs", "definitionSources": ["https://html.spec.whatwg.org/multipage/links.html#ping"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#set-of-space-separated-tokens", "https://html.spec.whatwg.org/multipage/urls-and-fetching.html#valid-non-empty-url"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "ping", idlReflections: [{ "idlName": "ping", "sources": ["https://html.spec.whatwg.org/#dom-a-ping", "https://html.spec.whatwg.org/#dom-area-ping"] }], localName: "ping", termName: "ping" },
  { contexts: [{ "id": "placeholder-input-textarea", "global": false, "elements": ["input", "textarea"], "specialParticipants": [], "description": "User-visible label to be placed within the form control", "valueSyntaxText": "Text*", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-textarea-placeholder", "https://html.spec.whatwg.org/multipage/input.html#attr-input-placeholder"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "placeholder", idlReflections: [{ "idlName": "placeholder", "sources": ["https://html.spec.whatwg.org/#dom-input-placeholder", "https://html.spec.whatwg.org/#dom-textarea-placeholder"] }], localName: "placeholder", termName: "placeholder" },
  { contexts: [{ "id": "playsinline-video", "global": false, "elements": ["video"], "specialParticipants": [], "description": "Encourage the user agent to display video content within the element's playback area", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/media.html#attr-video-playsinline"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "playsInline", idlReflections: [{ "idlName": "playsInline", "sources": ["https://html.spec.whatwg.org/#dom-video-playsinline"] }], localName: "playsinline", termName: "playsInline" },
  { contexts: [{ "id": "popover-global", "global": true, "elements": [], "specialParticipants": [], "description": "Makes the element a popover element", "valueSyntaxText": '"auto"; "manual"; "hint"; the empty string', "definitionSources": ["https://html.spec.whatwg.org/multipage/popover.html#attr-popover"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/popover.html#attr-popover-auto", "https://html.spec.whatwg.org/multipage/popover.html#attr-popover-hint", "https://html.spec.whatwg.org/multipage/popover.html#attr-popover-manual"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "popover", idlReflections: [], localName: "popover", termName: "popover" },
  { contexts: [{ "id": "popovertarget-button-input", "global": false, "elements": ["button", "input"], "specialParticipants": [], "description": "Targets a popover element to toggle, show, or hide", "valueSyntaxText": "ID*", "definitionSources": ["https://html.spec.whatwg.org/multipage/popover.html#attr-popovertarget"], "valueSyntaxSources": ["https://dom.spec.whatwg.org/#concept-id"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "popovertarget", idlReflections: [], localName: "popovertarget", termName: "popovertarget" },
  { contexts: [{ "id": "popovertargetaction-button-input", "global": false, "elements": ["button", "input"], "specialParticipants": [], "description": "Indicates whether a targeted popover element is to be toggled, shown, or hidden", "valueSyntaxText": '"toggle"; "show"; "hide"', "definitionSources": ["https://html.spec.whatwg.org/multipage/popover.html#attr-popovertargetaction"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/popover.html#attr-popovertargetaction-hide", "https://html.spec.whatwg.org/multipage/popover.html#attr-popovertargetaction-show", "https://html.spec.whatwg.org/multipage/popover.html#attr-popovertargetaction-toggle"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "popovertargetaction", idlReflections: [], localName: "popovertargetaction", termName: "popovertargetaction" },
  { contexts: [{ "id": "poster-video", "global": false, "elements": ["video"], "specialParticipants": [], "description": "Poster frame to show prior to video playback", "valueSyntaxText": "Valid non-empty URL potentially surrounded by spaces", "definitionSources": ["https://html.spec.whatwg.org/multipage/media.html#attr-video-poster"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#valid-non-empty-url-potentially-surrounded-by-spaces"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "poster", idlReflections: [{ "idlName": "poster", "sources": ["https://html.spec.whatwg.org/#dom-video-poster"] }], localName: "poster", termName: "poster" },
  { contexts: [{ "id": "preload-audio-video", "global": false, "elements": ["audio", "video"], "specialParticipants": [], "description": "Hints how much buffering the media resource will likely need", "valueSyntaxText": '"none"; "metadata"; "auto"; the empty string', "definitionSources": ["https://html.spec.whatwg.org/multipage/media.html#attr-media-preload"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/media.html#attr-media-preload-auto", "https://html.spec.whatwg.org/multipage/media.html#attr-media-preload-metadata", "https://html.spec.whatwg.org/multipage/media.html#attr-media-preload-none"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "preload", idlReflections: [], localName: "preload", termName: "preload" },
  { contexts: [{ "id": "readonly-input-textarea", "global": false, "elements": ["input", "textarea"], "specialParticipants": [], "description": "Whether to allow the value to be edited by the user", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-textarea-readonly", "https://html.spec.whatwg.org/multipage/input.html#attr-input-readonly"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "readonly-form-associated-custom-elements", "global": false, "elements": [], "specialParticipants": ["form-associated-custom-elements"], "description": "Affects willValidate, plus any behavior added by the custom element author", "valueSyntaxText": "Boolean attribute", "definitionSources": [], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "readOnly", idlReflections: [{ "idlName": "readOnly", "sources": ["https://html.spec.whatwg.org/#dom-input-readonly", "https://html.spec.whatwg.org/#dom-textarea-readonly"] }], localName: "readonly", termName: "readOnly" },
  { contexts: [{ "id": "referrerpolicy-a-area-iframe-img-link-script", "global": false, "elements": ["a", "area", "iframe", "img", "link", "script"], "specialParticipants": [], "description": "Referrer policy for fetches initiated by the element", "valueSyntaxText": "Referrer policy", "definitionSources": ["https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-referrerpolicy", "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-referrerpolicy", "https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-referrerpolicy", "https://html.spec.whatwg.org/multipage/scripting.html#attr-script-referrerpolicy", "https://html.spec.whatwg.org/multipage/semantics.html#attr-link-referrerpolicy"], "valueSyntaxSources": ["https://w3c.github.io/webappsec-referrer-policy/#referrer-policy"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "referrerpolicy", idlReflections: [], localName: "referrerpolicy", termName: "referrerpolicy" },
  { contexts: [{ "id": "rel-a-area", "global": false, "elements": ["a", "area"], "specialParticipants": [], "description": "Relationship between the location in the document containing the hyperlink and the destination resource", "valueSyntaxText": "Unordered set of unique space-separated tokens*", "definitionSources": ["https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-rel"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#unordered-set-of-unique-space-separated-tokens"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "rel-link", "global": false, "elements": ["link"], "specialParticipants": [], "description": "Relationship between the document containing the hyperlink and the destination resource", "valueSyntaxText": "Unordered set of unique space-separated tokens*", "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-link-rel"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#unordered-set-of-unique-space-separated-tokens"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "rel", idlReflections: [{ "idlName": "rel", "sources": ["https://html.spec.whatwg.org/#dom-a-rel", "https://html.spec.whatwg.org/#dom-area-rel", "https://html.spec.whatwg.org/#dom-form-rel", "https://html.spec.whatwg.org/#dom-link-rel"] }, { "idlName": "relList", "sources": ["https://html.spec.whatwg.org/#dom-a-rellist", "https://html.spec.whatwg.org/#dom-area-rellist", "https://html.spec.whatwg.org/#dom-form-rellist", "https://html.spec.whatwg.org/#dom-link-rellist"] }], localName: "rel", termName: "rel" },
  { contexts: [{ "id": "required-input-select-textarea", "global": false, "elements": ["input", "select", "textarea"], "specialParticipants": [], "description": "Whether the control is required for form submission", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-select-required", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-textarea-required", "https://html.spec.whatwg.org/multipage/input.html#attr-input-required"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "required", idlReflections: [{ "idlName": "required", "sources": ["https://html.spec.whatwg.org/#dom-input-required", "https://html.spec.whatwg.org/#dom-select-required", "https://html.spec.whatwg.org/#dom-textarea-required"] }], localName: "required", termName: "required" },
  { contexts: [{ "id": "reversed-ol", "global": false, "elements": ["ol"], "specialParticipants": [], "description": "Number the list backwards", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/grouping-content.html#attr-ol-reversed"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "reversed", idlReflections: [{ "idlName": "reversed", "sources": ["https://html.spec.whatwg.org/#dom-ol-reversed"] }], localName: "reversed", termName: "reversed" },
  { contexts: [{ "id": "rows-textarea", "global": false, "elements": ["textarea"], "specialParticipants": [], "description": "Number of lines to show", "valueSyntaxText": "Valid non-negative integer greater than zero", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-textarea-rows"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "rows", idlReflections: [{ "idlName": "rows", "sources": ["https://html.spec.whatwg.org/#dom-textarea-rows"] }], localName: "rows", termName: "rows" },
  { contexts: [{ "id": "rowspan-td-th", "global": false, "elements": ["td", "th"], "specialParticipants": [], "description": "Number of rows that the cell is to span", "valueSyntaxText": "Valid non-negative integer", "definitionSources": ["https://html.spec.whatwg.org/multipage/tables.html#attr-tdth-rowspan"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "rowSpan", idlReflections: [{ "idlName": "rowSpan", "sources": ["https://html.spec.whatwg.org/#dom-tdth-rowspan"] }], localName: "rowspan", termName: "rowSpan" },
  { contexts: [{ "id": "sandbox-iframe", "global": false, "elements": ["iframe"], "specialParticipants": [], "description": "Security rules for nested content", "valueSyntaxText": 'Unordered set of unique space-separated tokens, ASCII case-insensitive, consisting of "allow-downloads""allow-forms""allow-modals""allow-orientation-lock""allow-pointer-lock""allow-popups""allow-popups-to-escape-sandbox""allow-presentation""allow-same-origin""allow-scripts""allow-top-navigation""allow-top-navigation-by-user-activation""allow-top-navigation-to-custom-protocols"', "definitionSources": ["https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/browsers.html#attr-iframe-sandbox-allow-downloads", "https://html.spec.whatwg.org/multipage/browsers.html#attr-iframe-sandbox-allow-forms", "https://html.spec.whatwg.org/multipage/browsers.html#attr-iframe-sandbox-allow-modals", "https://html.spec.whatwg.org/multipage/browsers.html#attr-iframe-sandbox-allow-orientation-lock", "https://html.spec.whatwg.org/multipage/browsers.html#attr-iframe-sandbox-allow-pointer-lock", "https://html.spec.whatwg.org/multipage/browsers.html#attr-iframe-sandbox-allow-popups", "https://html.spec.whatwg.org/multipage/browsers.html#attr-iframe-sandbox-allow-popups-to-escape-sandbox", "https://html.spec.whatwg.org/multipage/browsers.html#attr-iframe-sandbox-allow-presentation", "https://html.spec.whatwg.org/multipage/browsers.html#attr-iframe-sandbox-allow-same-origin", "https://html.spec.whatwg.org/multipage/browsers.html#attr-iframe-sandbox-allow-scripts", "https://html.spec.whatwg.org/multipage/browsers.html#attr-iframe-sandbox-allow-top-navigation", "https://html.spec.whatwg.org/multipage/browsers.html#attr-iframe-sandbox-allow-top-navigation-by-user-activation", "https://html.spec.whatwg.org/multipage/browsers.html#attr-iframe-sandbox-allow-top-navigation-to-custom-protocols", "https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#unordered-set-of-unique-space-separated-tokens", "https://infra.spec.whatwg.org/#ascii-case-insensitive"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "sandbox", idlReflections: [{ "idlName": "sandbox", "sources": ["https://html.spec.whatwg.org/#dom-iframe-sandbox"] }], localName: "sandbox", termName: "sandbox" },
  { contexts: [{ "id": "scope-th", "global": false, "elements": ["th"], "specialParticipants": [], "description": "Specifies which cells the header cell applies to", "valueSyntaxText": '"row"; "col"; "rowgroup"; "colgroup"', "definitionSources": ["https://html.spec.whatwg.org/multipage/tables.html#attr-th-scope"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/tables.html#attr-th-scope-col", "https://html.spec.whatwg.org/multipage/tables.html#attr-th-scope-colgroup", "https://html.spec.whatwg.org/multipage/tables.html#attr-th-scope-row", "https://html.spec.whatwg.org/multipage/tables.html#attr-th-scope-rowgroup"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "scope", idlReflections: [], localName: "scope", termName: "scope" },
  { contexts: [{ "id": "selected-option", "global": false, "elements": ["option"], "specialParticipants": [], "description": "Whether the option is selected by default", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-option-selected"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "selected", idlReflections: [{ "idlName": "defaultSelected", "sources": ["https://html.spec.whatwg.org/#dom-option-defaultselected"] }], localName: "selected", termName: "selected" },
  { contexts: [{ "id": "shadowrootclonable-template", "global": false, "elements": ["template"], "specialParticipants": [], "description": "Sets clonable on a declarative shadow root", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/scripting.html#attr-template-shadowrootclonable"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "shadowRootClonable", idlReflections: [{ "idlName": "shadowRootClonable", "sources": ["https://html.spec.whatwg.org/#dom-template-shadowrootclonable"] }], localName: "shadowrootclonable", termName: "shadowRootClonable" },
  { contexts: [{ "id": "shadowrootcustomelementregistry-template", "global": false, "elements": ["template"], "specialParticipants": [], "description": "Enables declarative shadow roots to indicate they will use a custom element registry", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/scripting.html#attr-template-shadowrootcustomelementregistry"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "shadowRootCustomElementRegistry", idlReflections: [{ "idlName": "shadowRootCustomElementRegistry", "sources": ["https://html.spec.whatwg.org/#dom-template-shadowrootcustomelementregistry"] }], localName: "shadowrootcustomelementregistry", termName: "shadowRootCustomElementRegistry" },
  { contexts: [{ "id": "shadowrootdelegatesfocus-template", "global": false, "elements": ["template"], "specialParticipants": [], "description": "Sets delegates focus on a declarative shadow root", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/scripting.html#attr-template-shadowrootdelegatesfocus"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "shadowRootDelegatesFocus", idlReflections: [{ "idlName": "shadowRootDelegatesFocus", "sources": ["https://html.spec.whatwg.org/#dom-template-shadowrootdelegatesfocus"] }], localName: "shadowrootdelegatesfocus", termName: "shadowRootDelegatesFocus" },
  { contexts: [{ "id": "shadowrootmode-template", "global": false, "elements": ["template"], "specialParticipants": [], "description": "Enables streaming declarative shadow roots", "valueSyntaxText": '"open"; "closed"', "definitionSources": ["https://html.spec.whatwg.org/multipage/scripting.html#attr-template-shadowrootmode"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "shadowrootmode", idlReflections: [], localName: "shadowrootmode", termName: "shadowrootmode" },
  { contexts: [{ "id": "shadowrootserializable-template", "global": false, "elements": ["template"], "specialParticipants": [], "description": "Sets serializable on a declarative shadow root", "valueSyntaxText": "Boolean attribute", "definitionSources": ["https://html.spec.whatwg.org/multipage/scripting.html#attr-template-shadowrootserializable"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attribute"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "shadowRootSerializable", idlReflections: [{ "idlName": "shadowRootSerializable", "sources": ["https://html.spec.whatwg.org/#dom-template-shadowrootserializable"] }], localName: "shadowrootserializable", termName: "shadowRootSerializable" },
  { contexts: [{ "id": "shadowrootslotassignment-template", "global": false, "elements": ["template"], "specialParticipants": [], "description": "Sets slot assignment on a declarative shadow root", "valueSyntaxText": '"named"; "manual"', "definitionSources": ["https://html.spec.whatwg.org/multipage/scripting.html#attr-template-shadowrootslotassignment"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "shadowrootslotassignment", idlReflections: [], localName: "shadowrootslotassignment", termName: "shadowrootslotassignment" },
  { contexts: [{ "id": "shape-area", "global": false, "elements": ["area"], "specialParticipants": [], "description": "The kind of shape to be created in an image map", "valueSyntaxText": '"circle"; "default"; "poly"; "rect"', "definitionSources": ["https://html.spec.whatwg.org/multipage/image-maps.html#attr-area-shape"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/image-maps.html#attr-area-shape-keyword-circle", "https://html.spec.whatwg.org/multipage/image-maps.html#attr-area-shape-keyword-default", "https://html.spec.whatwg.org/multipage/image-maps.html#attr-area-shape-keyword-poly", "https://html.spec.whatwg.org/multipage/image-maps.html#attr-area-shape-keyword-rect"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "shape", idlReflections: [{ "idlName": "shape", "sources": ["https://html.spec.whatwg.org/#dom-area-shape"] }], localName: "shape", termName: "shape" },
  { contexts: [{ "id": "size-input-select", "global": false, "elements": ["input", "select"], "specialParticipants": [], "description": "Size of the control", "valueSyntaxText": "Valid non-negative integer greater than zero", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-select-size", "https://html.spec.whatwg.org/multipage/input.html#attr-input-size"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "size", idlReflections: [{ "idlName": "size", "sources": ["https://html.spec.whatwg.org/#dom-input-size", "https://html.spec.whatwg.org/#dom-select-size"] }], localName: "size", termName: "size" },
  { contexts: [{ "id": "sizes-link", "global": false, "elements": ["link"], "specialParticipants": [], "description": 'Sizes of the icons (for rel="icon")', "valueSyntaxText": "Unordered set of unique space-separated tokens, ASCII case-insensitive, consisting of sizes*", "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-link-sizes"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#unordered-set-of-unique-space-separated-tokens", "https://infra.spec.whatwg.org/#ascii-case-insensitive"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "sizes-img-source", "global": false, "elements": ["img", "source"], "specialParticipants": [], "description": "Image sizes for different page layouts", "valueSyntaxText": "Valid source size list", "definitionSources": ["https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-sizes", "https://html.spec.whatwg.org/multipage/embedded-content.html#attr-source-sizes"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/images.html#valid-source-size-list"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "sizes", idlReflections: [{ "idlName": "sizes", "sources": ["https://html.spec.whatwg.org/#dom-img-sizes", "https://html.spec.whatwg.org/#dom-link-sizes", "https://html.spec.whatwg.org/#dom-source-sizes"] }], localName: "sizes", termName: "sizes" },
  { contexts: [{ "id": "slot-global", "global": true, "elements": [], "specialParticipants": [], "description": "The element's desired slot", "valueSyntaxText": "Text", "definitionSources": ["https://html.spec.whatwg.org/multipage/dom.html#the-id-attribute"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "slot", idlReflections: [], localName: "slot", termName: "slot" },
  { contexts: [{ "id": "span-col-colgroup", "global": false, "elements": ["col", "colgroup"], "specialParticipants": [], "description": "Number of columns spanned by the element", "valueSyntaxText": "Valid non-negative integer greater than zero", "definitionSources": ["https://html.spec.whatwg.org/multipage/tables.html#attr-col-span", "https://html.spec.whatwg.org/multipage/tables.html#attr-colgroup-span"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "span", idlReflections: [{ "idlName": "span", "sources": ["https://html.spec.whatwg.org/#dom-colgroup-span"] }], localName: "span", termName: "span" },
  { contexts: [{ "id": "spellcheck-global", "global": true, "elements": [], "specialParticipants": [], "description": "Whether the element is to have its spelling and grammar checked", "valueSyntaxText": '"true"; "false"; the empty string', "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-spellcheck"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-spellcheck-false", "https://html.spec.whatwg.org/multipage/interaction.html#attr-spellcheck-true"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "spellcheck", idlReflections: [], localName: "spellcheck", termName: "spellcheck" },
  { contexts: [{ "id": "src-audio-embed-iframe-img-input-script-source-track-video", "global": false, "elements": ["audio", "embed", "iframe", "img", "input", "script", "source", "track", "video"], "specialParticipants": [], "description": "Address of the resource", "valueSyntaxText": "Valid non-empty URL potentially surrounded by spaces", "definitionSources": ["https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-src", "https://html.spec.whatwg.org/multipage/embedded-content.html#attr-source-src", "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-embed-src", "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-src", "https://html.spec.whatwg.org/multipage/input.html#attr-input-src", "https://html.spec.whatwg.org/multipage/media.html#attr-media-src", "https://html.spec.whatwg.org/multipage/media.html#attr-track-src", "https://html.spec.whatwg.org/multipage/scripting.html#attr-script-src"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/urls-and-fetching.html#valid-non-empty-url-potentially-surrounded-by-spaces"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "src", idlReflections: [{ "idlName": "src", "sources": ["https://html.spec.whatwg.org/#dom-embed-src", "https://html.spec.whatwg.org/#dom-iframe-src", "https://html.spec.whatwg.org/#dom-img-src", "https://html.spec.whatwg.org/#dom-input-src", "https://html.spec.whatwg.org/#dom-media-src", "https://html.spec.whatwg.org/#dom-script-src", "https://html.spec.whatwg.org/#dom-source-src", "https://html.spec.whatwg.org/#dom-track-src"] }], localName: "src", termName: "src" },
  { contexts: [{ "id": "srcdoc-iframe", "global": false, "elements": ["iframe"], "specialParticipants": [], "description": "A document to render in the iframe", "valueSyntaxText": "The source of an iframe srcdoc document*", "definitionSources": ["https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-srcdoc"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/iframe-embed-object.html#an-iframe-srcdoc-document"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "srcdoc", idlReflections: [], localName: "srcdoc", termName: "srcdoc" },
  { contexts: [{ "id": "srclang-track", "global": false, "elements": ["track"], "specialParticipants": [], "description": "Language of the text track", "valueSyntaxText": "Valid BCP 47 language tag", "definitionSources": ["https://html.spec.whatwg.org/multipage/media.html#attr-track-srclang"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "srclang", idlReflections: [{ "idlName": "srclang", "sources": ["https://html.spec.whatwg.org/#dom-track-srclang"] }], localName: "srclang", termName: "srclang" },
  { contexts: [{ "id": "srcset-img-source", "global": false, "elements": ["img", "source"], "specialParticipants": [], "description": "Images to use in different situations, e.g., high-resolution displays, small monitors, etc.", "valueSyntaxText": "Comma-separated list of image candidate strings", "definitionSources": ["https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-srcset", "https://html.spec.whatwg.org/multipage/embedded-content.html#attr-source-srcset"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/images.html#image-candidate-string"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "srcset", idlReflections: [{ "idlName": "srcset", "sources": ["https://html.spec.whatwg.org/#dom-img-srcset", "https://html.spec.whatwg.org/#dom-source-srcset"] }], localName: "srcset", termName: "srcset" },
  { contexts: [{ "id": "start-ol", "global": false, "elements": ["ol"], "specialParticipants": [], "description": "Starting value of the list", "valueSyntaxText": "Valid integer", "definitionSources": ["https://html.spec.whatwg.org/multipage/grouping-content.html#attr-ol-start"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "start", idlReflections: [{ "idlName": "start", "sources": ["https://html.spec.whatwg.org/#dom-ol-start"] }], localName: "start", termName: "start" },
  { contexts: [{ "id": "step-input", "global": false, "elements": ["input"], "specialParticipants": [], "description": "Granularity to be matched by the form control's value", "valueSyntaxText": 'Valid floating-point number greater than zero, or "any"', "definitionSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-step"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-floating-point-number"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "step", idlReflections: [{ "idlName": "step", "sources": ["https://html.spec.whatwg.org/#dom-input-step"] }], localName: "step", termName: "step" },
  { contexts: [{ "id": "style-global", "global": true, "elements": [], "specialParticipants": [], "description": "Presentational and formatting instructions", "valueSyntaxText": "CSS declarations*", "definitionSources": ["https://html.spec.whatwg.org/multipage/dom.html#attr-style"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "style", idlReflections: [], localName: "style", termName: "style" },
  { contexts: [{ "id": "tabindex-global", "global": true, "elements": [], "specialParticipants": [], "description": "Whether the element is focusable and sequentially focusable, and the relative order of the element for the purposes of sequential focus navigation", "valueSyntaxText": "Valid integer", "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-tabindex"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "tabIndex", idlReflections: [{ "idlName": "tabIndex", "sources": ["https://html.spec.whatwg.org/#dom-tabindex"] }], localName: "tabindex", termName: "tabIndex" },
  { contexts: [{ "id": "target-a-area", "global": false, "elements": ["a", "area"], "specialParticipants": [], "description": "Navigable for hyperlink navigation", "valueSyntaxText": "Valid navigable target name or keyword", "definitionSources": ["https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-target"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/document-sequences.html#valid-navigable-target-name-or-keyword"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "target-base", "global": false, "elements": ["base"], "specialParticipants": [], "description": "Default navigable for hyperlink navigation and form submission", "valueSyntaxText": "Valid navigable target name or keyword", "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-base-target"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/document-sequences.html#valid-navigable-target-name-or-keyword"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "target-form", "global": false, "elements": ["form"], "specialParticipants": [], "description": "Navigable for form submission", "valueSyntaxText": "Valid navigable target name or keyword", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fs-target"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/document-sequences.html#valid-navigable-target-name-or-keyword"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "target", idlReflections: [{ "idlName": "target", "sources": ["https://html.spec.whatwg.org/#dom-a-target", "https://html.spec.whatwg.org/#dom-base-target", "https://html.spec.whatwg.org/#dom-fs-target"] }], localName: "target", termName: "target" },
  { contexts: [{ "id": "title-global", "global": true, "elements": [], "specialParticipants": [], "description": "Advisory information for the element", "valueSyntaxText": "Text", "definitionSources": ["https://html.spec.whatwg.org/multipage/dom.html#attr-title"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "title-abbr-dfn", "global": false, "elements": ["abbr", "dfn"], "specialParticipants": [], "description": "Full term or expansion of abbreviation", "valueSyntaxText": "Text", "definitionSources": ["https://html.spec.whatwg.org/multipage/text-level-semantics.html#attr-abbr-title", "https://html.spec.whatwg.org/multipage/text-level-semantics.html#attr-dfn-title"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "title-input", "global": false, "elements": ["input"], "specialParticipants": [], "description": "Description of pattern (when used with pattern attribute)", "valueSyntaxText": "Text", "definitionSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-title"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "title-link", "global": false, "elements": ["link"], "specialParticipants": [], "description": "Title of the link", "valueSyntaxText": "Text", "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-link-title"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "title-link-style", "global": false, "elements": ["link", "style"], "specialParticipants": [], "description": "CSS style sheet set name", "valueSyntaxText": "Text", "definitionSources": ["https://html.spec.whatwg.org/multipage/semantics.html#attr-link-title", "https://html.spec.whatwg.org/multipage/semantics.html#attr-style-title"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "title", idlReflections: [{ "idlName": "title", "sources": ["https://html.spec.whatwg.org/#dom-title"] }], localName: "title", termName: "title" },
  { contexts: [{ "id": "translate-global", "global": true, "elements": [], "specialParticipants": [], "description": "Whether the element is to be translated when the page is localized", "valueSyntaxText": '"yes"; "no"; the empty string', "definitionSources": ["https://html.spec.whatwg.org/multipage/dom.html#attr-translate"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "translate", idlReflections: [], localName: "translate", termName: "translate" },
  { contexts: [{ "id": "type-a-link", "global": false, "elements": ["a", "link"], "specialParticipants": [], "description": "Hint for the type of the referenced resource", "valueSyntaxText": "Valid MIME type string", "definitionSources": ["https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-type", "https://html.spec.whatwg.org/multipage/semantics.html#attr-link-type"], "valueSyntaxSources": ["https://mimesniff.spec.whatwg.org/#valid-mime-type"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "type-button", "global": false, "elements": ["button"], "specialParticipants": [], "description": "Type of button", "valueSyntaxText": '"submit"; "reset"; "button"', "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type-button", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type-reset", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-type-submit"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "type-embed-object-source", "global": false, "elements": ["embed", "object", "source"], "specialParticipants": [], "description": "Type of embedded resource", "valueSyntaxText": "Valid MIME type string", "definitionSources": ["https://html.spec.whatwg.org/multipage/embedded-content.html#attr-source-type", "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-embed-type", "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-object-type"], "valueSyntaxSources": ["https://mimesniff.spec.whatwg.org/#valid-mime-type"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "type-input", "global": false, "elements": ["input"], "specialParticipants": [], "description": "Type of form control", "valueSyntaxText": "input type keyword", "definitionSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-type"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-type"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "type-ol", "global": false, "elements": ["ol"], "specialParticipants": [], "description": "Kind of list marker", "valueSyntaxText": '"1"; "a"; "A"; "i"; "I"', "definitionSources": ["https://html.spec.whatwg.org/multipage/grouping-content.html#attr-ol-type"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/grouping-content.html#attr-ol-type-keyword-decimal", "https://html.spec.whatwg.org/multipage/grouping-content.html#attr-ol-type-keyword-lower-alpha", "https://html.spec.whatwg.org/multipage/grouping-content.html#attr-ol-type-keyword-lower-roman", "https://html.spec.whatwg.org/multipage/grouping-content.html#attr-ol-type-keyword-upper-alpha", "https://html.spec.whatwg.org/multipage/grouping-content.html#attr-ol-type-keyword-upper-roman"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "type-script", "global": false, "elements": ["script"], "specialParticipants": [], "description": "Type of script", "valueSyntaxText": '"module"; "importmap"; "speculationrules"; a valid MIME type string that is not a JavaScript MIME type essence match', "definitionSources": ["https://html.spec.whatwg.org/multipage/scripting.html#attr-script-type"], "valueSyntaxSources": ["https://mimesniff.spec.whatwg.org/#javascript-mime-type-essence-match", "https://mimesniff.spec.whatwg.org/#valid-mime-type"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "type", idlReflections: [{ "idlName": "type", "sources": ["https://html.spec.whatwg.org/#dom-a-type", "https://html.spec.whatwg.org/#dom-button-type", "https://html.spec.whatwg.org/#dom-embed-type", "https://html.spec.whatwg.org/#dom-link-type", "https://html.spec.whatwg.org/#dom-object-type", "https://html.spec.whatwg.org/#dom-ol-type", "https://html.spec.whatwg.org/#dom-script-type", "https://html.spec.whatwg.org/#dom-source-type"] }], localName: "type", termName: "type" },
  { contexts: [{ "id": "usemap-img", "global": false, "elements": ["img"], "specialParticipants": [], "description": "Name of image map to use", "valueSyntaxText": "Valid hash-name reference*", "definitionSources": ["https://html.spec.whatwg.org/multipage/image-maps.html#attr-hyperlink-usemap"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-hash-name-reference"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "useMap", idlReflections: [{ "idlName": "useMap", "sources": ["https://html.spec.whatwg.org/#dom-img-usemap"] }], localName: "usemap", termName: "useMap" },
  { contexts: [{ "id": "value-button-option", "global": false, "elements": ["button", "option"], "specialParticipants": [], "description": "Value to be used for form submission", "valueSyntaxText": "Text", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-value", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-option-value"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "value-data", "global": false, "elements": ["data"], "specialParticipants": [], "description": "Machine-readable value", "valueSyntaxText": "Text*", "definitionSources": ["https://html.spec.whatwg.org/multipage/text-level-semantics.html#attr-data-value"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/dom.html#attribute-text"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "value-input", "global": false, "elements": ["input"], "specialParticipants": [], "description": "Value of the form control", "valueSyntaxText": "Varies*", "definitionSources": ["https://html.spec.whatwg.org/multipage/input.html#attr-input-value"], "valueSyntaxSources": [], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "value-li", "global": false, "elements": ["li"], "specialParticipants": [], "description": "Ordinal value of the list item", "valueSyntaxText": "Valid integer", "definitionSources": ["https://html.spec.whatwg.org/multipage/grouping-content.html#attr-li-value"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }, { "id": "value-meter-progress", "global": false, "elements": ["meter", "progress"], "specialParticipants": [], "description": "Current value of the element", "valueSyntaxText": "Valid floating-point number", "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-meter-value", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-progress-value"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-floating-point-number"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "value", idlReflections: [{ "idlName": "defaultValue", "sources": ["https://html.spec.whatwg.org/#dom-input-defaultvalue"] }, { "idlName": "value", "sources": ["https://html.spec.whatwg.org/#dom-button-value", "https://html.spec.whatwg.org/#dom-data-value", "https://html.spec.whatwg.org/#dom-li-value", "https://html.spec.whatwg.org/#dom-meter-value", "https://html.spec.whatwg.org/#dom-option-value", "https://html.spec.whatwg.org/#dom-progress-value"] }], localName: "value", termName: "value" },
  { contexts: [{ "id": "width-canvas-embed-iframe-img-input-object-source-video", "global": false, "elements": ["canvas", "embed", "iframe", "img", "input", "object", "source", "video"], "specialParticipants": [], "description": "Horizontal dimension", "valueSyntaxText": "Valid non-negative integer", "definitionSources": ["https://html.spec.whatwg.org/multipage/canvas.html#attr-canvas-width", "https://html.spec.whatwg.org/multipage/embedded-content-other.html#attr-dim-width"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-non-negative-integer"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "width", idlReflections: [{ "idlName": "width", "sources": ["https://html.spec.whatwg.org/#dom-dim-width", "https://html.spec.whatwg.org/#dom-embed-width", "https://html.spec.whatwg.org/#dom-img-width", "https://html.spec.whatwg.org/#dom-input-width", "https://html.spec.whatwg.org/#dom-object-width", "https://html.spec.whatwg.org/#dom-source-width", "https://html.spec.whatwg.org/#dom-video-width"] }], localName: "width", termName: "width" },
  { contexts: [{ "id": "wrap-textarea", "global": false, "elements": ["textarea"], "specialParticipants": [], "description": "How the value of the form control is to be wrapped for form submission", "valueSyntaxText": '"soft"; "hard"', "definitionSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-textarea-wrap"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/form-elements.html#attr-textarea-wrap-hard", "https://html.spec.whatwg.org/multipage/form-elements.html#attr-textarea-wrap-soft"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "wrap", idlReflections: [{ "idlName": "wrap", "sources": ["https://html.spec.whatwg.org/#dom-textarea-wrap"] }], localName: "wrap", termName: "wrap" },
  { contexts: [{ "id": "writingsuggestions-global", "global": true, "elements": [], "specialParticipants": [], "description": "Whether the element can offer writing suggestions or not.", "valueSyntaxText": '"true"; "false"; the empty string', "definitionSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-writingsuggestions"], "valueSyntaxSources": ["https://html.spec.whatwg.org/multipage/interaction.html#attr-writingsuggestions-false", "https://html.spec.whatwg.org/multipage/interaction.html#attr-writingsuggestions-true"], "source": "https://html.spec.whatwg.org/multipage/indices.html#attributes-3" }], definitionIri: RDFHTML + "writingSuggestions", idlReflections: [{ "idlName": "writingSuggestions", "sources": ["https://html.spec.whatwg.org/#dom-writingsuggestions"] }], localName: "writingsuggestions", termName: "writingSuggestions" }
];
var ELEMENT_BY_CLASS_IRI = new Map(HTML_ELEMENTS.map((definition) => [definition.classIri, definition]));
var ATTRIBUTE_BY_DEFINITION_IRI = new Map(HTML_ATTRIBUTES.map((definition) => [definition.definitionIri, definition]));
var ATTRIBUTE_BY_LOCAL_NAME = new Map(HTML_ATTRIBUTES.map((definition) => [definition.localName, definition]));
var VOID_ELEMENTS = new Set(HTML_ELEMENTS.filter((definition) => definition.kind === "void").map((definition) => definition.tagName));

// src/vocabulary.ts
var RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
var DCTERMS = "http://purl.org/dc/terms/";
var ORD = "https://ontology.inferal.com/modules/ordering/";
var XSD = "http://www.w3.org/2001/XMLSchema#";
var TERMS = {
  attribute: `${RDFHTML}attribute`,
  attributeDefinition: `${RDFHTML}attributeDefinition`,
  attributeName: `${RDFHTML}attributeName`,
  attributeNamespace: `${RDFHTML}attributeNamespace`,
  attributeValue: `${RDFHTML}attributeValue`,
  base: `${RDFHTML}base`,
  childOf: `${RDFHTML}childOf`,
  children: `${RDFHTML}children`,
  comment: `${RDFHTML}Comment`,
  comparable: `${ORD}Comparable`,
  data: `${RDFHTML}data`,
  conformsTo: `${DCTERMS}conformsTo`,
  document: `${RDFHTML}Document`,
  documentType: `${RDFHTML}DocumentType`,
  documentTypeName: `${RDFHTML}documentTypeName`,
  hasChild: `${RDFHTML}hasChild`,
  immediatelyFollows: `${ORD}immediatelyFollows`,
  immediatelyPrecedes: `${ORD}immediatelyPrecedes`,
  follows: `${ORD}follows`,
  inOrdering: `${ORD}inOrdering`,
  localName: `${RDFHTML}localName`,
  namespace: `${RDFHTML}namespace`,
  precedes: `${ORD}precedes`,
  rdfFirst: `${RDF}first`,
  rdfList: `${RDF}List`,
  rdfNil: `${RDF}nil`,
  rdfRest: `${RDF}rest`,
  rdfType: `${RDF}type`,
  text: `${RDFHTML}Text`,
  title: `${DCTERMS}title`,
  totalOrdering: `${ORD}TotalOrdering`
};

// src/carriers.ts
function escapeAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}
function blankKeys(quads) {
  const keys = /* @__PURE__ */ new Map();
  let next = 1;
  const visit = (term) => {
    if (term.termType === "BlankNode" && !keys.has(term.value)) keys.set(term.value, `rdfhtml-b${next++}`);
    if (term.termType === "Quad") {
      visit(term.subject);
      visit(term.object);
    }
  };
  for (const quad2 of quads) {
    visit(quad2.subject);
    visit(quad2.object);
    visit(quad2.graph);
  }
  return keys;
}
function subjectAttributes(subject, keys) {
  if (subject.termType === "NamedNode") return [`rdf-subject="${escapeAttribute(subject.value)}"`];
  if (subject.termType === "BlankNode") return [`rdf-subject-key="${escapeAttribute(keys.get(subject.value) ?? subject.value)}"`];
  throw new Error(`HTML/RDF cannot carry ${subject.termType} in subject position.`);
}
function graphAttributes(graph, keys) {
  if (graph.termType === "DefaultGraph") return [];
  if (graph.termType === "NamedNode") return [`rdf-graph="${escapeAttribute(graph.value)}"`];
  if (graph.termType === "BlankNode") return [`rdf-graph-key="${escapeAttribute(keys.get(graph.value) ?? graph.value)}"`];
  throw new Error(`HTML/RDF cannot carry ${graph.termType} as a graph name.`);
}
function literalAttributes(literal2) {
  const attributes = [`value="${escapeAttribute(literal2.value)}"`];
  const direction = literal2.direction;
  if (literal2.language) {
    attributes.push(`lang="${escapeAttribute(literal2.language)}"`);
    if (direction === "ltr" || direction === "rtl") attributes.push(`dir="${direction}"`);
  } else if (literal2.datatype.value !== `${XSD}string`) {
    attributes.push(`rdf-datatype="${escapeAttribute(literal2.datatype.value)}"`);
  }
  return attributes;
}
function statementCarrier(subject, predicate, object, graph, keys, hidden) {
  const attributes = [
    ...hidden ? ["hidden"] : [],
    ...subjectAttributes(subject, keys),
    `rdf-predicate="${escapeAttribute(predicate.value)}"`,
    ...graphAttributes(graph, keys)
  ];
  if (object.termType === "NamedNode") {
    attributes.push(`href="${escapeAttribute(object.value)}"`);
    return `<a ${attributes.join(" ")}></a>`;
  }
  if (object.termType === "BlankNode") {
    attributes.push(`rdf-object-key="${escapeAttribute(keys.get(object.value) ?? object.value)}"`);
    return `<meta ${attributes.join(" ")}>`;
  }
  if (object.termType === "Literal") {
    attributes.push(...literalAttributes(object));
    return `<data ${attributes.join(" ")}></data>`;
  }
  if (object.termType === "Quad") {
    const nested = statementCarrier(object.subject, object.predicate, object.object, object.graph, keys, false);
    return `<span ${attributes.join(" ")}><template>${nested}</template></span>`;
  }
  throw new Error(`HTML/RDF cannot carry ${object.termType} in object position.`);
}
function quadsToHtmlRdf(quads) {
  if (quads.length === 0) return "";
  const keys = blankKeys(quads);
  return quads.map((quad2) => statementCarrier(quad2.subject, quad2.predicate, quad2.object, quad2.graph, keys, true)).join("\n");
}

// src/convert.ts
var HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
var ELEMENT_CLASS = new Map(HTML_ELEMENTS.map((element) => [element.tagName, element.classIri.split("#").at(-1)]));
function turtleString(value) {
  return JSON.stringify(value).replaceAll("\u2028", "\\u2028").replaceAll("\u2029", "\\u2029");
}
function iri(value, label) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new TypeError(`${label} must be an absolute IRI.`);
  }
  if (!parsed.protocol) throw new TypeError(`${label} must be an absolute IRI.`);
  return `<${value.replaceAll(">", "%3E")}>`;
}
function indentation(depth) {
  return "    ".repeat(depth);
}
function propertyBlock(properties, depth, terminal) {
  const pad = indentation(depth);
  return properties.map((property, index) => `${pad}${property.predicate} ${property.object}${index === properties.length - 1 ? terminal : " ;"}`).join("\n");
}
function attributeNode(attribute, depth) {
  const properties = [
    { predicate: "a", object: "rdfhtml:Attribute" },
    { predicate: "rdfhtml:attributeName", object: turtleString(attribute.name) },
    { predicate: "rdfhtml:attributeValue", object: turtleString(attribute.value) }
  ];
  if (attribute.namespaceURI) {
    properties.push({ predicate: "rdfhtml:attributeNamespace", object: iri(attribute.namespaceURI, "Attribute namespace") });
  }
  return `[
${propertyBlock(properties, depth + 1, "")}
${indentation(depth)}]`;
}
function childNodes(node) {
  if (node.nodeType === 1 && node.localName === "template") {
    const content = node.content;
    return Array.from(content.childNodes);
  }
  return Array.from(node.childNodes);
}
function structuralProperties(node, depth) {
  if (node.nodeType === 10) {
    return [
      { predicate: "a", object: "rdfhtml:DocumentType" },
      { predicate: "rdfhtml:documentTypeName", object: turtleString(node.name) }
    ];
  }
  if (node.nodeType === 3) {
    return [
      { predicate: "a", object: "rdfhtml:Text" },
      { predicate: "rdfhtml:data", object: turtleString(node.nodeValue ?? "") }
    ];
  }
  if (node.nodeType === 8) {
    return [
      { predicate: "a", object: "rdfhtml:Comment" },
      { predicate: "rdfhtml:data", object: turtleString(node.nodeValue ?? "") }
    ];
  }
  if (node.nodeType !== 1) throw new TypeError(`Unsupported DOM node type ${node.nodeType}.`);
  const element = node;
  if (element.namespaceURI !== HTML_NAMESPACE) {
    throw new TypeError(`Only HTML-namespace elements are supported; found ${element.namespaceURI ?? "no namespace"}:${element.localName}.`);
  }
  const className = ELEMENT_CLASS.get(element.localName);
  if (!className && !element.localName.includes("-")) {
    throw new TypeError(`Unsupported HTML element <${element.localName}> is not in the current vocabulary snapshot.`);
  }
  const properties = className ? [{ predicate: "a", object: `rdfhtml:${className}` }] : [{ predicate: "a", object: "rdfhtml:CustomElement" }, { predicate: "rdfhtml:localName", object: turtleString(element.localName) }];
  for (const attribute of Array.from(element.attributes)) {
    const known = attribute.namespaceURI === null ? ATTRIBUTE_BY_LOCAL_NAME.get(attribute.name) : void 0;
    properties.push(known ? { predicate: `rdfhtml:${known.termName}`, object: turtleString(attribute.value) } : { predicate: "rdfhtml:attribute", object: attributeNode(attribute, depth + 1) });
  }
  const children = childNodes(element);
  if (children.length > 0) properties.push({ predicate: "rdfhtml:children", object: nodeList(children, depth + 1) });
  return properties;
}
function nodeDescription(node, depth) {
  const properties = structuralProperties(node, depth);
  return `[
${propertyBlock(properties, depth + 1, "")}
${indentation(depth)}]`;
}
function nodeList(nodes, depth) {
  if (nodes.length === 0) throw new TypeError("Cannot serialize an empty child list.");
  return `(
${nodes.map((node) => `${indentation(depth + 1)}${nodeDescription(node, depth + 1)}`).join("\n")}
${indentation(depth)})`;
}
function htmlDocumentToRdfHtml(document, options) {
  const documentIRI = iri(options.documentIRI, "Document IRI");
  const baseIRI = iri(options.baseIRI, "Document base IRI");
  const nodes = Array.from(document.childNodes).filter((node) => [1, 8, 10].includes(node.nodeType));
  if (nodes.length === 0 || !nodes.some((node) => node.nodeType === 1 && node.localName === "html")) {
    throw new TypeError("The source DOM must contain an html document element.");
  }
  const properties = [
    { predicate: "a", object: "rdfhtml:Document" },
    { predicate: "rdfhtml:base", object: baseIRI },
    { predicate: "dcterms:conformsTo", object: iri(HTML_VOCABULARY_IRI, "RDF/HTML vocabulary IRI") },
    { predicate: "dcterms:title", object: turtleString(options.title || document.title || options.documentIRI) }
  ];
  if (options.sourceIRI) properties.push({ predicate: "dcterms:source", object: iri(options.sourceIRI, "Source IRI") });
  if (options.licenseIRI) properties.push({ predicate: "dcterms:license", object: iri(options.licenseIRI, "License IRI") });
  if (options.attribution) properties.push({ predicate: "dcterms:creator", object: turtleString(options.attribution) });
  if (options.description) properties.push({ predicate: "dcterms:description", object: turtleString(options.description) });
  properties.push({ predicate: "rdfhtml:children", object: nodeList(nodes, 1) });
  return `@prefix rdfhtml: <https://ia2.dev/spec/rdf-html#> .
@prefix dcterms: <http://purl.org/dc/terms/> .

${documentIRI}
${propertyBlock(properties, 1, " .")}
`;
}

// ../../node_modules/n3/src/N3Lexer.js
var import_buffer = __toESM(require_buffer());

// ../../node_modules/n3/src/IRIs.js
var RDF2 = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
var XSD2 = "http://www.w3.org/2001/XMLSchema#";
var SWAP = "http://www.w3.org/2000/10/swap/";
var IRIs_default = {
  xsd: {
    decimal: `${XSD2}decimal`,
    boolean: `${XSD2}boolean`,
    double: `${XSD2}double`,
    integer: `${XSD2}integer`,
    string: `${XSD2}string`
  },
  rdf: {
    type: `${RDF2}type`,
    nil: `${RDF2}nil`,
    first: `${RDF2}first`,
    rest: `${RDF2}rest`,
    langString: `${RDF2}langString`,
    dirLangString: `${RDF2}dirLangString`,
    reifies: `${RDF2}reifies`
  },
  owl: {
    sameAs: "http://www.w3.org/2002/07/owl#sameAs"
  },
  r: {
    forSome: `${SWAP}reify#forSome`,
    forAll: `${SWAP}reify#forAll`
  },
  log: {
    implies: `${SWAP}log#implies`,
    isImpliedBy: `${SWAP}log#isImpliedBy`
  }
};

// ../../node_modules/n3/src/N3Lexer.js
var { xsd } = IRIs_default;
var escapeSequence = /\\u([a-fA-F0-9]{4})|\\U([a-fA-F0-9]{8})|\\([^])/g;
var escapeReplacements = {
  "\\": "\\",
  "'": "'",
  '"': '"',
  "n": "\n",
  "r": "\r",
  "t": "	",
  "f": "\f",
  "b": "\b",
  "_": "_",
  "~": "~",
  ".": ".",
  "-": "-",
  "!": "!",
  "$": "$",
  "&": "&",
  "(": "(",
  ")": ")",
  "*": "*",
  "+": "+",
  ",": ",",
  ";": ";",
  "=": "=",
  "/": "/",
  "?": "?",
  "#": "#",
  "@": "@",
  "%": "%"
};
var illegalIriChars = /[\x00-\x20<>\\"\{\}\|\^\`]/;
function isSurrogateCodePoint(charCode) {
  return charCode >= 55296 && charCode <= 57343;
}
var lineModeRegExps = {
  _iri: true,
  _unescapedIri: true,
  _simpleQuotedString: true,
  _langcode: true,
  _dircode: true,
  _blank: true,
  _newline: true,
  _comment: true,
  _whitespace: true,
  _endOfFile: true
};
var invalidRegExp = /$0^/;
var N3Lexer = class {
  constructor(options) {
    this._iri = /^<((?:[^ <>{}\\]|\\[uU])+)>[ \t]*/;
    this._unescapedIri = /^<([^\x00-\x20<>\\"\{\}\|\^\`]*)>[ \t]*/;
    this._simpleQuotedString = /^"([^"\\\r\n]*)"(?=[^"])/;
    this._simpleApostropheString = /^'([^'\\\r\n]*)'(?=[^'])/;
    this._langcode = /^@([a-z]+(?:-[a-z0-9]+)*)(?=[^a-z0-9])/i;
    this._dircode = /^--(ltr)|(rtl)/;
    this._prefix = /^((?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)?:(?=[#\s<])/;
    this._prefixed = /^((?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)?:((?:(?:[0-:A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~])(?:(?:[\.\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~])*(?:[\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~]))?)?)(?:[ \t]+|(?=\.?[,;!\^\s#()\[\]\{\}"'<>]))/;
    this._variable = /^\?(?:(?:[A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:[\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)(?=[.,;!\^\s#()\[\]\{\}"'<>])/;
    this._blank = /^_:((?:[0-9A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)(?:[ \t]+|(?=\.?[,;:\s#()\[\]\{\}"'<>]))/;
    this._number = /^[\-+]?(?:(\d+\.\d*|\.?\d+)[eE][\-+]?|\d*(\.)?)\d+(?=\.?[,;:\s#()\[\]\{\}"'<>])/;
    this._boolean = /^(?:true|false)(?=[.,;\s#()\[\]\{\}"'<>])/;
    this._atKeyword = /^@[a-z]+(?=[\s#<:])/i;
    this._keyword = /^(?:PREFIX|BASE|VERSION|GRAPH)(?=[\s#<])/i;
    this._shortPredicates = /^a(?=[\s#()\[\]\{\}"'<>])/;
    this._newline = /^[ \t]*(?:#[^\n\r]*)?(?:\r\n|\n|\r)[ \t]*/;
    this._comment = /#([^\n\r]*)/;
    this._whitespace = /^[ \t]+/;
    this._endOfFile = /^(?:#[^\n\r]*)?$/;
    options = options || {};
    this._isImpliedBy = options.isImpliedBy;
    if (this._lineMode = !!options.lineMode) {
      this._n3Mode = false;
      for (const key in this) {
        if (!(key in lineModeRegExps) && this[key] instanceof RegExp)
          this[key] = invalidRegExp;
      }
    } else {
      this._n3Mode = options.n3 !== false;
    }
    this.comments = !!options.comments;
    this._literalClosingPos = 0;
  }
  // ## Private methods
  // ### `_tokenizeToEnd` tokenizes as for as possible, emitting tokens through the callback
  _tokenizeToEnd(callback, inputFinished) {
    let input = this._input;
    let currentLineLength = input.length;
    while (true) {
      let whiteSpaceMatch, comment;
      while (whiteSpaceMatch = this._newline.exec(input)) {
        if (this.comments && (comment = this._comment.exec(whiteSpaceMatch[0])))
          emitToken("comment", comment[1], "", this._line, whiteSpaceMatch[0].length);
        input = input.substr(whiteSpaceMatch[0].length, input.length);
        currentLineLength = input.length;
        this._line++;
      }
      if (!whiteSpaceMatch && (whiteSpaceMatch = this._whitespace.exec(input)))
        input = input.substr(whiteSpaceMatch[0].length, input.length);
      if (this._endOfFile.test(input)) {
        if (inputFinished) {
          if (this.comments && (comment = this._comment.exec(input)))
            emitToken("comment", comment[1], "", this._line, input.length);
          input = null;
          emitToken("eof", "", "", this._line, 0);
        }
        return this._input = input;
      }
      const line = this._line, firstChar = input[0];
      let type = "", value = "", prefix = "", match = null, matchLength = 0, inconclusive = false;
      switch (firstChar) {
        case "^":
          if (input.length < 3)
            break;
          else if (input[1] === "^") {
            this._previousMarker = "^^";
            input = input.substr(2);
            if (input[0] !== "<") {
              inconclusive = true;
              break;
            }
          } else {
            if (this._n3Mode) {
              matchLength = 1;
              type = "^";
            }
            break;
          }
        // Fall through in case the type is an IRI
        case "<":
          if (match = this._unescapedIri.exec(input))
            type = "IRI", value = match[1];
          else if (match = this._iri.exec(input)) {
            value = this._unescape(match[1]);
            if (value === null || illegalIriChars.test(value))
              return reportSyntaxError(this);
            type = "IRI";
          } else if (input.length > 2 && input[1] === "<" && input[2] === "(")
            type = "<<(", matchLength = 3;
          else if (!this._lineMode && input.length > (inputFinished ? 1 : 2) && input[1] === "<")
            type = "<<", matchLength = 2;
          else if (this._n3Mode && input.length > 1 && input[1] === "=") {
            matchLength = 2;
            if (this._isImpliedBy) type = "abbreviation", value = "<";
            else type = "inverse", value = ">";
          }
          break;
        case ">":
          if (input.length > 1 && input[1] === ">")
            type = ">>", matchLength = 2;
          break;
        case "_":
          if ((match = this._blank.exec(input)) || inputFinished && (match = this._blank.exec(`${input} `)))
            type = "blank", prefix = "_", value = match[1];
          break;
        case '"':
          if (match = this._simpleQuotedString.exec(input))
            value = match[1];
          else {
            ({ value, matchLength } = this._parseLiteral(input));
            if (value === null)
              return reportSyntaxError(this);
          }
          if (match !== null || matchLength !== 0) {
            type = "literal";
            this._literalClosingPos = 0;
          }
          break;
        case "'":
          if (!this._lineMode) {
            if (match = this._simpleApostropheString.exec(input))
              value = match[1];
            else {
              ({ value, matchLength } = this._parseLiteral(input));
              if (value === null)
                return reportSyntaxError(this);
            }
            if (match !== null || matchLength !== 0) {
              type = "literal";
              this._literalClosingPos = 0;
            }
          }
          break;
        case "?":
          if (this._n3Mode && (match = this._variable.exec(input)))
            type = "var", value = match[0];
          break;
        case "@":
          if (this._previousMarker === "literal" && (match = this._langcode.exec(input)) && match[1] !== "version")
            type = "langcode", value = match[1];
          else if (match = this._atKeyword.exec(input))
            type = match[0];
          break;
        case ".":
          if (input.length === 1 ? inputFinished : input[1] < "0" || input[1] > "9") {
            type = ".";
            matchLength = 1;
            break;
          }
        // Fall through to numerical case (could be a decimal dot)
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "+":
        case "-":
          if (input[1] === "-") {
            if (this._previousMarker === "langcode" && (match = this._dircode.exec(input)))
              type = "dircode", matchLength = 2, value = match[1] || match[2], matchLength = value.length + 2;
            break;
          }
          if (match = this._number.exec(input) || inputFinished && (match = this._number.exec(`${input} `))) {
            type = "literal", value = match[0];
            prefix = typeof match[1] === "string" ? xsd.double : typeof match[2] === "string" ? xsd.decimal : xsd.integer;
          }
          break;
        case "B":
        case "b":
        case "p":
        case "P":
        case "G":
        case "g":
        case "V":
        case "v":
          if (match = this._keyword.exec(input))
            type = match[0].toUpperCase();
          else
            inconclusive = true;
          break;
        case "f":
        case "t":
          if (match = this._boolean.exec(input))
            type = "literal", value = match[0], prefix = xsd.boolean;
          else
            inconclusive = true;
          break;
        case "a":
          if (match = this._shortPredicates.exec(input))
            type = "abbreviation", value = "a";
          else
            inconclusive = true;
          break;
        case "=":
          if (this._n3Mode && input.length > 1) {
            type = "abbreviation";
            if (input[1] !== ">")
              matchLength = 1, value = "=";
            else
              matchLength = 2, value = ">";
          }
          break;
        case "!":
          if (!this._n3Mode)
            break;
        case ")":
          if (!inputFinished && (input.length === 1 || input.length === 2 && input[1] === ">")) {
            break;
          }
          if (input.length > 2 && input[1] === ">" && input[2] === ">") {
            type = ")>>", matchLength = 3;
            break;
          }
        case ",":
        case ";":
        case "[":
        case "]":
        case "(":
        case "}":
        case "~":
          if (!this._lineMode) {
            matchLength = 1;
            type = firstChar;
          }
          break;
        case "{":
          if (!this._lineMode && input.length >= 2) {
            if (input[1] === "|")
              type = "{|", matchLength = 2;
            else
              type = firstChar, matchLength = 1;
          }
          break;
        case "|":
          if (input.length >= 2 && input[1] === "}")
            type = "|}", matchLength = 2;
          break;
        default:
          inconclusive = true;
      }
      if (inconclusive) {
        if ((this._previousMarker === "@prefix" || this._previousMarker === "PREFIX") && (match = this._prefix.exec(input)))
          type = "prefix", value = match[1] || "";
        else if ((match = this._prefixed.exec(input)) || inputFinished && (match = this._prefixed.exec(`${input} `)))
          type = "prefixed", prefix = match[1] || "", value = this._unescape(match[2]);
      }
      if (this._previousMarker === "^^") {
        switch (type) {
          case "prefixed":
            type = "type";
            break;
          case "IRI":
            type = "typeIRI";
            break;
          default:
            type = "";
        }
      }
      if (!type) {
        if (inputFinished || !/^'''|^"""/.test(input) && /\n|\r/.test(input))
          return reportSyntaxError(this);
        else
          return this._input = input;
      }
      const length = matchLength || match[0].length;
      const token = emitToken(type, value, prefix, line, length);
      this.previousToken = token;
      this._previousMarker = type;
      input = input.substr(length, input.length);
    }
    function emitToken(type, value, prefix, line, length) {
      const start = input ? currentLineLength - input.length : currentLineLength;
      const end = start + length;
      const token = { type, value, prefix, line, start, end };
      callback(null, token);
      return token;
    }
    function reportSyntaxError(self) {
      callback(self._syntaxError(/^\S*/.exec(input)[0]));
    }
  }
  // ### `_unescape` replaces N3 escape codes by their corresponding characters
  _unescape(item) {
    let invalid = false;
    const replaced = item.replace(escapeSequence, (sequence, unicode4, unicode8, escapedChar) => {
      if (typeof unicode4 === "string") {
        const charCode = Number.parseInt(unicode4, 16);
        if (isSurrogateCodePoint(charCode)) {
          invalid = true;
          return "";
        }
        return String.fromCharCode(charCode);
      }
      if (typeof unicode8 === "string") {
        let charCode = Number.parseInt(unicode8, 16);
        if (isSurrogateCodePoint(charCode)) {
          invalid = true;
          return "";
        }
        return charCode <= 65535 ? String.fromCharCode(Number.parseInt(unicode8, 16)) : String.fromCharCode(55296 + ((charCode -= 65536) >> 10), 56320 + (charCode & 1023));
      }
      if (escapedChar in escapeReplacements)
        return escapeReplacements[escapedChar];
      invalid = true;
      return "";
    });
    return invalid ? null : replaced;
  }
  // ### `_parseLiteral` parses a literal into an unescaped value
  _parseLiteral(input) {
    if (input.length >= 3) {
      const opening = input.match(/^(?:"""|"|'''|'|)/)[0];
      const openingLength = opening.length;
      let closingPos = Math.max(this._literalClosingPos, openingLength);
      while ((closingPos = input.indexOf(opening, closingPos)) > 0) {
        let backslashCount = 0;
        while (input[closingPos - backslashCount - 1] === "\\")
          backslashCount++;
        if (backslashCount % 2 === 0) {
          const raw = input.substring(openingLength, closingPos);
          const lines = raw.split(/\r\n|\r|\n/).length - 1;
          const matchLength = closingPos + openingLength;
          if (openingLength === 1 && lines !== 0 || openingLength === 3 && this._lineMode)
            break;
          this._line += lines;
          return { value: this._unescape(raw), matchLength };
        }
        closingPos++;
      }
      this._literalClosingPos = input.length - openingLength + 1;
    }
    return { value: "", matchLength: 0 };
  }
  // ### `_syntaxError` creates a syntax error for the given issue
  _syntaxError(issue) {
    this._input = null;
    const err = new Error(`Unexpected "${issue}" on line ${this._line}.`);
    err.context = {
      token: void 0,
      line: this._line,
      previousToken: this.previousToken
    };
    return err;
  }
  // ### Strips off any starting UTF BOM mark.
  _readStartingBom(input) {
    return input.startsWith("\uFEFF") ? input.substr(1) : input;
  }
  // ## Public methods
  // ### `tokenize` starts the transformation of an N3 document into an array of tokens.
  // The input can be a string or a stream.
  tokenize(input, callback) {
    this._line = 1;
    if (typeof input === "string") {
      this._input = this._readStartingBom(input);
      if (typeof callback === "function")
        queueMicrotask(() => this._tokenizeToEnd(callback, true));
      else {
        const tokens = [];
        let error;
        this._tokenizeToEnd((e, t) => e ? error = e : tokens.push(t), true);
        if (error) throw error;
        return tokens;
      }
    } else {
      this._pendingBuffer = null;
      if (typeof input.setEncoding === "function")
        input.setEncoding("utf8");
      input.on("data", (data) => {
        if (this._input !== null && data.length !== 0) {
          if (this._pendingBuffer) {
            data = import_buffer.Buffer.concat([this._pendingBuffer, data]);
            this._pendingBuffer = null;
          }
          if (data[data.length - 1] & 128) {
            this._pendingBuffer = data;
          } else {
            if (typeof this._input === "undefined")
              this._input = this._readStartingBom(typeof data === "string" ? data : data.toString());
            else
              this._input += data;
            this._tokenizeToEnd(callback, false);
          }
        }
      });
      input.on("end", () => {
        if (typeof this._input === "string")
          this._tokenizeToEnd(callback, true);
      });
      input.on("error", callback);
    }
  }
};

// ../../node_modules/n3/src/N3DataFactory.js
var { rdf, xsd: xsd2 } = IRIs_default;
var DEFAULTGRAPH;
var _blankNodeCounter = 0;
var DataFactory = {
  namedNode,
  blankNode,
  variable,
  literal,
  defaultGraph,
  quad,
  triple: quad,
  fromTerm,
  fromQuad
};
var N3DataFactory_default = DataFactory;
var Term = class _Term {
  constructor(id) {
    this.id = id;
  }
  // ### The value of this term
  get value() {
    return this.id;
  }
  // ### Returns whether this object represents the same term as the other
  equals(other) {
    if (other instanceof _Term)
      return this.id === other.id;
    return !!other && this.termType === other.termType && this.value === other.value;
  }
  // ### Implement hashCode for Immutable.js, since we implement `equals`
  // https://immutable-js.com/docs/v4.0.0/ValueObject/#hashCode()
  hashCode() {
    return 0;
  }
  // ### Returns a plain object representation of this term
  toJSON() {
    return {
      termType: this.termType,
      value: this.value
    };
  }
};
var NamedNode = class extends Term {
  // ### The term type of this term
  get termType() {
    return "NamedNode";
  }
};
var Literal = class _Literal extends Term {
  // ### The term type of this term
  get termType() {
    return "Literal";
  }
  // ### The text value of this literal
  get value() {
    return this.id.substring(1, this.id.lastIndexOf('"'));
  }
  // ### The language of this literal
  get language() {
    const id = this.id;
    let atPos = id.lastIndexOf('"') + 1;
    const dirPos = id.lastIndexOf("--");
    return atPos < id.length && id[atPos++] === "@" ? (dirPos > atPos ? id.substr(0, dirPos) : id).substr(atPos).toLowerCase() : "";
  }
  // ### The direction of this literal
  get direction() {
    const id = this.id;
    const endPos = id.lastIndexOf('"');
    const dirPos = id.lastIndexOf("--");
    return dirPos > endPos && dirPos + 2 < id.length ? id.substr(dirPos + 2).toLowerCase() : "";
  }
  // ### The datatype IRI of this literal
  get datatype() {
    return new NamedNode(this.datatypeString);
  }
  // ### The datatype string of this literal
  get datatypeString() {
    const id = this.id, dtPos = id.lastIndexOf('"') + 1;
    const char = dtPos < id.length ? id[dtPos] : "";
    return char === "^" ? id.substr(dtPos + 2) : (
      // If "@" follows, return rdf:langString or rdf:dirLangString; xsd:string otherwise
      char !== "@" ? xsd2.string : id.indexOf("--", dtPos) > 0 ? rdf.dirLangString : rdf.langString
    );
  }
  // ### Returns whether this object represents the same term as the other
  equals(other) {
    if (other instanceof _Literal)
      return this.id === other.id;
    return !!other && !!other.datatype && this.termType === other.termType && this.value === other.value && this.language === other.language && (this.direction === other.direction || this.direction === "" && !other.direction) && this.datatype.value === other.datatype.value;
  }
  toJSON() {
    return {
      termType: this.termType,
      value: this.value,
      language: this.language,
      direction: this.direction,
      datatype: { termType: "NamedNode", value: this.datatypeString }
    };
  }
};
var BlankNode = class extends Term {
  constructor(name) {
    super(`_:${name}`);
  }
  // ### The term type of this term
  get termType() {
    return "BlankNode";
  }
  // ### The name of this blank node
  get value() {
    return this.id.substr(2);
  }
};
var Variable = class extends Term {
  constructor(name) {
    super(`?${name}`);
  }
  // ### The term type of this term
  get termType() {
    return "Variable";
  }
  // ### The name of this variable
  get value() {
    return this.id.substr(1);
  }
};
var DefaultGraph = class extends Term {
  constructor() {
    super("");
    return DEFAULTGRAPH || this;
  }
  // ### The term type of this term
  get termType() {
    return "DefaultGraph";
  }
  // ### Returns whether this object represents the same term as the other
  equals(other) {
    return this === other || !!other && this.termType === other.termType;
  }
};
DEFAULTGRAPH = new DefaultGraph();
var Quad = class extends Term {
  constructor(subject, predicate, object, graph) {
    super("");
    this._subject = subject;
    this._predicate = predicate;
    this._object = object;
    this._graph = graph || DEFAULTGRAPH;
  }
  // ### The term type of this term
  get termType() {
    return "Quad";
  }
  get subject() {
    return this._subject;
  }
  get predicate() {
    return this._predicate;
  }
  get object() {
    return this._object;
  }
  get graph() {
    return this._graph;
  }
  // ### Returns a plain object representation of this quad
  toJSON() {
    return {
      termType: this.termType,
      subject: this._subject.toJSON(),
      predicate: this._predicate.toJSON(),
      object: this._object.toJSON(),
      graph: this._graph.toJSON()
    };
  }
  // ### Returns whether this object represents the same quad as the other
  equals(other) {
    return !!other && this._subject.equals(other.subject) && this._predicate.equals(other.predicate) && this._object.equals(other.object) && this._graph.equals(other.graph);
  }
};
function namedNode(iri2) {
  return new NamedNode(iri2);
}
function blankNode(name) {
  return new BlankNode(name || `n3-${_blankNodeCounter++}`);
}
function literal(value, languageOrDataType) {
  if (typeof languageOrDataType === "string")
    return new Literal(`"${value}"@${languageOrDataType.toLowerCase()}`);
  if (languageOrDataType !== void 0 && !("termType" in languageOrDataType)) {
    return new Literal(`"${value}"@${languageOrDataType.language.toLowerCase()}${languageOrDataType.direction ? `--${languageOrDataType.direction.toLowerCase()}` : ""}`);
  }
  let datatype = languageOrDataType ? languageOrDataType.value : "";
  if (datatype === "") {
    if (typeof value === "boolean")
      datatype = xsd2.boolean;
    else if (typeof value === "number") {
      if (Number.isFinite(value))
        datatype = Number.isInteger(value) ? xsd2.integer : xsd2.double;
      else {
        datatype = xsd2.double;
        if (!Number.isNaN(value))
          value = value > 0 ? "INF" : "-INF";
      }
    }
  }
  return datatype === "" || datatype === xsd2.string ? new Literal(`"${value}"`) : new Literal(`"${value}"^^${datatype}`);
}
function variable(name) {
  return new Variable(name);
}
function defaultGraph() {
  return DEFAULTGRAPH;
}
function quad(subject, predicate, object, graph) {
  return new Quad(subject, predicate, object, graph);
}
function fromTerm(term) {
  if (term instanceof Term)
    return term;
  switch (term.termType) {
    case "NamedNode":
      return namedNode(term.value);
    case "BlankNode":
      return blankNode(term.value);
    case "Variable":
      return variable(term.value);
    case "DefaultGraph":
      return DEFAULTGRAPH;
    case "Literal":
      return literal(term.value, term.language || term.datatype);
    case "Quad":
      return fromQuad(term);
    default:
      throw new Error(`Unexpected termType: ${term.termType}`);
  }
}
function fromQuad(inQuad) {
  if (inQuad instanceof Quad)
    return inQuad;
  if (inQuad.termType !== "Quad")
    throw new Error(`Unexpected termType: ${inQuad.termType}`);
  return quad(fromTerm(inQuad.subject), fromTerm(inQuad.predicate), fromTerm(inQuad.object), fromTerm(inQuad.graph));
}

// ../../node_modules/n3/src/N3Parser.js
var blankNodePrefix = 0;
var N3Parser = class _N3Parser {
  constructor(options) {
    this._contextStack = [];
    this._graph = null;
    options = options || {};
    this._setBase(options.baseIRI);
    options.factory && initDataFactory(this, options.factory);
    const format = typeof options.format === "string" ? options.format.match(/\w*$/)[0].toLowerCase() : "", isTurtle = /turtle/.test(format), isTriG = /trig/.test(format), isNTriples = /triple/.test(format), isNQuads = /quad/.test(format), isN3 = this._n3Mode = /n3/.test(format), isLineMode = isNTriples || isNQuads;
    if (!(this._supportsNamedGraphs = !(isTurtle || isN3)))
      this._readPredicateOrNamedGraph = this._readPredicate;
    this._supportsQuads = !(isTurtle || isTriG || isNTriples || isN3);
    this._isImpliedBy = options.isImpliedBy;
    if (isLineMode)
      this._resolveRelativeIRI = (iri2) => {
        return null;
      };
    this._blankNodePrefix = typeof options.blankNodePrefix !== "string" ? "" : options.blankNodePrefix.replace(/^(?!_:)/, "_:");
    this._lexer = options.lexer || new N3Lexer({ lineMode: isLineMode, n3: isN3, isImpliedBy: this._isImpliedBy });
    this._explicitQuantifiers = !!options.explicitQuantifiers;
    this._parseUnsupportedVersions = !!options.parseUnsupportedVersions;
    this._version = options.version;
  }
  // ## Static class methods
  // ### `_resetBlankNodePrefix` restarts blank node prefix identification
  static _resetBlankNodePrefix() {
    blankNodePrefix = 0;
  }
  // ## Private methods
  // ### `_setBase` sets the base IRI to resolve relative IRIs
  _setBase(baseIRI) {
    if (!baseIRI) {
      this._base = "";
      this._basePath = "";
    } else {
      const fragmentPos = baseIRI.indexOf("#");
      if (fragmentPos >= 0)
        baseIRI = baseIRI.substr(0, fragmentPos);
      this._base = baseIRI;
      this._basePath = baseIRI.indexOf("/") < 0 ? baseIRI : baseIRI.replace(/[^\/?]*(?:\?.*)?$/, "");
      baseIRI = baseIRI.match(/^(?:([a-z][a-z0-9+.-]*:))?(?:\/\/[^\/]*)?/i);
      this._baseRoot = baseIRI[0];
      this._baseScheme = baseIRI[1];
    }
  }
  // ### `_saveContext` stores the current parsing context
  // when entering a new scope (list, blank node, formula)
  _saveContext(type, graph, subject, predicate, object) {
    const n3Mode = this._n3Mode;
    this._contextStack.push({
      type,
      subject,
      predicate,
      object,
      graph,
      inverse: n3Mode ? this._inversePredicate : false,
      blankPrefix: n3Mode ? this._prefixes._ : "",
      quantified: n3Mode ? this._quantified : null
    });
    if (n3Mode) {
      this._inversePredicate = false;
      this._prefixes._ = this._graph ? `${this._graph.value}.` : ".";
      this._quantified = Object.create(this._quantified);
    }
  }
  // ### `_restoreContext` restores the parent context
  // when leaving a scope (list, blank node, formula)
  _restoreContext(type, token) {
    const context = this._contextStack.pop();
    if (!context || context.type !== type)
      return this._error(`Unexpected ${token.type}`, token);
    this._subject = context.subject;
    this._predicate = context.predicate;
    this._object = context.object;
    this._graph = context.graph;
    if (this._n3Mode) {
      this._inversePredicate = context.inverse;
      this._prefixes._ = context.blankPrefix;
      this._quantified = context.quantified;
    }
  }
  // ### `_readBeforeTopContext` is called once only at the start of parsing.
  _readBeforeTopContext(token) {
    if (this._version && !this._isValidVersion(this._version))
      return this._error(`Detected unsupported version as media type parameter: "${this._version}"`, token);
    return this._readInTopContext(token);
  }
  // ### `_readInTopContext` reads a token when in the top context
  _readInTopContext(token) {
    switch (token.type) {
      // If an EOF token arrives in the top context, signal that we're done
      case "eof":
        if (this._graph !== null)
          return this._error("Unclosed graph", token);
        delete this._prefixes._;
        return this._callback(null, null, this._prefixes);
      // It could be a prefix declaration
      case "PREFIX":
        this._sparqlStyle = true;
      case "@prefix":
        return this._readPrefix;
      // It could be a base declaration
      case "BASE":
        this._sparqlStyle = true;
      case "@base":
        return this._readBaseIRI;
      // It could be a version declaration
      case "VERSION":
        this._sparqlStyle = true;
      case "@version":
        return this._readVersion;
      // It could be a graph
      case "{":
        if (this._supportsNamedGraphs) {
          this._graph = "";
          this._subject = null;
          return this._readSubject;
        }
      case "GRAPH":
        if (this._supportsNamedGraphs)
          return this._readNamedGraphLabel;
      // Otherwise, the next token must be a subject
      default:
        return this._readSubject(token);
    }
  }
  // ### `_readEntity` reads an IRI, prefixed name, blank node, or variable
  _readEntity(token, quantifier) {
    let value;
    switch (token.type) {
      // Read a relative or absolute IRI
      case "IRI":
      case "typeIRI":
        const iri2 = this._resolveIRI(token.value);
        if (iri2 === null)
          return this._error("Invalid IRI", token);
        value = this._factory.namedNode(iri2);
        break;
      // Read a prefixed name
      case "type":
      case "prefixed":
        const prefix = this._prefixes[token.prefix];
        if (prefix === void 0)
          return this._error(`Undefined prefix "${token.prefix}:"`, token);
        value = this._factory.namedNode(prefix + token.value);
        break;
      // Read a blank node
      case "blank":
        value = this._factory.blankNode(this._prefixes[token.prefix] + token.value);
        break;
      // Read a variable
      case "var":
        value = this._factory.variable(token.value.substr(1));
        break;
      // Everything else is not an entity
      default:
        return this._error(`Expected entity but got ${token.type}`, token);
    }
    if (!quantifier && this._n3Mode && value.id in this._quantified)
      value = this._quantified[value.id];
    return value;
  }
  // ### `_readSubject` reads a quad's subject
  _readSubject(token) {
    this._predicate = null;
    switch (token.type) {
      case "[":
        this._saveContext(
          "blank",
          this._graph,
          this._subject = this._factory.blankNode(),
          null,
          null
        );
        return this._readBlankNodeHead;
      case "(":
        const stack = this._contextStack, parent = stack.length && stack[stack.length - 1];
        if (parent.type === "<<") {
          return this._error("Unexpected list in reified triple", token);
        }
        this._saveContext("list", this._graph, this.RDF_NIL, null, null);
        this._subject = null;
        return this._readListItem;
      case "{":
        if (!this._n3Mode)
          return this._error("Unexpected graph", token);
        this._saveContext(
          "formula",
          this._graph,
          this._graph = this._factory.blankNode(),
          null,
          null
        );
        return this._readSubject;
      case "}":
        return this._readPunctuation(token);
      case "@forSome":
        if (!this._n3Mode)
          return this._error('Unexpected "@forSome"', token);
        this._subject = null;
        this._predicate = this.N3_FORSOME;
        this._quantifier = "blankNode";
        return this._readQuantifierList;
      case "@forAll":
        if (!this._n3Mode)
          return this._error('Unexpected "@forAll"', token);
        this._subject = null;
        this._predicate = this.N3_FORALL;
        this._quantifier = "variable";
        return this._readQuantifierList;
      case "literal":
        if (!this._n3Mode)
          return this._error("Unexpected literal", token);
        if (token.prefix.length === 0) {
          this._literalValue = token.value;
          return this._completeSubjectLiteral;
        } else
          this._subject = this._factory.literal(token.value, this._factory.namedNode(token.prefix));
        break;
      case "<<(":
        if (!this._n3Mode)
          return this._error("Disallowed triple term as subject", token);
        this._saveContext("<<(", this._graph, null, null, null);
        this._graph = null;
        return this._readSubject;
      case "<<":
        this._saveContext("<<", this._graph, null, null, null);
        this._graph = null;
        return this._readSubject;
      default:
        if ((this._subject = this._readEntity(token)) === void 0)
          return;
        if (this._n3Mode)
          return this._getPathReader(this._readPredicateOrNamedGraph);
    }
    return this._readPredicateOrNamedGraph;
  }
  // ### `_readPredicate` reads a quad's predicate
  _readPredicate(token) {
    const type = token.type;
    switch (type) {
      case "inverse":
        this._inversePredicate = true;
      case "abbreviation":
        this._predicate = this.ABBREVIATIONS[token.value];
        break;
      case ".":
      case "]":
      case "}":
      case "|}":
        if (this._predicate === null)
          return this._error(`Unexpected ${type}`, token);
        this._subject = null;
        return type === "]" ? this._readBlankNodeTail(token) : this._readPunctuation(token);
      case ";":
        return this._predicate !== null ? this._readPredicate : this._error("Expected predicate but got ;", token);
      case "[":
        if (this._n3Mode) {
          this._saveContext(
            "blank",
            this._graph,
            this._subject,
            this._subject = this._factory.blankNode(),
            null
          );
          return this._readBlankNodeHead;
        }
      case "blank":
        if (!this._n3Mode)
          return this._error("Disallowed blank node as predicate", token);
      default:
        if ((this._predicate = this._readEntity(token)) === void 0)
          return;
    }
    this._validAnnotation = true;
    return this._readObject;
  }
  // ### `_readObject` reads a quad's object
  _readObject(token) {
    switch (token.type) {
      case "literal":
        if (token.prefix.length === 0) {
          this._literalValue = token.value;
          return this._readDataTypeOrLang;
        } else
          this._object = this._factory.literal(token.value, this._factory.namedNode(token.prefix));
        break;
      case "[":
        this._saveContext(
          "blank",
          this._graph,
          this._subject,
          this._predicate,
          this._subject = this._factory.blankNode()
        );
        return this._readBlankNodeHead;
      case "(":
        const stack = this._contextStack, parent = stack.length && stack[stack.length - 1];
        if (parent.type === "<<") {
          return this._error("Unexpected list in reified triple", token);
        }
        this._saveContext("list", this._graph, this._subject, this._predicate, this.RDF_NIL);
        this._subject = null;
        return this._readListItem;
      case "{":
        if (!this._n3Mode)
          return this._error("Unexpected graph", token);
        this._saveContext(
          "formula",
          this._graph,
          this._subject,
          this._predicate,
          this._graph = this._factory.blankNode()
        );
        return this._readSubject;
      case "<<(":
        this._saveContext("<<(", this._graph, this._subject, this._predicate, null);
        this._graph = null;
        return this._readSubject;
      case "<<":
        this._saveContext("<<", this._graph, this._subject, this._predicate, null);
        this._graph = null;
        return this._readSubject;
      default:
        if ((this._object = this._readEntity(token)) === void 0)
          return;
        if (this._n3Mode)
          return this._getPathReader(this._getContextEndReader());
    }
    return this._getContextEndReader();
  }
  // ### `_readPredicateOrNamedGraph` reads a quad's predicate, or a named graph
  _readPredicateOrNamedGraph(token) {
    return token.type === "{" ? this._readGraph(token) : this._readPredicate(token);
  }
  // ### `_readGraph` reads a graph
  _readGraph(token) {
    if (token.type !== "{")
      return this._error(`Expected graph but got ${token.type}`, token);
    this._graph = this._subject, this._subject = null;
    return this._readSubject;
  }
  // ### `_readBlankNodeHead` reads the head of a blank node
  _readBlankNodeHead(token) {
    if (token.type === "]") {
      this._subject = null;
      return this._readBlankNodeTail(token);
    } else {
      const stack = this._contextStack, parentParent = stack.length > 1 && stack[stack.length - 2];
      if (parentParent.type === "<<") {
        return this._error("Unexpected compound blank node expression in reified triple", token);
      }
      this._predicate = null;
      return this._readPredicate(token);
    }
  }
  // ### `_readBlankNodeTail` reads the end of a blank node
  _readBlankNodeTail(token) {
    if (token.type !== "]")
      return this._readBlankNodePunctuation(token);
    if (this._subject !== null)
      this._emit(this._subject, this._predicate, this._object, this._graph);
    const empty = this._predicate === null;
    this._restoreContext("blank", token);
    if (this._object !== null)
      return this._getContextEndReader();
    else if (this._predicate !== null)
      return this._readObject;
    else
      return empty ? this._readPredicateOrNamedGraph : this._readPredicateAfterBlank;
  }
  // ### `_readPredicateAfterBlank` reads a predicate after an anonymous blank node
  _readPredicateAfterBlank(token) {
    switch (token.type) {
      case ".":
      case "}":
        this._subject = null;
        return this._readPunctuation(token);
      default:
        return this._readPredicate(token);
    }
  }
  // ### `_readListItem` reads items from a list
  _readListItem(token) {
    let item = null, list = null, next = this._readListItem;
    const previousList = this._subject, stack = this._contextStack, parent = stack[stack.length - 1];
    switch (token.type) {
      case "[":
        this._saveContext(
          "blank",
          this._graph,
          list = this._factory.blankNode(),
          this.RDF_FIRST,
          this._subject = item = this._factory.blankNode()
        );
        next = this._readBlankNodeHead;
        break;
      case "(":
        this._saveContext(
          "list",
          this._graph,
          list = this._factory.blankNode(),
          this.RDF_FIRST,
          this.RDF_NIL
        );
        this._subject = null;
        break;
      case ")":
        this._restoreContext("list", token);
        if (stack.length !== 0 && stack[stack.length - 1].type === "list")
          this._emit(this._subject, this._predicate, this._object, this._graph);
        if (this._predicate === null) {
          next = this._readPredicate;
          if (this._subject === this.RDF_NIL)
            return next;
        } else {
          next = this._getContextEndReader();
          if (this._object === this.RDF_NIL)
            return next;
        }
        list = this.RDF_NIL;
        break;
      case "literal":
        if (token.prefix.length === 0) {
          this._literalValue = token.value;
          next = this._readListItemDataTypeOrLang;
        } else {
          item = this._factory.literal(token.value, this._factory.namedNode(token.prefix));
          next = this._getContextEndReader();
        }
        break;
      case "{":
        if (!this._n3Mode)
          return this._error("Unexpected graph", token);
        this._saveContext(
          "formula",
          this._graph,
          this._subject,
          this._predicate,
          this._graph = this._factory.blankNode()
        );
        return this._readSubject;
      case "<<":
        this._saveContext("<<", this._graph, null, null, null);
        this._graph = null;
        next = this._readSubject;
        break;
      default:
        if ((item = this._readEntity(token)) === void 0)
          return;
    }
    if (list === null)
      this._subject = list = this._factory.blankNode();
    if (token.type === "<<")
      stack[stack.length - 1].subject = this._subject;
    if (previousList === null) {
      if (parent.predicate === null)
        parent.subject = list;
      else
        parent.object = list;
    } else {
      this._emit(previousList, this.RDF_REST, list, this._graph);
    }
    if (item !== null) {
      if (this._n3Mode && (token.type === "IRI" || token.type === "prefixed")) {
        this._saveContext("item", this._graph, list, this.RDF_FIRST, item);
        this._subject = item, this._predicate = null;
        return this._getPathReader(this._readListItem);
      }
      this._emit(list, this.RDF_FIRST, item, this._graph);
    }
    return next;
  }
  // ### `_readDataTypeOrLang` reads an _optional_ datatype or language
  _readDataTypeOrLang(token) {
    return this._completeObjectLiteral(token, false);
  }
  // ### `_readListItemDataTypeOrLang` reads an _optional_ datatype or language in a list
  _readListItemDataTypeOrLang(token) {
    return this._completeObjectLiteral(token, true);
  }
  // ### `_completeLiteral` completes a literal with an optional datatype or language
  _completeLiteral(token, component) {
    let literal2 = this._factory.literal(this._literalValue);
    let readCb;
    switch (token.type) {
      // Create a datatyped literal
      case "type":
      case "typeIRI":
        const datatype = this._readEntity(token);
        if (datatype === void 0) return;
        if (datatype.value === IRIs_default.rdf.langString || datatype.value === IRIs_default.rdf.dirLangString) {
          return this._error("Detected illegal (directional) languaged-tagged string with explicit datatype", token);
        }
        literal2 = this._factory.literal(this._literalValue, datatype);
        token = null;
        break;
      // Create a language-tagged string
      case "langcode":
        if (token.value.split("-").some((t) => t.length > 8))
          return this._error("Detected language tag with subtag longer than 8 characters", token);
        literal2 = this._factory.literal(this._literalValue, token.value);
        this._literalLanguage = token.value;
        token = null;
        readCb = this._readDirCode.bind(this, component);
        break;
    }
    return { token, literal: literal2, readCb };
  }
  _readDirCode(component, listItem, token) {
    if (token.type === "dircode") {
      const term = this._factory.literal(this._literalValue, { language: this._literalLanguage, direction: token.value });
      if (component === "subject")
        this._subject = term;
      else
        this._object = term;
      this._literalLanguage = void 0;
      token = null;
    }
    if (component === "subject")
      return token === null ? this._readPredicateOrNamedGraph : this._readPredicateOrNamedGraph(token);
    return this._completeObjectLiteralPost(token, listItem);
  }
  // Completes a literal in subject position
  _completeSubjectLiteral(token) {
    const completed = this._completeLiteral(token, "subject");
    this._subject = completed.literal;
    if (completed.readCb)
      return completed.readCb.bind(this, false);
    return this._readPredicateOrNamedGraph;
  }
  // Completes a literal in object position
  _completeObjectLiteral(token, listItem) {
    const completed = this._completeLiteral(token, "object");
    if (!completed)
      return;
    this._object = completed.literal;
    if (completed.readCb)
      return completed.readCb.bind(this, listItem);
    return this._completeObjectLiteralPost(completed.token, listItem);
  }
  _completeObjectLiteralPost(token, listItem) {
    if (listItem)
      this._emit(this._subject, this.RDF_FIRST, this._object, this._graph);
    if (token === null)
      return this._getContextEndReader();
    else {
      this._readCallback = this._getContextEndReader();
      return this._readCallback(token);
    }
  }
  // ### `_readFormulaTail` reads the end of a formula
  _readFormulaTail(token) {
    if (token.type !== "}")
      return this._readPunctuation(token);
    if (this._subject !== null)
      this._emit(this._subject, this._predicate, this._object, this._graph);
    this._restoreContext("formula", token);
    return this._object === null ? this._readPredicate : this._getContextEndReader();
  }
  // ### `_readPunctuation` reads punctuation between quads or quad parts
  _readPunctuation(token) {
    let next, graph = this._graph, startingAnnotation = false;
    const subject = this._subject, inversePredicate = this._inversePredicate;
    switch (token.type) {
      // A closing brace ends a graph
      case "}":
        if (this._graph === null)
          return this._error("Unexpected graph closing", token);
        if (this._n3Mode)
          return this._readFormulaTail(token);
        this._graph = null;
      // A dot just ends the statement, without sharing anything with the next
      case ".":
        this._subject = null;
        this._tripleTerm = null;
        next = this._contextStack.length ? this._readSubject : this._readInTopContext;
        if (inversePredicate) this._inversePredicate = false;
        break;
      // Semicolon means the subject is shared; predicate and object are different
      case ";":
        next = this._readPredicate;
        break;
      // Comma means both the subject and predicate are shared; the object is different
      case ",":
        next = this._readObject;
        break;
      // ~ is allowed in the annotation syntax
      case "~":
        next = this._readReifierInAnnotation;
        startingAnnotation = true;
        break;
      // {| means that the current triple is annotated with predicate-object pairs.
      case "{|":
        this._subject = this._readTripleTerm();
        this._validAnnotation = false;
        startingAnnotation = true;
        next = this._readPredicate;
        break;
      // |} means that the current reified triple in annotation syntax is finalized.
      case "|}":
        if (!this._annotation)
          return this._error("Unexpected annotation syntax closing", token);
        if (!this._validAnnotation)
          return this._error("Annotation block can not be empty", token);
        this._subject = null;
        this._annotation = false;
        next = this._readPunctuation;
        break;
      default:
        if (this._supportsQuads && this._graph === null && (graph = this._readEntity(token)) !== void 0) {
          next = this._readQuadPunctuation;
          break;
        }
        return this._error(`Expected punctuation to follow "${this._object.id}"`, token);
    }
    if (subject !== null && (!startingAnnotation || startingAnnotation && !this._annotation)) {
      const predicate = this._predicate, object = this._object;
      if (!inversePredicate)
        this._emit(subject, predicate, object, graph);
      else
        this._emit(object, predicate, subject, graph);
    }
    if (startingAnnotation) {
      this._annotation = true;
    }
    return next;
  }
  // ### `_readBlankNodePunctuation` reads punctuation in a blank node
  _readBlankNodePunctuation(token) {
    let next;
    switch (token.type) {
      // Semicolon means the subject is shared; predicate and object are different
      case ";":
        next = this._readPredicate;
        break;
      // Comma means both the subject and predicate are shared; the object is different
      case ",":
        next = this._readObject;
        break;
      default:
        return this._error(`Expected punctuation to follow "${this._object.id}"`, token);
    }
    this._emit(this._subject, this._predicate, this._object, this._graph);
    return next;
  }
  // ### `_readQuadPunctuation` reads punctuation after a quad
  _readQuadPunctuation(token) {
    if (token.type !== ".")
      return this._error("Expected dot to follow quad", token);
    return this._readInTopContext;
  }
  // ### `_readPrefix` reads the prefix of a prefix declaration
  _readPrefix(token) {
    if (token.type !== "prefix")
      return this._error("Expected prefix to follow @prefix", token);
    this._prefix = token.value;
    return this._readPrefixIRI;
  }
  // ### `_readPrefixIRI` reads the IRI of a prefix declaration
  _readPrefixIRI(token) {
    if (token.type !== "IRI")
      return this._error(`Expected IRI to follow prefix "${this._prefix}:"`, token);
    const prefixNode = this._readEntity(token);
    this._prefixes[this._prefix] = prefixNode.value;
    this._prefixCallback(this._prefix, prefixNode);
    return this._readDeclarationPunctuation;
  }
  // ### `_readBaseIRI` reads the IRI of a base declaration
  _readBaseIRI(token) {
    const iri2 = token.type === "IRI" && this._resolveIRI(token.value);
    if (!iri2)
      return this._error("Expected valid IRI to follow base declaration", token);
    this._setBase(iri2);
    return this._readDeclarationPunctuation;
  }
  // ### `_isValidVersion` checks if the given version is valid for this parser to handle.
  _isValidVersion(version) {
    return this._parseUnsupportedVersions || _N3Parser.SUPPORTED_VERSIONS.includes(version);
  }
  // ### `_readVersion` reads version string declaration
  _readVersion(token) {
    if (token.type !== "literal")
      return this._error("Expected literal to follow version declaration", token);
    if (token.end - token.start !== token.value.length + 2)
      return this._error("Version declarations must use single quotes", token);
    this._versionCallback(token.value);
    if (!this._isValidVersion(token.value))
      return this._error(`Detected unsupported version: "${token.value}"`, token);
    return this._readDeclarationPunctuation;
  }
  // ### `_readNamedGraphLabel` reads the label of a named graph
  _readNamedGraphLabel(token) {
    switch (token.type) {
      case "IRI":
      case "blank":
      case "prefixed":
        return this._readSubject(token), this._readGraph;
      case "[":
        return this._readNamedGraphBlankLabel;
      default:
        return this._error("Invalid graph label", token);
    }
  }
  // ### `_readNamedGraphLabel` reads a blank node label of a named graph
  _readNamedGraphBlankLabel(token) {
    if (token.type !== "]")
      return this._error("Invalid graph label", token);
    this._subject = this._factory.blankNode();
    return this._readGraph;
  }
  // ### `_readDeclarationPunctuation` reads the punctuation of a declaration
  _readDeclarationPunctuation(token) {
    if (this._sparqlStyle) {
      this._sparqlStyle = false;
      return this._readInTopContext(token);
    }
    if (token.type !== ".")
      return this._error("Expected declaration to end with a dot", token);
    return this._readInTopContext;
  }
  // Reads a list of quantified symbols from a @forSome or @forAll statement
  _readQuantifierList(token) {
    let entity;
    switch (token.type) {
      case "IRI":
      case "prefixed":
        if ((entity = this._readEntity(token, true)) !== void 0)
          break;
      default:
        return this._error(`Unexpected ${token.type}`, token);
    }
    if (!this._explicitQuantifiers)
      this._quantified[entity.id] = this._factory[this._quantifier](this._factory.blankNode().value);
    else {
      if (this._subject === null)
        this._emit(
          this._graph || this.DEFAULTGRAPH,
          this._predicate,
          this._subject = this._factory.blankNode(),
          this.QUANTIFIERS_GRAPH
        );
      else
        this._emit(
          this._subject,
          this.RDF_REST,
          this._subject = this._factory.blankNode(),
          this.QUANTIFIERS_GRAPH
        );
      this._emit(this._subject, this.RDF_FIRST, entity, this.QUANTIFIERS_GRAPH);
    }
    return this._readQuantifierPunctuation;
  }
  // Reads punctuation from a @forSome or @forAll statement
  _readQuantifierPunctuation(token) {
    if (token.type === ",")
      return this._readQuantifierList;
    else {
      if (this._explicitQuantifiers) {
        this._emit(this._subject, this.RDF_REST, this.RDF_NIL, this.QUANTIFIERS_GRAPH);
        this._subject = null;
      }
      this._readCallback = this._getContextEndReader();
      return this._readCallback(token);
    }
  }
  // ### `_getPathReader` reads a potential path and then resumes with the given function
  _getPathReader(afterPath) {
    this._afterPath = afterPath;
    return this._readPath;
  }
  // ### `_readPath` reads a potential path
  _readPath(token) {
    switch (token.type) {
      // Forward path
      case "!":
        return this._readForwardPath;
      // Backward path
      case "^":
        return this._readBackwardPath;
      // Not a path; resume reading where we left off
      default:
        const stack = this._contextStack, parent = stack.length && stack[stack.length - 1];
        if (parent && parent.type === "item") {
          const item = this._subject;
          this._restoreContext("item", token);
          this._emit(this._subject, this.RDF_FIRST, item, this._graph);
        }
        return this._afterPath(token);
    }
  }
  // ### `_readForwardPath` reads a '!' path
  _readForwardPath(token) {
    let subject, predicate;
    const object = this._factory.blankNode();
    if ((predicate = this._readEntity(token)) === void 0)
      return;
    if (this._predicate === null)
      subject = this._subject, this._subject = object;
    else
      subject = this._object, this._object = object;
    this._emit(subject, predicate, object, this._graph);
    return this._readPath;
  }
  // ### `_readBackwardPath` reads a '^' path
  _readBackwardPath(token) {
    const subject = this._factory.blankNode();
    let predicate, object;
    if ((predicate = this._readEntity(token)) === void 0)
      return;
    if (this._predicate === null)
      object = this._subject, this._subject = subject;
    else
      object = this._object, this._object = subject;
    this._emit(subject, predicate, object, this._graph);
    return this._readPath;
  }
  // ### `_readTripleTermTail` reads the end of a triple term
  _readTripleTermTail(token) {
    if (token.type !== ")>>")
      return this._error(`Expected )>> but got ${token.type}`, token);
    const quad2 = this._factory.quad(
      this._subject,
      this._predicate,
      this._object,
      this._graph || this.DEFAULTGRAPH
    );
    this._restoreContext("<<(", token);
    if (this._subject === null) {
      this._subject = quad2;
      return this._readPredicate;
    } else {
      this._object = quad2;
      return this._getContextEndReader();
    }
  }
  // ### `_readReifiedTripleTailOrReifier` reads a reifier or the end of a nested reified triple
  _readReifiedTripleTailOrReifier(token) {
    if (token.type === "~") {
      return this._readReifier;
    }
    return this._readReifiedTripleTail(token);
  }
  // ### `_readReifiedTripleTail` reads the end of a nested reified triple
  _readReifiedTripleTail(token) {
    if (token.type !== ">>")
      return this._error(`Expected >> but got ${token.type}`, token);
    this._tripleTerm = null;
    const reifier = this._readTripleTerm();
    this._restoreContext("<<", token);
    const stack = this._contextStack, parent = stack.length && stack[stack.length - 1];
    if (parent && parent.type === "list") {
      this._emit(this._subject, this.RDF_FIRST, reifier, this._graph);
      return this._getContextEndReader();
    } else if (this._subject === null) {
      this._subject = reifier;
      return this._readPredicateOrReifierTripleEnd;
    } else {
      this._object = reifier;
      return this._getContextEndReader();
    }
  }
  _readPredicateOrReifierTripleEnd(token) {
    if (token.type === ".") {
      this._subject = null;
      return this._readPunctuation(token);
    }
    return this._readPredicate(token);
  }
  // ### `_readReifier` reads the triple term identifier after a tilde when in a reifying triple.
  _readReifier(token) {
    this._reifier = this._readEntity(token);
    return this._readReifiedTripleTail;
  }
  // ### `_readReifier` reads the optional triple term identifier after a tilde when in annotation syntax.
  _readReifierInAnnotation(token) {
    if (token.type === "IRI" || token.type === "typeIRI" || token.type === "type" || token.type === "prefixed" || token.type === "blank" || token.type === "var") {
      this._reifier = this._readEntity(token);
      return this._readPunctuation;
    }
    this._readTripleTerm();
    this._subject = null;
    return this._readPunctuation(token);
  }
  _readTripleTerm() {
    const stack = this._contextStack, parent = stack.length && stack[stack.length - 1];
    const parentGraph = parent ? parent.graph : void 0;
    const reifier = this._reifier || this._factory.blankNode();
    this._reifier = null;
    this._tripleTerm = this._tripleTerm || this._factory.quad(this._subject, this._predicate, this._object);
    this._emit(reifier, this.RDF_REIFIES, this._tripleTerm, parentGraph || this.DEFAULTGRAPH);
    return reifier;
  }
  // ### `_getContextEndReader` gets the next reader function at the end of a context
  _getContextEndReader() {
    const contextStack = this._contextStack;
    if (!contextStack.length)
      return this._readPunctuation;
    switch (contextStack[contextStack.length - 1].type) {
      case "blank":
        return this._readBlankNodeTail;
      case "list":
        return this._readListItem;
      case "formula":
        return this._readFormulaTail;
      case "<<(":
        return this._readTripleTermTail;
      case "<<":
        return this._readReifiedTripleTailOrReifier;
    }
  }
  // ### `_emit` sends a quad through the callback
  _emit(subject, predicate, object, graph) {
    this._callback(null, this._factory.quad(subject, predicate, object, graph || this.DEFAULTGRAPH));
  }
  // ### `_error` emits an error message through the callback
  _error(message, token) {
    const err = new Error(`${message} on line ${token.line}.`);
    err.context = {
      token,
      line: token.line,
      previousToken: this._lexer.previousToken
    };
    this._callback(err);
    this._callback = noop;
  }
  // ### `_resolveIRI` resolves an IRI against the base path
  _resolveIRI(iri2) {
    return /^[a-z][a-z0-9+.-]*:/i.test(iri2) ? iri2 : this._resolveRelativeIRI(iri2);
  }
  // ### `_resolveRelativeIRI` resolves an IRI against the base path,
  // assuming that a base path has been set and that the IRI is indeed relative
  _resolveRelativeIRI(iri2) {
    if (!iri2.length)
      return this._base;
    switch (iri2[0]) {
      // Resolve relative fragment IRIs against the base IRI
      case "#":
        return this._base + iri2;
      // Resolve relative query string IRIs by replacing the query string
      case "?":
        return this._base.replace(/(?:\?.*)?$/, iri2);
      // Resolve root-relative IRIs at the root of the base IRI
      case "/":
        return (iri2[1] === "/" ? this._baseScheme : this._baseRoot) + this._removeDotSegments(iri2);
      // Resolve all other IRIs at the base IRI's path
      default:
        return /^[^/:]*:/.test(iri2) ? null : this._removeDotSegments(this._basePath + iri2);
    }
  }
  // ### `_removeDotSegments` resolves './' and '../' path segments in an IRI as per RFC3986
  _removeDotSegments(iri2) {
    if (!/(^|\/)\.\.?($|[/#?])/.test(iri2))
      return iri2;
    const length = iri2.length;
    let result = "", i = -1, pathStart = -1, segmentStart = 0, next = "/";
    while (i < length) {
      switch (next) {
        // The path starts with the first slash after the authority
        case ":":
          if (pathStart < 0) {
            if (iri2[++i] === "/" && iri2[++i] === "/")
              while ((pathStart = i + 1) < length && iri2[pathStart] !== "/")
                i = pathStart;
          }
          break;
        // Don't modify a query string or fragment
        case "?":
        case "#":
          i = length;
          break;
        // Handle '/.' or '/..' path segments
        case "/":
          if (iri2[i + 1] === ".") {
            next = iri2[++i + 1];
            switch (next) {
              // Remove a '/.' segment
              case "/":
                result += iri2.substring(segmentStart, i - 1);
                segmentStart = i + 1;
                break;
              // Remove a trailing '/.' segment
              case void 0:
              case "?":
              case "#":
                return result + iri2.substring(segmentStart, i) + iri2.substr(i + 1);
              // Remove a '/..' segment
              case ".":
                next = iri2[++i + 1];
                if (next === void 0 || next === "/" || next === "?" || next === "#") {
                  result += iri2.substring(segmentStart, i - 2);
                  if ((segmentStart = result.lastIndexOf("/")) >= pathStart)
                    result = result.substr(0, segmentStart);
                  if (next !== "/")
                    return `${result}/${iri2.substr(i + 1)}`;
                  segmentStart = i + 1;
                }
            }
          }
      }
      next = iri2[++i];
    }
    return result + iri2.substring(segmentStart);
  }
  // ## Public methods
  // ### `parse` parses the N3 input and emits each parsed quad through the onQuad callback.
  parse(input, quadCallback, prefixCallback, versionCallback) {
    let onQuad, onPrefix, onComment, onVersion;
    if (quadCallback && (quadCallback.onQuad || quadCallback.onPrefix || quadCallback.onComment || quadCallback.onVersion)) {
      onQuad = quadCallback.onQuad;
      onPrefix = quadCallback.onPrefix;
      onComment = quadCallback.onComment;
      onVersion = quadCallback.onVersion;
    } else {
      onQuad = quadCallback;
      onPrefix = prefixCallback;
      onVersion = versionCallback;
    }
    this._readCallback = this._readBeforeTopContext;
    this._sparqlStyle = false;
    this._prefixes = /* @__PURE__ */ Object.create(null);
    this._prefixes._ = this._blankNodePrefix ? this._blankNodePrefix.substr(2) : `b${blankNodePrefix++}_`;
    this._prefixCallback = onPrefix || noop;
    this._versionCallback = onVersion || noop;
    this._inversePredicate = false;
    this._quantified = /* @__PURE__ */ Object.create(null);
    if (!onQuad) {
      const quads = [];
      let error;
      this._callback = (e, t) => {
        e ? error = e : t && quads.push(t);
      };
      this._lexer.tokenize(input).every((token) => {
        return this._readCallback = this._readCallback(token);
      });
      if (error) throw error;
      return quads;
    }
    let processNextToken = (error, token) => {
      if (error !== null)
        this._callback(error), this._callback = noop;
      else if (this._readCallback)
        this._readCallback = this._readCallback(token);
    };
    if (onComment) {
      this._lexer.comments = true;
      processNextToken = (error, token) => {
        if (error !== null)
          this._callback(error), this._callback = noop;
        else if (this._readCallback) {
          if (token.type === "comment")
            onComment(token.value);
          else
            this._readCallback = this._readCallback(token);
        }
      };
    }
    this._callback = onQuad;
    this._lexer.tokenize(input, processNextToken);
  }
};
function noop() {
}
function initDataFactory(parser, factory) {
  parser._factory = factory;
  parser.DEFAULTGRAPH = factory.defaultGraph();
  parser.RDF_FIRST = factory.namedNode(IRIs_default.rdf.first);
  parser.RDF_REST = factory.namedNode(IRIs_default.rdf.rest);
  parser.RDF_NIL = factory.namedNode(IRIs_default.rdf.nil);
  parser.RDF_REIFIES = factory.namedNode(IRIs_default.rdf.reifies);
  parser.N3_FORALL = factory.namedNode(IRIs_default.r.forAll);
  parser.N3_FORSOME = factory.namedNode(IRIs_default.r.forSome);
  parser.ABBREVIATIONS = {
    "a": factory.namedNode(IRIs_default.rdf.type),
    "=": factory.namedNode(IRIs_default.owl.sameAs),
    ">": factory.namedNode(IRIs_default.log.implies),
    "<": factory.namedNode(IRIs_default.log.isImpliedBy)
  };
  parser.QUANTIFIERS_GRAPH = factory.namedNode("urn:n3:quantifiers");
}
N3Parser.SUPPORTED_VERSIONS = [
  "1.2",
  "1.2-basic",
  "1.1"
];
initDataFactory(N3Parser.prototype, N3DataFactory_default);

// src/model.ts
var RdfHtmlError = class extends Error {
  issues;
  constructor(message, issues = []) {
    super(message);
    this.name = "RdfHtmlError";
    this.issues = issues;
  }
};

// src/parse.ts
function sameTerm(left, right) {
  return left.equals(right);
}
function objects(dataset, subject, predicate) {
  const predicateNode = N3DataFactory_default.namedNode(predicate);
  const values = [];
  for (const quad2 of dataset) {
    if (sameTerm(quad2.subject, subject) && sameTerm(quad2.predicate, predicateNode) && !values.some((value) => sameTerm(value, quad2.object))) values.push(quad2.object);
  }
  return values;
}
function nodeId(node) {
  return node.termType === "NamedNode" ? node.value : `_:${node.value}`;
}
function isNode(term) {
  return term.termType === "NamedNode" || term.termType === "BlankNode";
}
var ArrayDataset = class _ArrayDataset {
  #quads;
  constructor(quads) {
    this.#quads = [...quads];
  }
  get size() {
    return this.#quads.length;
  }
  [Symbol.iterator]() {
    return this.#quads[Symbol.iterator]();
  }
  add(quad2) {
    if (!this.has(quad2)) this.#quads.push(quad2);
    return this;
  }
  delete(quad2) {
    this.#quads = this.#quads.filter((candidate) => !candidate.equals(quad2));
    return this;
  }
  has(quad2) {
    return this.#quads.some((candidate) => candidate.equals(quad2));
  }
  match(subject, predicate, object, graph) {
    return new _ArrayDataset(this.#quads.filter((quad2) => (!subject || quad2.subject.equals(subject)) && (!predicate || quad2.predicate.equals(predicate)) && (!object || quad2.object.equals(object)) && (!graph || quad2.graph.equals(graph))));
  }
};
function findHtmlDocuments(dataset) {
  const type = N3DataFactory_default.namedNode(TERMS.rdfType);
  const documentClass = N3DataFactory_default.namedNode(TERMS.document);
  const documents = [];
  const seen = /* @__PURE__ */ new Set();
  for (const quad2 of dataset) {
    if (!sameTerm(quad2.predicate, type) || !sameTerm(quad2.object, documentClass) || !isNode(quad2.subject)) continue;
    const id = nodeId(quad2.subject);
    if (seen.has(id)) continue;
    seen.add(id);
    const bases = objects(dataset, quad2.subject, TERMS.base).filter((term) => term.termType === "NamedNode");
    const titles = objects(dataset, quad2.subject, TERMS.title).filter((term) => term.termType === "Literal");
    const baseIRI = bases.length === 1 ? bases[0].value : "";
    documents.push({
      baseIRI,
      label: titles[0]?.value || (quad2.subject.termType === "NamedNode" ? quad2.subject.value : id),
      node: quad2.subject,
      nodeId: id
    });
  }
  return documents.sort((left, right) => left.label.localeCompare(right.label));
}
function normalizedContentType(value) {
  const type = value?.split(";", 1)[0]?.trim().toLowerCase();
  if (type === "application/trig" || type === "application/x-trig") return "application/trig";
  return "text/turtle";
}
function parseRdfHtml(source, options) {
  const contentType = normalizedContentType(options.contentType);
  let quads;
  try {
    const parser = new N3Parser({ baseIRI: options.baseIRI, format: contentType });
    quads = parser.parse(source);
  } catch (error) {
    throw new RdfHtmlError(`Could not parse ${contentType === "application/trig" ? "TriG" : "Turtle"}: ${error instanceof Error ? error.message : String(error)}`);
  }
  const dataset = new ArrayDataset(quads);
  return { contentType, dataset, documents: findHtmlDocuments(dataset) };
}

// src/render.ts
function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function escapeAttribute2(value) {
  return escapeHtml(value).replaceAll('"', "&quot;");
}
function sameTerm2(left, right) {
  return left.equals(right);
}
function isNode2(term) {
  return term.termType === "NamedNode" || term.termType === "BlankNode";
}
function termLabel(term) {
  if (term.termType === "NamedNode") return `<${term.value}>`;
  if (term.termType === "BlankNode") return `_:${term.value}`;
  return `${term.termType}(${term.value})`;
}
function uniqueTerms(quads) {
  const values = [];
  for (const quad2 of quads) {
    if (!values.some((value) => sameTerm2(value, quad2.object))) values.push(quad2.object);
  }
  return values;
}
var Renderer = class {
  #quads;
  #consumed = /* @__PURE__ */ new Set();
  #warnings = [];
  #parents = /* @__PURE__ */ new Map();
  constructor(dataset) {
    this.#quads = Array.from(dataset);
  }
  #matches(subject, predicate, object) {
    const predicateNode = predicate ? N3DataFactory_default.namedNode(predicate) : null;
    return this.#quads.filter((quad2) => (!subject || sameTerm2(quad2.subject, subject)) && (!predicateNode || sameTerm2(quad2.predicate, predicateNode)) && (!object || sameTerm2(quad2.object, object)));
  }
  #consume(quads) {
    for (const quad2 of quads) this.#consumed.add(quad2);
  }
  #singleObject(node, predicate, required, kind) {
    const quads = this.#matches(node, predicate, null);
    const values = uniqueTerms(quads);
    if (values.length === 0 && !required) return null;
    if (values.length !== 1) {
      throw new RdfHtmlError(`${termLabel(node)} must have ${required ? "exactly" : "at most"} one <${predicate}> value.`);
    }
    const value = values[0];
    if (kind && value.termType !== kind) throw new RdfHtmlError(`${termLabel(node)} <${predicate}> must be a ${kind}.`);
    this.#consume(quads);
    return value;
  }
  #structuralType(node) {
    const typeQuads = this.#matches(node, TERMS.rdfType, null);
    const candidates = /* @__PURE__ */ new Map();
    for (const quad2 of typeQuads) {
      if (quad2.object.termType !== "NamedNode") continue;
      const definition = ELEMENT_BY_CLASS_IRI.get(quad2.object.value);
      if (definition) {
        const candidate2 = candidates.get(quad2.object.value) ?? { classIri: quad2.object.value, definition, quads: [] };
        candidate2.quads.push(quad2);
        candidates.set(quad2.object.value, candidate2);
        continue;
      }
      if ([TERMS.document, TERMS.documentType, TERMS.text, TERMS.comment, `${RDFHTML}CustomElement`].includes(quad2.object.value)) {
        const candidate2 = candidates.get(quad2.object.value) ?? { classIri: quad2.object.value, definition: null, quads: [] };
        candidate2.quads.push(quad2);
        candidates.set(quad2.object.value, candidate2);
      }
    }
    if (candidates.size !== 1) {
      throw new RdfHtmlError(`${termLabel(node)} must have exactly one supported RDF/HTML node class.`);
    }
    const candidate = Array.from(candidates.values())[0];
    this.#consume(candidate.quads);
    return candidate;
  }
  #hasType(node, classIri) {
    return this.#matches(node, TERMS.rdfType, N3DataFactory_default.namedNode(classIri)).length > 0;
  }
  #assertLeaf(node) {
    if (this.#matches(node, TERMS.children, null).length > 0 || this.#matches(node, TERMS.hasChild, null).length > 0 || this.#matches(null, TERMS.childOf, node).length > 0) {
      throw new RdfHtmlError(`${termLabel(node)} is not a container and cannot have child nodes.`);
    }
  }
  #listedChildren(parent) {
    const links = this.#matches(parent, TERMS.children, null);
    if (links.length === 0) return null;
    const heads = uniqueTerms(links);
    if (heads.length !== 1) throw new RdfHtmlError(`${termLabel(parent)} must have at most one rdfhtml:children list.`);
    this.#consume(links);
    const members = [];
    const memberIds = /* @__PURE__ */ new Set();
    const cells = /* @__PURE__ */ new Set();
    let current = heads[0];
    while (!sameTerm2(current, N3DataFactory_default.namedNode(TERMS.rdfNil))) {
      if (!isNode2(current)) throw new RdfHtmlError(`${termLabel(parent)} rdfhtml:children must point to a well-formed RDF list.`);
      const cellId = termLabel(current);
      if (cells.has(cellId)) throw new RdfHtmlError(`${termLabel(parent)} rdfhtml:children list contains an rdf:rest cycle.`);
      cells.add(cellId);
      const first = this.#matches(current, TERMS.rdfFirst, null);
      const rest = this.#matches(current, TERMS.rdfRest, null);
      const firstValues = uniqueTerms(first);
      const restValues = uniqueTerms(rest);
      if (firstValues.length !== 1 || restValues.length !== 1) {
        throw new RdfHtmlError(`${termLabel(parent)} rdfhtml:children list cell ${cellId} must have exactly one rdf:first and one rdf:rest.`);
      }
      if (!isNode2(firstValues[0]) || !isNode2(restValues[0])) {
        throw new RdfHtmlError(`${termLabel(parent)} rdfhtml:children list must contain only resource child nodes and resource list links.`);
      }
      this.#consume([...first, ...rest]);
      this.#consume(this.#matches(current, TERMS.rdfType, N3DataFactory_default.namedNode(TERMS.rdfList)));
      const member = firstValues[0];
      const memberId = termLabel(member);
      if (memberIds.has(memberId)) throw new RdfHtmlError(`${termLabel(parent)} rdfhtml:children list repeats ${memberId}.`);
      memberIds.add(memberId);
      members.push(member);
      current = restValues[0];
    }
    return members;
  }
  #childNodes(parent) {
    const listed = this.#listedChildren(parent);
    const childQuads = this.#matches(parent, TERMS.hasChild, null);
    const childOfQuads = this.#matches(null, TERMS.childOf, parent);
    if (listed === null && childQuads.length === 0 && childOfQuads.length === 0) return [];
    if (childQuads.some((quad2) => !isNode2(quad2.object))) {
      throw new RdfHtmlError(`${termLabel(parent)} has a non-resource rdfhtml:hasChild value.`);
    }
    if (childOfQuads.some((quad2) => !isNode2(quad2.subject))) {
      throw new RdfHtmlError(`${termLabel(parent)} has a non-resource inverse rdfhtml:childOf subject.`);
    }
    this.#consume([...childQuads, ...childOfQuads]);
    const byId = /* @__PURE__ */ new Map();
    const pending = [];
    for (const child of [
      ...listed ?? [],
      ...childQuads.map((quad2) => quad2.object),
      ...childOfQuads.map((quad2) => quad2.subject)
    ]) {
      const id = termLabel(child);
      if (!byId.has(id)) pending.push(child);
      byId.set(id, child);
    }
    const immediateEdges = /* @__PURE__ */ new Map();
    const precedenceEdges = /* @__PURE__ */ new Map();
    for (let index = 1; index < (listed?.length ?? 0); index += 1) {
      const from = listed[index - 1];
      const to = listed[index];
      const key = `${termLabel(from)}\0${termLabel(to)}`;
      immediateEdges.set(key, { from, to });
      precedenceEdges.set(key, { from, to });
    }
    const expanded = /* @__PURE__ */ new Set();
    while (pending.length > 0) {
      const current = pending.shift();
      const id = termLabel(current);
      if (expanded.has(id)) continue;
      expanded.add(id);
      const connected = [
        ...this.#matches(current, TERMS.immediatelyPrecedes, null).map((quad2) => ({ quad: quad2, from: quad2.subject, to: quad2.object, immediate: true })),
        ...this.#matches(null, TERMS.immediatelyPrecedes, current).map((quad2) => ({ quad: quad2, from: quad2.subject, to: quad2.object, immediate: true })),
        ...this.#matches(current, TERMS.immediatelyFollows, null).map((quad2) => ({ quad: quad2, from: quad2.object, to: quad2.subject, immediate: true })),
        ...this.#matches(null, TERMS.immediatelyFollows, current).map((quad2) => ({ quad: quad2, from: quad2.object, to: quad2.subject, immediate: true })),
        ...this.#matches(current, TERMS.precedes, null).map((quad2) => ({ quad: quad2, from: quad2.subject, to: quad2.object, immediate: false })),
        ...this.#matches(null, TERMS.precedes, current).map((quad2) => ({ quad: quad2, from: quad2.subject, to: quad2.object, immediate: false })),
        ...this.#matches(current, TERMS.follows, null).map((quad2) => ({ quad: quad2, from: quad2.object, to: quad2.subject, immediate: false })),
        ...this.#matches(null, TERMS.follows, current).map((quad2) => ({ quad: quad2, from: quad2.object, to: quad2.subject, immediate: false }))
      ];
      this.#consume(connected.map(({ quad: quad2 }) => quad2));
      for (const edge of connected) {
        if (!isNode2(edge.from) || !isNode2(edge.to)) {
          throw new RdfHtmlError(`${id} has an ordering edge to a non-resource node.`);
        }
        const from = edge.from;
        const to = edge.to;
        const key = `${termLabel(from)}\0${termLabel(to)}`;
        precedenceEdges.set(key, { from, to });
        if (edge.immediate) immediateEdges.set(key, { from, to });
        for (const member of [from, to]) {
          const memberId = termLabel(member);
          if (!byId.has(memberId)) pending.push(member);
          byId.set(memberId, member);
        }
      }
    }
    const members = Array.from(byId.values());
    if (listed !== null) {
      const listedIds = new Set(listed.map(termLabel));
      const extras = members.filter((member) => !listedIds.has(termLabel(member)));
      if (extras.length > 0) {
        throw new RdfHtmlError(`${termLabel(parent)} rdfhtml:children is complete but flat assertions add ${extras.map(termLabel).join(", ")}.`);
      }
    }
    const immediateOutgoing = /* @__PURE__ */ new Map();
    const immediateIncoming = /* @__PURE__ */ new Map();
    for (const edge of immediateEdges.values()) {
      const from = termLabel(edge.from);
      const to = termLabel(edge.to);
      if (from === to) throw new RdfHtmlError(`${termLabel(parent)} contains a reflexive immediate-ordering edge.`);
      const existingSuccessor = immediateOutgoing.get(from);
      const existingPredecessor = immediateIncoming.get(to);
      if (existingSuccessor && !sameTerm2(existingSuccessor, edge.to) || existingPredecessor && !sameTerm2(existingPredecessor, edge.from)) {
        throw new RdfHtmlError(`${termLabel(parent)} has a branching or merging immediate child chain.`);
      }
      immediateOutgoing.set(from, edge.to);
      immediateIncoming.set(to, edge.from);
    }
    const blocks = [];
    const blockByMember = /* @__PURE__ */ new Map();
    const positionByMember = /* @__PURE__ */ new Map();
    for (const head of members.filter((member) => !immediateIncoming.has(termLabel(member)))) {
      const block = [];
      let current = head;
      while (current) {
        const id = termLabel(current);
        if (blockByMember.has(id)) throw new RdfHtmlError(`${termLabel(parent)} contains an immediate-ordering cycle.`);
        blockByMember.set(id, blocks.length);
        positionByMember.set(id, block.length);
        block.push(current);
        current = immediateOutgoing.get(id);
      }
      blocks.push(block);
    }
    if (blockByMember.size !== members.length) {
      throw new RdfHtmlError(`${termLabel(parent)} contains an immediate-ordering cycle.`);
    }
    const blockSuccessors = blocks.map(() => /* @__PURE__ */ new Set());
    const blockIndegrees = blocks.map(() => 0);
    for (const edge of precedenceEdges.values()) {
      const from = termLabel(edge.from);
      const to = termLabel(edge.to);
      if (from === to) throw new RdfHtmlError(`${termLabel(parent)} contains a reflexive precedence edge.`);
      const fromBlock = blockByMember.get(from);
      const toBlock = blockByMember.get(to);
      if (fromBlock === toBlock) {
        if (positionByMember.get(from) >= positionByMember.get(to)) {
          throw new RdfHtmlError(`${termLabel(parent)} has a broad precedence constraint that contradicts immediate adjacency.`);
        }
        continue;
      }
      if (!blockSuccessors[fromBlock].has(toBlock)) {
        blockSuccessors[fromBlock].add(toBlock);
        blockIndegrees[toBlock] += 1;
      }
    }
    const ready = blockIndegrees.flatMap((indegree, index) => indegree === 0 ? [index] : []);
    const orderedBlocks = [];
    while (orderedBlocks.length < blocks.length) {
      if (ready.length === 0) throw new RdfHtmlError(`${termLabel(parent)} contains a strict-ordering cycle.`);
      if (ready.length > 1) {
        throw new RdfHtmlError(`${termLabel(parent)} precedence constraints do not determine a unique child order.`);
      }
      const block = ready.pop();
      orderedBlocks.push(block);
      for (const successor of blockSuccessors[block]) {
        blockIndegrees[successor] -= 1;
        if (blockIndegrees[successor] === 0) ready.push(successor);
      }
    }
    const ordered = orderedBlocks.flatMap((block) => blocks[block]);
    const orderingTypes = this.#matches(parent, TERMS.rdfType, N3DataFactory_default.namedNode(TERMS.totalOrdering));
    this.#consume(orderingTypes);
    for (const member of members) {
      const comparableTypes = this.#matches(member, TERMS.rdfType, N3DataFactory_default.namedNode(TERMS.comparable));
      this.#consume(comparableTypes);
      const orderingMembership = this.#matches(member, TERMS.inOrdering, parent);
      this.#consume(orderingMembership);
      const id = termLabel(member);
      const existingParent = this.#parents.get(id);
      if (existingParent && existingParent !== termLabel(parent)) throw new RdfHtmlError(`${id} appears beneath more than one RDF/HTML parent.`);
      this.#parents.set(id, termLabel(parent));
    }
    return ordered;
  }
  #attributes(element) {
    const links = this.#matches(element, TERMS.attribute, null);
    this.#consume(links);
    const attributes = /* @__PURE__ */ new Map();
    const addAttribute = (name, value, namespace, node) => {
      if (!/^[^\s"'<>/=]+$/.test(name)) throw new RdfHtmlError(`Invalid HTML attribute name ${JSON.stringify(name)}.`);
      const identity = `${namespace?.value ?? ""}\0${name.toLowerCase()}`;
      const existing = attributes.get(identity);
      if (existing) {
        if (existing.value !== value) throw new RdfHtmlError(`${termLabel(element)} declares conflicting ${JSON.stringify(name)} attribute values.`);
        return;
      }
      if (namespace) throw new RdfHtmlError(`The string serializer cannot faithfully recreate the namespace binding for ${name} on ${node}.`);
      attributes.set(identity, { name, value });
    };
    const directByDefinition = /* @__PURE__ */ new Map();
    for (const quad2 of this.#matches(element, null, null)) {
      const definition = ATTRIBUTE_BY_DEFINITION_IRI.get(quad2.predicate.value);
      if (!definition) continue;
      const direct = directByDefinition.get(definition.definitionIri) ?? [];
      direct.push(quad2);
      directByDefinition.set(definition.definitionIri, direct);
    }
    for (const [definitionIri, direct] of directByDefinition) {
      const definition = ATTRIBUTE_BY_DEFINITION_IRI.get(definitionIri);
      this.#consume(direct);
      if (direct.some((quad2) => quad2.object.termType !== "Literal")) {
        throw new RdfHtmlError(`${termLabel(element)} <${definition.definitionIri}> must be an xsd:string literal.`);
      }
      const values = direct.map((quad2) => quad2.object).filter((value) => value.termType === "Literal");
      if (values.some((value) => value.language || value.datatype.value !== `${XSD}string`)) {
        throw new RdfHtmlError(`${termLabel(element)} <${definition.definitionIri}> must be an xsd:string literal without language or direction.`);
      }
      const distinctValues = new Set(values.map((value) => value.value));
      if (distinctValues.size !== 1) throw new RdfHtmlError(`${termLabel(element)} declares conflicting ${JSON.stringify(definition.localName)} attribute values.`);
      addAttribute(definition.localName, values[0].value, null, termLabel(element));
    }
    for (const link of links) {
      if (!isNode2(link.object)) throw new RdfHtmlError(`${termLabel(element)} has a non-resource rdfhtml:attribute value.`);
      const definition = this.#singleObject(link.object, TERMS.attributeDefinition, false, "NamedNode");
      const known = definition?.termType === "NamedNode" ? ATTRIBUTE_BY_DEFINITION_IRI.get(definition.value) : void 0;
      if (definition && !known) throw new RdfHtmlError(`${termLabel(link.object)} uses unknown HTML attribute definition ${termLabel(definition)}.`);
      const explicitName = this.#singleObject(link.object, TERMS.attributeName, !known, "Literal");
      if (known && explicitName && explicitName.value.toLowerCase() !== known.localName) {
        throw new RdfHtmlError(`${termLabel(link.object)} definition maps to ${JSON.stringify(known.localName)} but rdfhtml:attributeName is ${JSON.stringify(explicitName.value)}.`);
      }
      const name = known?.localName ?? explicitName?.value;
      const value = this.#singleObject(link.object, TERMS.attributeValue, true, "Literal");
      const namespace = this.#singleObject(link.object, TERMS.attributeNamespace, false);
      if (!name || !value || value.termType !== "Literal") continue;
      if (known && namespace) throw new RdfHtmlError(`${termLabel(link.object)} uses a known HTML attribute definition with a namespace.`);
      addAttribute(name, value.value, namespace, termLabel(link.object));
      const attributeTypes = this.#matches(link.object, TERMS.rdfType, N3DataFactory_default.namedNode(`${RDFHTML}Attribute`));
      this.#consume(attributeTypes);
    }
    return attributes.size ? ` ${Array.from(attributes.values(), ({ name, value }) => `${name}="${escapeAttribute2(value)}"`).join(" ")}` : "";
  }
  #renderNode(node, ancestors, rawTextTag) {
    const id = termLabel(node);
    if (ancestors.has(id)) throw new RdfHtmlError(`RDF/HTML child structure contains a cycle at ${id}.`);
    const nextAncestors = new Set(ancestors).add(id);
    const type = this.#structuralType(node);
    if (type.classIri === TERMS.text) {
      this.#assertLeaf(node);
      const data = this.#singleObject(node, TERMS.data, true, "Literal");
      const value = data?.value ?? "";
      if (rawTextTag) {
        if (new RegExp(`</${rawTextTag}(?:[\\s/>]|$)`, "i").test(value)) {
          throw new RdfHtmlError(`${id} contains a closing ${rawTextTag} sequence that cannot be serialized without changing the DOM.`);
        }
        return value;
      }
      return escapeHtml(value);
    }
    if (type.classIri === TERMS.comment) {
      this.#assertLeaf(node);
      const data = this.#singleObject(node, TERMS.data, true, "Literal");
      const value = data?.value ?? "";
      if (value.includes("--") || value.endsWith("-")) throw new RdfHtmlError(`${id} is not serializable as an HTML comment.`);
      return `<!--${value}-->`;
    }
    if (type.classIri === TERMS.documentType) {
      this.#assertLeaf(node);
      const name = this.#singleObject(node, TERMS.documentTypeName, true, "Literal");
      if (!name || !/^[A-Za-z][A-Za-z0-9:_-]*$/.test(name.value)) throw new RdfHtmlError(`${id} has an invalid document type name.`);
      return `<!doctype ${escapeAttribute2(name.value)}>`;
    }
    if (type.classIri === TERMS.document) {
      const children2 = this.#childNodes(node);
      if (children2.filter((child) => this.#hasType(child, `${RDFHTML}Html`)).length !== 1) {
        throw new RdfHtmlError(`${id} must contain exactly one rdfhtml:Html child.`);
      }
      if (children2.filter((child) => this.#hasType(child, TERMS.documentType)).length > 1) {
        throw new RdfHtmlError(`${id} must contain at most one rdfhtml:DocumentType child.`);
      }
      return children2.map((child) => this.#renderNode(child, nextAncestors)).join("");
    }
    let tagName = type.definition?.tagName;
    let kind = type.definition?.kind;
    if (type.classIri === `${RDFHTML}CustomElement`) {
      const localName = this.#singleObject(node, TERMS.localName, true, "Literal");
      tagName = localName?.value;
      kind = "normal";
      if (!tagName || !/^[a-z][.0-9_a-z-]*-[.0-9_a-z-]*$/.test(tagName)) throw new RdfHtmlError(`${id} has an invalid custom-element local name.`);
      const namespace = this.#singleObject(node, TERMS.namespace, false);
      if (namespace) throw new RdfHtmlError(`${id} is an HTML custom element and cannot declare a foreign namespace in the string serializer.`);
    }
    if (!tagName || !kind) throw new RdfHtmlError(`${id} has an unsupported RDF/HTML element class.`);
    const attributes = this.#attributes(node);
    const children = this.#childNodes(node);
    if (tagName === "html") {
      if (children.filter((child) => this.#hasType(child, `${RDFHTML}Head`)).length !== 1 || children.filter((child) => this.#hasType(child, `${RDFHTML}Body`)).length !== 1) {
        throw new RdfHtmlError(`${id} must contain exactly one rdfhtml:Head child and one rdfhtml:Body child.`);
      }
    }
    if (kind === "void") {
      if (children.length) throw new RdfHtmlError(`${id} is a void ${tagName} element and cannot have children.`);
      return `<${tagName}${attributes}>`;
    }
    const content = children.map((child) => this.#renderNode(child, nextAncestors, kind === "raw-text" ? tagName : void 0)).join("");
    return `<${tagName}${attributes}>${content}</${tagName}>`;
  }
  render(descriptor) {
    if (!descriptor.baseIRI) throw new RdfHtmlError(`${descriptor.nodeId} must declare exactly one named rdfhtml:base IRI.`);
    const baseQuads = this.#matches(descriptor.node, TERMS.base, null);
    const bases = uniqueTerms(baseQuads);
    if (bases.length !== 1 || bases[0].termType !== "NamedNode") {
      throw new RdfHtmlError(`${descriptor.nodeId} must declare exactly one named rdfhtml:base IRI.`);
    }
    this.#consume(baseQuads);
    const vocabularyQuads = this.#matches(descriptor.node, TERMS.conformsTo, N3DataFactory_default.namedNode(HTML_VOCABULARY_IRI));
    if (vocabularyQuads.length === 0) {
      throw new RdfHtmlError(`${descriptor.nodeId} must declare dcterms:conformsTo <${HTML_VOCABULARY_IRI}>.`);
    }
    this.#consume(vocabularyQuads);
    const html = this.#renderNode(descriptor.node, /* @__PURE__ */ new Set());
    const preservedQuads = this.#quads.filter((quad2) => !this.#consumed.has(quad2));
    const preservedHtml = quadsToHtmlRdf(preservedQuads);
    const publicationHtml = embedHtmlRdf(html, preservedHtml);
    return {
      baseIRI: descriptor.baseIRI,
      consumedQuads: this.#quads.filter((quad2) => this.#consumed.has(quad2)),
      descriptor,
      html,
      publicationHtml,
      preservedHtml,
      preservedQuads,
      warnings: this.#warnings
    };
  }
};
function embedHtmlRdf(html, preservedHtml) {
  if (!preservedHtml) return html;
  const opening = /<html(?:\s[^>]*)?>/i.exec(html);
  const htmlWithVersion = !opening || /\srdf-version\s*=/i.test(opening[0]) ? html : `${html.slice(0, opening.index + 5)} rdf-version="1.2"${html.slice(opening.index + 5)}`;
  const island = `<div hidden data-rdfhtml-preserved>
${preservedHtml}
</div>`;
  const lower = htmlWithVersion.toLowerCase();
  const bodyEnd = lower.lastIndexOf("</body>");
  if (bodyEnd >= 0) return `${htmlWithVersion.slice(0, bodyEnd)}${island}${htmlWithVersion.slice(bodyEnd)}`;
  const htmlEnd = lower.lastIndexOf("</html>");
  if (htmlEnd >= 0) return `${htmlWithVersion.slice(0, htmlEnd)}${island}${htmlWithVersion.slice(htmlEnd)}`;
  return `${htmlWithVersion}${island}`;
}
function renderRdfHtmlDocument(dataset, descriptor) {
  return new Renderer(dataset).render(descriptor);
}

// src/workspace.ts
function escapeHtml2(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function escapeAttribute3(value) {
  return escapeHtml2(value).replaceAll('"', "&quot;");
}
function injectPreviewContext(html, baseIRI) {
  const context = `<meta data-rdfhtml-runtime-context http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; form-action 'none'"><base data-rdfhtml-runtime-context href="${escapeAttribute3(baseIRI)}">`;
  const head = /<head(?:\s[^>]*)?>/i.exec(html);
  if (head?.index !== void 0) {
    const position = head.index + head[0].length;
    return `${html.slice(0, position)}${context}${html.slice(position)}`;
  }
  const root = /<html(?:\s[^>]*)?>/i.exec(html);
  if (root?.index !== void 0) {
    const position = root.index + root[0].length;
    return `${html.slice(0, position)}<head>${context}</head>${html.slice(position)}`;
  }
  return `<!doctype html><html rdf-version="1.2"><head>${context}</head><body>${html}</body></html>`;
}
function injectDocumentBase(html, baseIRI) {
  const base = `<base data-rdfhtml-runtime-context href="${escapeAttribute3(baseIRI)}">`;
  const head = /<head(?:\s[^>]*)?>/i.exec(html);
  if (head?.index !== void 0) {
    const position = head.index + head[0].length;
    return `${html.slice(0, position)}${base}${html.slice(position)}`;
  }
  const root = /<html(?:\s[^>]*)?>/i.exec(html);
  if (root?.index !== void 0) {
    const position = root.index + root[0].length;
    return `${html.slice(0, position)}<head>${base}</head>${html.slice(position)}`;
  }
  return `<!doctype html><html rdf-version="1.2"><head>${base}</head><body>${html}</body></html>`;
}
function issueMarkup(error) {
  if (error instanceof RdfHtmlError) return { message: error.message, issues: error.issues };
  return { message: error instanceof Error ? error.message : String(error), issues: [] };
}
function workspaceStyles() {
  return `
    :root { color-scheme: light; font-family: "Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", system-ui, sans-serif; }
    * { box-sizing: border-box; }
    body { background: oklch(98.5% 0.008 286); color: oklch(23% 0.035 286); margin: 0; min-height: 100vh; }
    a { color: inherit; }
    .shell { min-height: 100vh; }
    .bar { align-items: center; background: oklch(20% 0.075 294); color: oklch(97% 0.012 294); display: flex; gap: 1rem; justify-content: space-between; min-height: 4.25rem; padding: .8rem clamp(1rem, 3vw, 2.5rem); }
    .identity { align-items: baseline; display: flex; gap: .85rem; min-width: 0; }
    .mark { color: oklch(81% 0.15 135); font-size: 1.1rem; font-weight: 800; letter-spacing: -.04em; text-decoration: none; }
    .identity strong { font-size: .92rem; }
    .source { color: oklch(90% 0.065 294); display: block; font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; font-size: .7rem; max-width: min(50vw, 72ch); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .safety { color: oklch(90% 0.065 294); font-size: .72rem; margin: 0; white-space: nowrap; }
    .document-nav { align-items: stretch; background: oklch(94.5% 0.02 286); border-bottom: 1px solid oklch(84% 0.025 286); display: flex; gap: 0; overflow-x: auto; padding: 0 clamp(1rem, 3vw, 2.5rem); }
    .document-nav a { border-bottom: 2px solid transparent; color: oklch(47% 0.025 286); flex: 0 0 auto; font-size: .78rem; font-weight: 720; padding: .9rem 1rem .75rem; text-decoration: none; }
    .document-nav a:hover, .document-nav a:focus-visible { background: oklch(93% 0.035 294); color: oklch(30% 0.12 294); }
    .document-nav a:focus-visible { outline: 3px solid oklch(81% 0.15 135); outline-offset: -3px; }
    .workspace { padding: clamp(1rem, 3vw, 2.5rem); }
    .preview { display: none; }
    .preview--default { display: block; }
    .workspace:has(.preview:target) .preview--default { display: none; }
    .workspace .preview:target { display: block; }
    .preview-head { align-items: end; display: flex; gap: 1rem; justify-content: space-between; margin-bottom: .8rem; }
    .preview-head h1 { font-size: clamp(1.2rem, 2vw, 1.7rem); letter-spacing: -.035em; margin: 0; }
    .preview-head code { color: oklch(47% 0.025 286); font-size: .7rem; overflow-wrap: anywhere; }
    iframe { background: oklch(98.5% 0.008 286); border: 1px solid oklch(84% 0.025 286); border-radius: 10px; display: block; height: calc(100vh - 10.8rem); min-height: 28rem; width: 100%; }
    .error { border: 1px solid oklch(65% 0.14 25); border-radius: 10px; color: oklch(38% 0.12 25); max-width: 72ch; padding: 1.2rem; }
    .error h1 { font-size: 1.25rem; margin: 0 0 .6rem; }
    .error p { line-height: 1.55; margin: 0; }
    @media (max-width: 700px) {
      .bar { align-items: flex-start; flex-direction: column; gap: .35rem; }
      .safety { white-space: normal; }
      .source { max-width: 88vw; }
      .workspace { padding-inline: .75rem; }
      .preview-head { align-items: start; flex-direction: column; gap: .3rem; }
      iframe { height: calc(100vh - 13.5rem); }
    }
  `;
}
function renderSource(source, options) {
  const parsed = parseRdfHtml(source, { baseIRI: options.sourceUrl, ...options.contentType ? { contentType: options.contentType } : {} });
  if (parsed.documents.length === 0) throw new RdfHtmlError("The RDF dataset does not define an rdfhtml:Document.");
  const outcomes = parsed.documents.map((descriptor) => {
    try {
      return { descriptor, rendered: renderRdfHtmlDocument(parsed.dataset, descriptor), error: null };
    } catch (error) {
      return { descriptor, rendered: null, error: issueMarkup(error) };
    }
  });
  const consumed = /* @__PURE__ */ new Set();
  for (const outcome of outcomes) for (const quad2 of outcome.rendered?.consumedQuads ?? []) consumed.add(quad2);
  const remaining = Array.from(parsed.dataset).filter((quad2) => !consumed.has(quad2));
  return { outcomes, preservedHtml: quadsToHtmlRdf(remaining) };
}
function renderedPage(outcome, preservedHtml) {
  if (outcome.error) {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml2(outcome.descriptor.label)}</title></head><body><main><h1>${escapeHtml2(outcome.descriptor.label)}</h1><p>${escapeHtml2(outcome.error.message)}</p></main></body></html>`;
  }
  return injectDocumentBase(embedHtmlRdf(outcome.rendered.html, preservedHtml), outcome.rendered.baseIRI);
}
function activeWorkspaceStyles() {
  return `
    :root { color-scheme: light; font-family: "Avenir Next", Avenir, "Segoe UI Variable", "Segoe UI", system-ui, sans-serif; }
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; }
    body { background: oklch(98.5% 0.008 286); display: grid; grid-template-rows: auto minmax(0, 1fr); }
    .selector { align-items: center; background: oklch(94.5% 0.02 286); border-bottom: 1px solid oklch(84% 0.025 286); display: grid; gap: .6rem; grid-template-columns: auto minmax(12rem, 1fr) auto; padding: .7rem clamp(.75rem, 3vw, 2rem); }
    label { color: oklch(47% 0.025 286); font-size: .72rem; font-weight: 750; }
    select, button { border: 1px solid oklch(84% 0.025 286); border-radius: 8px; color: oklch(23% 0.035 286); font: inherit; min-height: 2.55rem; }
    select { background: oklch(98.5% 0.008 286); padding: .4rem .7rem; width: 100%; }
    button { background: oklch(20% 0.075 294); color: oklch(97% 0.012 294); cursor: pointer; font-size: .76rem; font-weight: 750; padding: .5rem 1rem; }
    select:focus-visible, button:focus-visible { outline: 3px solid oklch(55% 0.17 294); outline-offset: 2px; }
    iframe { background: oklch(98.5% 0.008 286); border: 0; display: block; height: 100%; width: 100%; }
    @media (max-width: 540px) { .selector { grid-template-columns: 1fr auto; } label { grid-column: 1 / -1; } }
  `;
}
function renderRdfHtmlPage(source, options) {
  const { outcomes, preservedHtml } = renderSource(source, options);
  const pages = outcomes.map((outcome) => renderedPage(outcome, preservedHtml));
  if (pages.length === 1) return pages[0];
  const optionsMarkup = outcomes.map((outcome, index) => `<option value="${index}" data-document="${escapeAttribute3(pages[index])}">${escapeHtml2(outcome.descriptor.label)}</option>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Choose an RDF/HTML document</title>
  <style>${activeWorkspaceStyles()}</style>
</head>
<body>
  <form class="selector" id="document-selector">
    <label for="document">Document</label>
    <select id="document" name="document">${optionsMarkup}</select>
    <button type="submit">Open</button>
  </form>
  <iframe id="rendered-document" title="Rendered ${escapeAttribute3(outcomes[0].descriptor.label)}" srcdoc="${escapeAttribute3(pages[0])}"></iframe>
  <script>const selector = document.querySelector("#document-selector"); const frame = document.querySelector("#rendered-document"); selector.addEventListener("submit", (event) => { event.preventDefault(); const option = selector.elements.document.selectedOptions[0]; frame.srcdoc = option.dataset.document; frame.title = "Rendered " + option.textContent; });</script>
</body>
</html>`;
}
function renderRdfHtmlWorkspace(source, options) {
  const { outcomes, preservedHtml } = renderSource(source, options);
  const navigation = outcomes.length > 1 ? `<nav class="document-nav" aria-label="HTML documents">${outcomes.map((outcome, index) => `<a href="#rdfhtml-document-${index + 1}">${escapeHtml2(outcome.descriptor.label)}</a>`).join("")}</nav>` : "";
  const previews = outcomes.map((outcome, index) => {
    const classes = `preview${index === 0 ? " preview--default" : ""}`;
    if (outcome.error) {
      return `<section class="${classes}" id="rdfhtml-document-${index + 1}"><div class="error" role="alert"><h1>${escapeHtml2(outcome.descriptor.label)}</h1><p>${escapeHtml2(outcome.error.message)}</p></div></section>`;
    }
    const html = embedHtmlRdf(outcome.rendered.html, preservedHtml);
    const preview = injectPreviewContext(html, outcome.rendered.baseIRI);
    return `<section class="${classes}" id="rdfhtml-document-${index + 1}" aria-labelledby="rdfhtml-title-${index + 1}"><header class="preview-head"><h1 id="rdfhtml-title-${index + 1}">${escapeHtml2(outcome.descriptor.label)}</h1><code>${escapeHtml2(outcome.rendered.baseIRI)}</code></header><iframe title="Rendered ${escapeAttribute3(outcome.descriptor.label)}" sandbox referrerpolicy="no-referrer" srcdoc="${escapeAttribute3(preview)}"></iframe></section>`;
  }).join("");
  return `<!doctype html>
<html lang="en" rdf-version="1.2">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; frame-src 'self'; base-uri 'none'; form-action 'none'">
  <title>${escapeHtml2(options.title ?? "RDF/HTML renderer")}</title>
  <style>${workspaceStyles()}</style>
</head>
<body>
  <div class="shell">
    <header class="bar">
      <div class="identity"><a class="mark" href="https://ia2.dev/" aria-label="IA squared home">IA\xB2</a><div><strong>RDF/HTML</strong><span class="source" title="${escapeAttribute3(options.sourceUrl)}">${escapeHtml2(options.sourceUrl)}</span></div></div>
      <p class="safety">Inert preview. Scripts, forms, nested frames, and network loads are blocked.</p>
    </header>
    ${navigation}
    <main class="workspace">${previews}</main>
  </div>
  <div hidden data-rdfhtml-source>${preservedHtml}</div>
</body>
</html>`;
}
export {
  ATTRIBUTE_BY_DEFINITION_IRI,
  ATTRIBUTE_BY_LOCAL_NAME,
  DCTERMS,
  ELEMENT_BY_CLASS_IRI,
  HTML_ATTRIBUTES,
  HTML_ATTRIBUTE_CROSS_CHECK_EXCEPTIONS,
  HTML_ATTRIBUTE_INDEX_EXCLUSION,
  HTML_CLASSIFICATION_CROSS_CHECK_EXCEPTIONS,
  HTML_CONTENT_CATEGORIES,
  HTML_ELEMENTS,
  HTML_SNAPSHOT_DATE,
  HTML_SNAPSHOT_SOURCE,
  HTML_SNAPSHOT_SOURCES,
  HTML_SPECIAL_CATEGORY_PARTICIPANTS,
  HTML_SYNTAX_KINDS,
  HTML_VOCABULARY_IRI,
  ORD,
  RDF,
  RDFHTML,
  RdfHtmlError,
  TERMS,
  VOID_ELEMENTS,
  XSD,
  embedHtmlRdf,
  findHtmlDocuments,
  htmlDocumentToRdfHtml,
  parseRdfHtml,
  quadsToHtmlRdf,
  renderRdfHtmlDocument,
  renderRdfHtmlPage,
  renderRdfHtmlWorkspace
};
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
