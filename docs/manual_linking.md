# Manual Linking Instructions

If you use earlier version of React Native or your project do not support autolinking for some reason you can manually link this library to your project, to do so, please, follow these steps:

## Android

1. Install library, if you haven't installed it yet
```sh
yarn add react-native-adapty
```

or 

```sh
npm i react-native-adapty --save
```

2. Add implementation to your `android/settings.gradle`:

```gradle
include ':react-native-adapty'
project(':react-native-adapty').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-adapty/lib/android/')
```

3. Make sure you have kotlin dependency in your `android/build.gradle`:

```diff
buildscript {
  ...
  dependencies {
    ...
  + classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:1.4.0"
  }
}
```

4. Link AdaptyPackage to your packages in `android/app/src/main/java/MainApplication.java`: 

```diff
... 
+ import com.rnadapty.react.AdaptyPackage; // <- Import this package

public class MainApplication extends Application implements ReactApplication {
  ...
  @Override
  protected List<ReactPackage> getPackages() {
    @SuppressWarnings("UnnecessaryLocalVariable")
    List<ReactPackage> packages = new PackageList(this).getPackages();

    ...
  + packages.add(new AdaptyPackage()); // <- Add AdaptyPackage here

    return packages;
  }
  ...
```

5. Enable multiDex in `android/app/build.gradle`:

```diff
// android/app/build.gradle

...
android {
  ...
  defaultConfig {
    ...
  + multiDexEnabled true
  }
}
```

6. All set! 🎉