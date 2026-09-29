// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "HtmlRdfExample",
    platforms: [.macOS(.v13)],
    dependencies: [
        .package(url: "https://github.com/scinfu/SwiftSoup.git", from: "2.13.4")
    ],
    targets: [
        .executableTarget(name: "HtmlRdfExample", dependencies: ["SwiftSoup"])
    ]
)
