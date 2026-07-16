# Live semantic workspace demo

This static demo combines an issue tracker and inbox with IA² `rdf-*` carriers.
Creating, editing, moving, and deleting application data changes the live
semantic DOM, so the RDF Navigator updates without a page reload.

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
