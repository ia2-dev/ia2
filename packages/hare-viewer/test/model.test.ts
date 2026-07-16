import { beforeEach, describe, expect, it } from "vitest";
import { getHareDomCarrier, readHareEnvelope, verifyHareRepresentation } from "../src/model.js";

const fixture = `<!doctype html>
<html lang="en" rdf-version="1.2">
  <head>
    <link rel="canonical" href="https://example.test/minimal.hare.html">
  </head>
  <body>
    <section id="manifest" hidden>
      <a href="https://ia2.dev/spec/resource-envelope#Envelope" rdf-subject="" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#manifest"></a>
      <a href="#manifest" rdf-subject="" rdf-predicate="https://ia2.dev/spec/resource-envelope#manifestGraph" rdf-graph="#manifest"></a>
      <a href="https://model-test.hare.invalid/" rdf-subject="" rdf-predicate="https://ia2.dev/spec/resource-envelope#virtualBase" rdf-graph="#manifest"></a>
      <a href="https://ia2.dev/spec/resource-envelope#HARE-0.1" rdf-subject="" rdf-predicate="http://purl.org/dc/terms/conformsTo" rdf-graph="#manifest"></a>
      <a href="https://ia2.dev/spec/resource-envelope#SelfViewingProfile" rdf-subject="" rdf-predicate="http://purl.org/dc/terms/conformsTo" rdf-graph="#manifest"></a>
      <a href="#hello" rdf-subject="" rdf-predicate="http://purl.org/dc/terms/hasPart" rdf-graph="#manifest"></a>
      <a href="#semantic" rdf-subject="" rdf-predicate="http://purl.org/dc/terms/hasPart" rdf-graph="#manifest"></a>
      <span rdf-subject="#hello" rdf-predicate="http://purl.org/dc/terms/title" rdf-graph="#manifest">Greeting</span>
      <a href="#hello-representation" rdf-subject="#hello" rdf-predicate="https://ia2.dev/spec/resource-envelope#representation" rdf-graph="#manifest"></a>
      <a href="https://ia2.dev/spec/resource-envelope#ByteRepresentation" rdf-subject="#hello-representation" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#manifest"></a>
      <data value="/hello.txt" rdf-subject="#hello-representation" rdf-predicate="http://purl.org/dc/terms/identifier" rdf-graph="#manifest"></data>
      <data value="text/plain; charset=utf-8" rdf-subject="#hello-representation" rdf-predicate="http://purl.org/dc/elements/1.1/format" rdf-graph="#manifest"></data>
      <data value="5" rdf-subject="#hello-representation" rdf-predicate="https://ia2.dev/spec/resource-envelope#byteLength" rdf-graph="#manifest"></data>
      <data value="sha256-LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ=" rdf-subject="#hello-representation" rdf-predicate="https://www.w3.org/2018/credentials#digestSRI" rdf-datatype="https://www.w3.org/2018/credentials#sriString" rdf-graph="#manifest"></data>
      <a href="#payload-hello" rdf-subject="#hello-representation" rdf-predicate="https://ia2.dev/spec/resource-envelope#carrier" rdf-graph="#manifest"></a>
      <span rdf-subject="#semantic" rdf-predicate="http://purl.org/dc/terms/title" rdf-graph="#manifest">Semantic greeting</span>
      <a href="#semantic-representation" rdf-subject="#semantic" rdf-predicate="https://ia2.dev/spec/resource-envelope#representation" rdf-graph="#manifest"></a>
      <a href="https://ia2.dev/spec/resource-envelope#DOMRepresentation" rdf-subject="#semantic-representation" rdf-predicate="http://www.w3.org/1999/02/22-rdf-syntax-ns#type" rdf-graph="#manifest"></a>
      <data value="/semantic.html" rdf-subject="#semantic-representation" rdf-predicate="http://purl.org/dc/terms/identifier" rdf-graph="#manifest"></data>
      <data value="text/html" rdf-subject="#semantic-representation" rdf-predicate="http://purl.org/dc/elements/1.1/format" rdf-graph="#manifest"></data>
      <a href="#semantic-content" rdf-subject="#semantic-representation" rdf-predicate="https://ia2.dev/spec/resource-envelope#carrier" rdf-graph="#manifest"></a>
    </section>
    <script id="payload-hello" type="application/octet-stream" data-encoding="base64">aGVsbG8=</script>
    <template id="semantic-content"><article><h1>Hello from DOM</h1></article></template>
  </body>
</html>`;

