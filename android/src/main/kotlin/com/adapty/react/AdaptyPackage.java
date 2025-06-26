package com.adapty.react;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Collections;
import java.util.Arrays;
import java.util.List;

/** @noinspection ALL*/
public class AdaptyPackage implements ReactPackage {
  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext ctx) {
    return Arrays.<ViewManager>asList(new AdaptyOnboardingViewManager());
  }

  @NonNull
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext  ctx) {
    return Arrays.<NativeModule>asList(new AdaptyReactModule(ctx));
  }

  public List<Class<? extends JavaScriptModule>> createJSModules() {
    return null;
  }
}
