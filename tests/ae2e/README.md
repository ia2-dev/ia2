# Navigator application end-to-end tests

These tests run one browser-side Navigator contract in six environments:

- embedded Navigator in Chromium, Firefox, and WebKit through Playwright;
- the unpacked Chrome extension in Chromium's real MV3 extension runtime;
- the unpacked Firefox extension through `web-ext` and Playwright's Firefox;
- the unpacked Safari extension through `WKWebExtensionController` and an offscreen `WKWebView`.

The extension build used by the harness is written to `packages/browser-extension/dist-e2e`.
It adds localhost-only fixture access. Chrome invokes the production scripting entry point;
Firefox and Safari receive a main-world static content script for unattended startup.
Production builds remain click-to-run with only `activeTab` and `scripting`.

Run the complete matrix with:

```sh
npm run test:ae2e
```

The embedded and individual extension suites are also available as
`test:ae2e:navigator` and `test:ae2e:extension:{chrome,firefox,safari}`.
