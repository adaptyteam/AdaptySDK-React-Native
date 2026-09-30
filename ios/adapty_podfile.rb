# Podfile helpers of react-native-adapty. Require this file in ios/Podfile:
#
#   require Pod::Executable.execute_command('node', ['-p',
#     'require.resolve(
#       "react-native-adapty/ios/adapty_podfile.rb",
#       {paths: [process.argv[1]]},
#     )', __dir__]).strip
#
# adapty_disable_spm! - the native SDK as the legacy CocoaPods pods instead of SPM
# (spm_dependency, the default). Call it in the app target BEFORE `use_native_modules!`,
# which evaluates the podspec (Expo: the `iosDisableSPM` plugin option generates the call):
#
#   target 'MyApp' do
#     adapty_disable_spm!
#     config = use_native_modules!
#
# The helper is the recommended way. A manual setup is also supported: a top-level `source` for
# the Adapty spec repo and `$AdaptyDisableSPM = true` before `use_native_modules!`.
# It relies on internals that may change between releases.
#
# adapty_enable_kids_mode(installer) - Adapty Kids Mode (COPPA / App Store Kids Category),
# in post_install AFTER `react_native_post_install`:
#
#   post_install do |installer|
#     react_native_post_install(installer, ...)
#     adapty_enable_kids_mode(installer)
#   end
#
# Only post_install works: CocoaPods saves the Pods projects right after it, so from
# post_integrate the project edits are silently lost, and from pre_install the SPM path hits a
# nil `pods_project` (NoMethodError). It raises, failing `pod install`, in the cases it detects
# (listed at the method), not on every misuse.

# Rubies before 3.1 dedup `require` by expanded path, not realpath: required through two paths
# (e.g. a symlinked node_modules), the file loads twice and would redefine its constants; keep
# the first.
return if defined?(AdaptyPodfile::SPECS_REPO)

