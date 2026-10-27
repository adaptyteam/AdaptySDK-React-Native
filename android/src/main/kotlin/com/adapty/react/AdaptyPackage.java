package com.adapty.react;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/** @noinspection ALL*/
// The redundant `implements ReactPackage` keeps RN CLI < 0.76 autolinking detecting this package
public class AdaptyPackage extends BaseReactPackage implements ReactPackage {
  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext ctx) {
    return Arrays.<ViewManager>asList(
      new AdaptyOnboardingViewManager(),
      new AdaptyFlowViewManager()
    );
  }

  @Nullable
  @Override
  public NativeModule getModule(@NonNull String name, @NonNull ReactApplicationContext ctx) {
    if (AdaptyReactModule.NAME.equals(name)) {
      return new AdaptyReactModule(ctx);
    }
    return null;
  }

  @NonNull
  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
      boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
      moduleInfos.put(
        AdaptyReactModule.NAME,
        new ReactModuleInfo(
          AdaptyReactModule.NAME,
          AdaptyReactModule.class.getName(),
          false, // canOverrideExistingModule
          !isTurboModule, // needsEagerInit: old arch keeps the bridge-start creation of createNativeModules
          false, // isCxxModule
          isTurboModule
        )
      );
      return moduleInfos;
    };
  }
}
