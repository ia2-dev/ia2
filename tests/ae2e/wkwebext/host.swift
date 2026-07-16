import AppKit
import Foundation
import WebKit

func emit(_ value: [String: Any], code: Int32) -> Never {
    if let data = try? JSONSerialization.data(withJSONObject: value, options: [.sortedKeys]),
       let text = String(data: data, encoding: .utf8) {
        print(text)
    }
    fflush(stdout)
    exit(code)
}

let arguments = CommandLine.arguments
guard arguments.count >= 3 else {
    emit(["ok": false, "error": "usage: host <extension-dir> <page-url> [timeout]"], code: 2)
}
let extensionDirectory = URL(fileURLWithPath: arguments[1], isDirectory: true)
guard let pageURL = URL(string: arguments[2]) else {
    emit(["ok": false, "error": "invalid page URL"], code: 2)
}
let timeout = arguments.count > 3 ? (Double(arguments[3]) ?? 45) : 45

final class Harness: NSObject, WKWebExtensionControllerDelegate, WKWebExtensionWindow,
                     WKWebExtensionTab, WKNavigationDelegate {
    var webView: WKWebView!
    var finished = false

    func webExtensionController(_ controller: WKWebExtensionController,
                                openWindowsFor context: WKWebExtensionContext) -> [any WKWebExtensionWindow] { [self] }
    func webExtensionController(_ controller: WKWebExtensionController,
                                focusedWindowFor context: WKWebExtensionContext) -> (any WKWebExtensionWindow)? { self }
    func tabs(for context: WKWebExtensionContext) -> [any WKWebExtensionTab] { [self] }
    func activeTab(for context: WKWebExtensionContext) -> (any WKWebExtensionTab)? { self }
    func webView(for context: WKWebExtensionContext) -> WKWebView? { webView }
    func url(for context: WKWebExtensionContext) -> URL? { webView?.url }
    func title(for context: WKWebExtensionContext) -> String? { webView?.title }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        emit(["ok": false, "error": "navigation failed: \(error.localizedDescription)"], code: 1)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        emit(["ok": false, "error": "provisional navigation failed: \(error.localizedDescription)"], code: 1)
    }

    func startPolling() {
        Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] timer in
            guard let self else { timer.invalidate(); return }
            self.poll()
        }
    }

    func poll() {
        if finished { return }
        webView.evaluateJavaScript("JSON.stringify(window.__IA2NavigatorAE2E || null)") { [weak self] result, _ in
            guard let self, let text = result as? String, text != "null",
                  let data = text.data(using: .utf8),
                  let payload = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else { return }
            guard payload["state"] as? String == "complete",
                  let report = payload["report"] as? [String: Any] else { return }
            self.finished = true
            let failed = (report["failed"] as? NSNumber)?.intValue ?? -1
            let passed = (report["passed"] as? NSNumber)?.intValue ?? -1
            let tag = report["tag"] as? String
            if failed == 0 && passed == 14 && tag == "ia2-extension-navigator" {
                emit(["ok": true, "report": report], code: 0)
            }
            emit(["ok": false, "error": "extension contract failed", "report": report], code: 1)
        }
    }
}

let harness = Harness()
let app = NSApplication.shared
app.setActivationPolicy(.accessory)

DispatchQueue.main.asyncAfter(deadline: .now() + timeout) {
    emit(["ok": false, "error": "timeout after \(timeout)s"], code: 3)
}

Task { @MainActor in
    do {
        let webExtension = try await WKWebExtension(resourceBaseURL: extensionDirectory)
        let context = WKWebExtensionContext(for: webExtension)
        let localPages = try WKWebExtension.MatchPattern(string: "http://127.0.0.1/*")
        context.setPermissionStatus(.grantedExplicitly, for: localPages)
        let controller = WKWebExtensionController(configuration: .nonPersistent())
        controller.delegate = harness
        try controller.load(context)

        let configuration = WKWebViewConfiguration()
        configuration.webExtensionController = controller
        let webView = WKWebView(frame: NSRect(x: 0, y: 0, width: 1280, height: 900), configuration: configuration)
        webView.navigationDelegate = harness
        harness.webView = webView

        let window = NSWindow(
            contentRect: NSRect(x: -3000, y: -3000, width: 1280, height: 900),
            styleMask: [.borderless], backing: .buffered, defer: false
        )
        window.contentView = webView
        window.orderFront(nil)
        controller.didOpenWindow(harness)
        controller.didOpenTab(harness)
        webView.load(URLRequest(url: pageURL))
        harness.startPolling()
    } catch {
        emit(["ok": false, "error": "setup failed: \(error.localizedDescription)"], code: 1)
    }
}

app.run()