beforeEach(() => {
  document.documentElement.innerHTML = new DOMParser().parseFromString(fixture, "text/html").documentElement.innerHTML;
});

describe("HARE model", () => {
  it("reads the HTML/RDF manifest without a parallel JSON model", () => {
    const envelope = readHareEnvelope(document);
    expect(envelope.id).toBe("https://example.test/minimal.hare.html");
    expect(envelope.manifestGraph).toBe("https://example.test/minimal.hare.html#manifest");
    expect(envelope.virtualBase).toBe("https://model-test.hare.invalid/");
    expect(envelope.conformsTo).toEqual([
      "https://ia2.dev/spec/resource-envelope#HARE-0.1",
      "https://ia2.dev/spec/resource-envelope#SelfViewingProfile",
    ]);
    expect(envelope.profile).toBe("self-viewing");
    expect(envelope.representations).toHaveLength(2);
    expect(envelope.representations[0]).toEqual(expect.objectContaining({
      kind: "bytes",
      title: "Greeting",
      path: "/hello.txt",
      mediaType: "text/plain; charset=utf-8",
      byteLength: 5,
    }));
    expect(envelope.representations[1]).toEqual(expect.objectContaining({
      kind: "dom",
      title: "Semantic greeting",
      path: "/semantic.html",
      mediaType: "text/html",
    }));
  });

  it("uses the logical filename when an optional title is absent", () => {
    document.querySelector('[rdf-predicate="http://purl.org/dc/terms/title"]')?.remove();
    expect(readHareEnvelope(document).representations[0]?.title).toBe("hello.txt");
  });

  it("uses the retrieval IRI when no canonical location is available", () => {
    const page = new DOMParser().parseFromString(fixture, "text/html");
    page.querySelector('link[rel="canonical"]')?.remove();
    Object.defineProperty(page, "URL", {
      configurable: true,
      value: "https://example.test/retrieved/minimal.hare.html",
    });
    expect(readHareEnvelope(page).id).toBe("https://example.test/retrieved/minimal.hare.html");
  });

  it("decodes and verifies exact representation bytes", async () => {
    const digest = Uint8Array.from(atob("LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ="), (character) => character.charCodeAt(0));
    const digestBuffer = new ArrayBuffer(digest.byteLength);
    new Uint8Array(digestBuffer).set(digest);
    Object.defineProperty(globalThis, "crypto", {
      configurable: true,
      value: { subtle: { digest: async () => digestBuffer } },
    });
    const representation = readHareEnvelope(document).representations[0]!;
    if (representation.kind !== "bytes") throw new Error("Expected a byte representation.");
    const verified = await verifyHareRepresentation(representation, document);
    expect(new TextDecoder().decode(verified.bytes)).toBe("hello");
  });

  it("returns semantic HTML as parsed template DOM without decoding bytes", () => {
    const representation = readHareEnvelope(document).representations[1]!;
    if (representation.kind !== "dom") throw new Error("Expected a DOM representation.");
    const carrier = getHareDomCarrier(representation, document);
    expect(carrier.content.querySelector("h1")?.textContent).toBe("Hello from DOM");
  });

  it("requires a non-retrievable virtual base and a virtual URL for every DOM document", () => {
    const virtualBase = document.querySelector('[rdf-predicate="https://ia2.dev/spec/resource-envelope#virtualBase"]');
    virtualBase?.setAttribute("href", "https://example.com/");
    expect(() => readHareEnvelope(document)).toThrow(/virtualBase/);

    virtualBase?.setAttribute("href", "https://model-test.hare.invalid/");
    document.querySelector('[rdf-subject="#semantic-representation"][rdf-predicate="http://purl.org/dc/terms/identifier"]')?.remove();
    expect(() => readHareEnvelope(document)).toThrow(/must have a logical path and virtual URL/);
  });
});
