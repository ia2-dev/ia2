plugins {
    kotlin("jvm") version "2.1.21"
    application
}

repositories { mavenCentral() }
dependencies {
    implementation("io.ktor:ktor-client-core-jvm:3.2.1")
    implementation("io.ktor:ktor-client-cio-jvm:3.2.1")
    implementation("org.jsoup:jsoup:1.22.2")
}
application { mainClass = "MainKt" }
kotlin { jvmToolchain(21) }
