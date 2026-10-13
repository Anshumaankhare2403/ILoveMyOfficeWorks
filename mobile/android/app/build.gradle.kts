plugins {
    id("com.android.application")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.ilovemyofficeworks.ilovemyofficeworks"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = "com.ilovemyofficeworks.ilovemyofficeworks"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        // Uses the version code from pubspec.yaml. When using split APKs, 1000 * ABI_VERSION
        // is added automatically by Flutter. (https://developer.android.com/studio/build/configure-apk-splits#configure-APK-versions)
        // You can force using the value of versionCode by specifying the `-P force-version-code-ignoring-abi=true`
        // flag during build.
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    buildTypes {
        release {
            // TODO: Add your own signing config for the release build.
            // Signing with the debug keys for now, so `flutter run --release` works.
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}

// Automatically create branded APK copy with app name and version on release builds
tasks.register("packageBrandedReleaseApk") {
    doLast {
        val vName = flutter.versionName ?: "0.5.6"
        val brandedName = "ILoveMyOfficeWorks-v$vName.apk"

        val agpDir = layout.buildDirectory.dir("outputs/apk/release").get().asFile
        val agpApk = File(agpDir, "app-release.apk")
        if (agpApk.exists()) {
            val dest = File(agpDir, brandedName)
            agpApk.copyTo(dest, overwrite = true)
            println("🏷️ [Branded AGP APK]: Created ${dest.name} in ${agpDir.path}")
        }

        val flutterDir = layout.buildDirectory.dir("outputs/flutter-apk").get().asFile
        val flutterApk = File(flutterDir, "app-release.apk")
        if (flutterApk.exists()) {
            val dest = File(flutterDir, brandedName)
            flutterApk.copyTo(dest, overwrite = true)
            println("🏷️ [Branded Flutter APK]: Created ${dest.name} in ${flutterDir.path}")
        }
    }
}

tasks.matching { it.name == "assembleRelease" }.configureEach {
    finalizedBy("packageBrandedReleaseApk")
}

