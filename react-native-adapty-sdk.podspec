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
  s.platforms    = { :ios => "11.0" }
  s.source       = { :git => "https://github.com/adaptyteam/AdaptySDK-React-Native.git", :tag => "#{s.version}" }

  s.source_files = "lib/ios/**/*.{h,c,m,swift}"
  s.resources = "lib/ios/**/*.{plist}"
  s.requires_arc = true

  s.dependency "Adapty", "2.9.1"
  s.dependency "React"
end

