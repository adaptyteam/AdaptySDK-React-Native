require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

# The native SDK version for both modes: spm_dependency and the CocoaPods pods published to the
# AdaptySDK-CocoaPods-Specs spec repo. Package.swift pins the same version.
adapty_ios_version = '4.2.2'

# Legacy CocoaPods integration of the native iOS SDK, opt-in via `adapty_disable_spm!`
# (ios/adapty_podfile.rb) in the Podfile, Expo: `iosDisableSPM`. `$AdaptyDisableSPM`, read here,
# is set by the helper or by hand (see adapty_podfile.rb).
# SPM (spm_dependency) is the default.
adapty_disable_spm = defined?($AdaptyDisableSPM) && $AdaptyDisableSPM == true

Pod::Spec.new do |s|
  s.name         = "react-native-adapty-sdk"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-adapty
                   DESC
  s.homepage     = "https://github.com/adaptyteam/AdaptySDK-React-Native"
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Adapty team" => "support@adapty.io" }
  s.platforms    = { :ios => "15.0" }
  s.source       = { :git => "https://github.com/adaptyteam/AdaptySDK-React-Native.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,m,swift}"
  s.resources = "ios/**/*.{plist}"
  s.requires_arc = true

  if adapty_disable_spm
    s.dependency 'Adapty', adapty_ios_version
    s.dependency 'AdaptyUI', adapty_ios_version
    s.dependency 'AdaptyPlugin', adapty_ios_version
  elsif defined?(spm_dependency)
    spm_dependency(s,
      url: 'https://github.com/adaptyteam/AdaptySDK-iOS.git',
      requirement: { kind: 'exactVersion', version: adapty_ios_version },
      products: ['Adapty', 'AdaptyUI', 'AdaptyPlugin']
    )
  else
    raise "[react-native-adapty] By default the Adapty iOS SDK installs through SPM, which needs React Native 0.75+ " \
          "(`spm_dependency` not found). Upgrade React Native, or try the CocoaPods mode: " \
          "in ios/Podfile and call `adapty_disable_spm!` " \
          "before `use_native_modules!` (Expo: `iosDisableSPM: true`)"
  end

  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end
end
