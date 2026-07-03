# Enables Adapty Kids Mode (COPPA / App Store Kids Category) for the native
# iOS SDK installed through the `spm_dependency` helper in
# react-native-adapty-sdk.podspec.
#
# AdaptySDK-iOS 4.x ships Kids Mode as a Swift package trait (`KidsMode`) that
# compiles out all IDFA / AdSupport / AppTrackingTransparency code. React
# Native's `spm_dependency` cannot forward package traits, so this helper sets
# the trait directly on the Swift package reference that `spm_dependency`
# creates inside the generated Pods project — the same `traits` pbxproj
# attribute Xcode writes when a trait is enabled in the Package Dependencies
# inspector. Xcode 26+ is required, which is already the floor for
# AdaptySDK-iOS 4.x (its manifest uses swift-tools-version 6.2).
#
# Usage (ios/Podfile):
#
#   require Pod::Executable.execute_command('node', ['-p',
#     'require.resolve(
#       "react-native-adapty/ios/adapty_kids_mode.rb",
#       {paths: [process.argv[1]]},
#     )', __dir__]).strip
#
#   post_install do |installer|
#     react_native_post_install(installer, ...)
#     adapty_enable_kids_mode(installer) # AFTER react_native_post_install
#   end
#
# The call must come after `react_native_post_install`: React Native's SPM
# integration wipes and recreates all package references in the Pods project
# on every `pod install`, so the trait has to be (re)applied afterwards.
#
# Verify it worked: the `Adapty.activate(...)` system log reports
# `kids_mode_enabled: true`, and the pbxproj block for AdaptySDK-iOS in
# `ios/Pods/Pods.xcodeproj/project.pbxproj` contains `traits = (KidsMode,);`.

ADAPTY_IOS_PACKAGE_REPO = 'AdaptySDK-iOS'.freeze
ADAPTY_KIDS_MODE_TRAIT = 'KidsMode'.freeze

def adapty_enable_kids_mode(installer)
  ref_class = Xcodeproj::Project::Object::XCRemoteSwiftPackageReference

  # xcodeproj (<= 1.27) doesn't model the `traits` attribute Xcode uses to
  # store enabled package traits, so declare it; assignment then validates and
  # serializes into the pbxproj like any native attribute. The attribute lists
  # are memoized per class, so reset them after registering.
  unless ref_class.attributes.any? { |attrb| attrb.name == :traits }
    ref_class.send(:attribute, :traits, Array)
    ref_class.instance_variable_set(:@full_attributes, nil)
    ref_class.instance_variable_set(:@simple_attributes, nil)
  end

  refs = installer.pods_project.root_object.package_references.select do |ref|
    ref.is_a?(ref_class) && ref.repositoryURL.to_s.include?(ADAPTY_IOS_PACKAGE_REPO)
  end

  if refs.empty?
    Pod::UI.warn "[Adapty] Kids Mode NOT enabled: no #{ADAPTY_IOS_PACKAGE_REPO} Swift package reference found " \
                 'in the Pods project. Call adapty_enable_kids_mode(installer) AFTER react_native_post_install(...).'
    return
  end

  refs.each do |ref|
    ref.traits = [ADAPTY_KIDS_MODE_TRAIT]
    Pod::UI.puts "[Adapty] Kids Mode enabled: #{ADAPTY_KIDS_MODE_TRAIT} trait set on #{ref.repositoryURL}"
  end
end
