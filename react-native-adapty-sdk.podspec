require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-adapty-sdk"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
  Pod for @adapty/react-native-sdk (previously react-native-adapty)
                   DESC
  s.homepage     = "https://github.com/adaptyteam/AdaptySDK-React-Native"
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Ivan Dorofeyev" => "divandoesapps@gmail.com" }
  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://github.com/adaptyteam/AdaptySDK-React-Native.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,m,swift}"
  s.resources = "ios/**/*.{plist}"
  s.requires_arc = true

  s.dependency "Adapty", "3.0.3"
  s.dependency "AdaptyUI", "3.0.3"
  s.dependency "React"
end

