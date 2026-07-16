# Live semantic workspace demo

This demo directory contains separate IA² HTML/RDF application spaces. Their
canonical identities connect across pages without combining unrelated graphs
inside one DOM. Interactive pages change their semantic DOM as application
state changes, so the RDF Navigator updates without a reload.

## Run

Build the Navigator, then serve the repository root:

```sh
npm run build
npm run serve
```

Open <http://localhost:8000/demos/live-workspace/>.

The demo has no application runtime dependencies. It imports the local browser
bundle at `../../packages/html-rdf-navigator/dist/html-rdf-navigator.js`.

## Interactions

- Issues: create, inline edit, delete, search, filter, and change status.
- Inbox: compose, send, read, star, archive, restore, search, and switch folders.
- Theme: switch between light and dark color schemes.
- RDF: open the Navigator to watch statements appear, change, and disappear as
  the interface is used.
- Knowledge model: filter visible layers, change a recorded latency decision,
  and resolve or reintroduce model-to-code drift.
