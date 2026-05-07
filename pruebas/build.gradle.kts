plugins {
    java
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("io.cucumber:cucumber-java:7.14.0")
    testImplementation("io.cucumber:cucumber-junit:7.14.0")
    testImplementation("junit:junit:4.13.2")
}

tasks.test {
    useJUnit()
}