module AdaptyPodfile
  SPECS_REPO = 'https://github.com/adaptyteam/AdaptySDK-CocoaPods-Specs.git'.freeze
  # The podspec's dependencies in CocoaPods mode.
  PODS = %w[Adapty AdaptyUI AdaptyPlugin].freeze
  RN_POD = 'react-native-adapty-sdk'.freeze

  IOS_PACKAGE_REPO = 'AdaptySDK-iOS'.freeze
  KIDS_MODE_TRAIT = 'KidsMode'.freeze
  ADAPTY_POD = 'Adapty'.freeze
  AD_SUPPORT = 'AdSupport'.freeze
  # `-framework` / `-weak_framework` AdSupport by exact name: `AdSupportKit` stays.
  AD_SUPPORT_FLAG = /[ \t]*-(?:weak_)?framework[ \t]+(?:"#{AD_SUPPORT}"|#{AD_SUPPORT}(?=\s|\z))/.freeze

  # The pods have no Kids Mode switch, so apply the trait's effect by hand: the IDFA code is
  # guarded by the `KidsMode` compilation condition, and Adapty.podspec links AdSupport.
  def self.enable_kids_mode_for_pods(installer)
    # Every variant of the pod (`Adapty-iOS15.0`, ...) is its own target, and with
    # generate_multiple_pod_projects it lives in a per-pod project, not in pods_project.
    labels = installer.pod_targets.select { |target| target.pod_name == ADAPTY_POD }.map(&:label)
    adapty_targets = Array(installer.generated_projects).flat_map(&:targets).select do |target|
      labels.include?(target.name)
    end
    if adapty_targets.empty?
      # Plain errors: CocoaPods wraps post_install errors into its own Informative.
      raise "[Adapty] Kids Mode NOT enabled: no #{ADAPTY_POD} target in the generated Pods projects."
    end

    # The aggregate and pod target xcconfigs carry other pods' frameworks too, so AdSupport can be
    # dropped only if no other pod declares it. Checked before any change.
    others = installer.pod_targets.select do |target|
      target.pod_name != ADAPTY_POD && target.spec_consumers.any? do |consumer|
        (consumer.frameworks + consumer.weak_frameworks).include?(AD_SUPPORT)
      end
    end.map(&:pod_name).uniq
    unless others.empty?
      raise "[Adapty] Kids Mode NOT enabled: #{AD_SUPPORT} would stay linked, also declared by " \
            "#{others.join(', ')}."
    end

    condition = "-D#{KIDS_MODE_TRAIT}"
    framework = "#{AD_SUPPORT}.framework"
    adapty_targets.each do |adapty|
      adapty.build_configurations.each do |config|
        flags = config.build_settings['OTHER_SWIFT_FLAGS'] || '$(inherited)'
        next if flags.include?(condition)

        config.build_settings['OTHER_SWIFT_FLAGS'] =
          flags.is_a?(Array) ? flags + [condition] : "#{flags} #{condition}"
      end
      adapty.frameworks_build_phase.files.dup.each do |file|
        adapty.frameworks_build_phase.remove_build_file(file) if file.display_name == framework
      end
    end
    # No save: CocoaPods writes the generated projects right after the post_install hooks.

    if unlink_ad_support(installer)
      Pod::UI.puts "[Adapty] Kids Mode enabled: #{condition} on the #{ADAPTY_POD} pod, #{AD_SUPPORT} unlinked"
    else
      Pod::UI.puts "[Adapty] Kids Mode enabled: #{condition} on the #{ADAPTY_POD} pod; no xcconfig listed #{AD_SUPPORT}"
    end
  end

  # Drops AdSupport from the xcconfig objects CocoaPods keeps in memory, so a later hook that
  # re-saves them (RN's post_install helpers do) cannot bring it back, and from the files,
  # edited in place to keep what earlier hooks wrote there. Returns whether anything listed it.
  def self.unlink_ad_support(installer)
    configs = installer.aggregate_targets.flat_map { |target| target.xcconfigs.values } +
              installer.pod_targets.flat_map { |target| target.build_settings.values.map(&:xcconfig) }
    in_memory = configs.count do |config|
      [config.frameworks, config.weak_frameworks].map { |names| names.delete?(AD_SUPPORT) }.any?
    end
    # Pathname#glob: brackets or braces in the project path are not read as patterns.
    on_disk = installer.sandbox.target_support_files_root.glob('**/*.xcconfig').count do |path|
      contents = path.read
      stripped = contents.gsub(AD_SUPPORT_FLAG, '')
      path.write(stripped) unless stripped == contents
      stripped != contents
    end
    in_memory + on_disk > 0
  end
end

# Sets `$AdaptyDisableSPM`, which the podspec reads, and pins the pods to the spec repo. The pins
# keep the implicit trunk of a Podfile with no top-level `source`. The pods' own dependencies
# (AdaptyLogger etc.) are not pinned: they resolve from trunk and the spec repo, trunk winning
# on an equal version. Runs as a Podfile DSL method, like `use_native_modules!`.
def adapty_disable_spm!
  # Too late only if use_native_modules! already declared the RN pod, in any target, before the
  # global was set: its podspec was then evaluated in SPM mode. A repeated call (e.g. in a nested
  # target that inherits the RN pod) finds the global already set.
  unless defined?($AdaptyDisableSPM) && $AdaptyDisableSPM == true
    late = target_definition_list.find do |definition|
      definition.non_inherited_dependencies.any? { |dependency| dependency.root_name == AdaptyPodfile::RN_POD }
    end
    # Podfile evaluation wraps any error into "[!] Invalid `Podfile` file: <message>." itself.
    if late
      raise "[Adapty] #{AdaptyPodfile::RN_POD} is already declared in target `#{late.name}`: " \
            'call adapty_disable_spm! before use_native_modules!, which evaluates its podspec'
    end
  end

  $AdaptyDisableSPM = true
  declared = current_target_definition.dependencies.map(&:root_name)
  (AdaptyPodfile::PODS - declared).each { |name| pod name, :source => AdaptyPodfile::SPECS_REPO }
end

# SPM: AdaptySDK-iOS 4.x ships Kids Mode as a Swift package trait (`KidsMode`) that compiles
# out all IDFA / AdSupport / AppTrackingTransparency code. `spm_dependency` cannot forward
# package traits, so the trait is set directly on the Swift package reference it creates in
# the Pods project - the `traits` pbxproj attribute Xcode writes from the Package Dependencies
# inspector (Xcode 26+, already the floor of AdaptySDK-iOS 4.x). React Native's SPM integration
# recreates all package references on every `pod install`, hence the call after
# `react_native_post_install`. Verify: `traits = (KidsMode,);` in the AdaptySDK-iOS block of
# ios/Pods/Pods.xcodeproj/project.pbxproj, `kids_mode_enabled: true` in the activate log.
#
# CocoaPods pods (adapty_disable_spm! / Expo `iosDisableSPM`): no package reference, so the same
# `KidsMode` condition goes on the Adapty pod (OTHER_SWIFT_FLAGS `-DKidsMode`) and AdSupport,
# which that pod declares explicitly, is unlinked.
#
# Raises in the cases it detects: SPM with no AdaptySDK-iOS package reference (e.g. called
# before react_native_post_install); pods with no Adapty pod target, or with another pod
# declaring AdSupport too, which would keep it linked. Must run in post_install: from
# post_integrate the project edits are never saved (no error), from pre_install the SPM path
# raises NoMethodError on a nil `pods_project`.
def adapty_enable_kids_mode(installer)
  # The pod target check also catches a Podfile that pulls the Adapty pod without the global.
  if (defined?($AdaptyDisableSPM) && $AdaptyDisableSPM == true) ||
     installer.pod_targets.any? { |target| target.pod_name == AdaptyPodfile::ADAPTY_POD }
    AdaptyPodfile.enable_kids_mode_for_pods(installer)
    return
  end

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
    ref.is_a?(ref_class) && ref.repositoryURL.to_s.include?(AdaptyPodfile::IOS_PACKAGE_REPO)
  end

  # A plain error: CocoaPods wraps post_install errors into its own Informative.
  if refs.empty?
    raise "[Adapty] Kids Mode NOT enabled: no #{AdaptyPodfile::IOS_PACKAGE_REPO} Swift package reference found " \
          'in the Pods project. Call adapty_enable_kids_mode(installer) inside post_install, AFTER ' \
          'react_native_post_install(...).'
  end

  refs.each do |ref|
    ref.traits = [AdaptyPodfile::KIDS_MODE_TRAIT]
    Pod::UI.puts "[Adapty] Kids Mode enabled: #{AdaptyPodfile::KIDS_MODE_TRAIT} trait set on #{ref.repositoryURL}"
  end
end
