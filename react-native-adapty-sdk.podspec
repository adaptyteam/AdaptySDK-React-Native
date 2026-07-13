require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

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

  if defined?(:spm_dependency)
    spm_dependency(s,
      url: 'https://github.com/adaptyteam/AdaptySDK-iOS.git',
      requirement: { kind: 'exactVersion', version: '4.0.0' },
      products: ['Adapty', 'AdaptyUI', 'AdaptyPlugin']
    )
  else
    raise "react-native-adapty 4.0.0+ requires React Native >= 0.75 for SPM-based native iOS dependencies. " \
          "Upgrade React Native to >= 0.75, or use react-native-adapty 3.x (< 4.0.0)."
  end

  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end
end
