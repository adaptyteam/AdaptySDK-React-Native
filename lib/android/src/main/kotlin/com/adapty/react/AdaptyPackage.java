package com.adapty.react;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Collections;
import java.util.Arrays;
import java.util.List;

public class AdaptyPackage implements ReactPackage {
  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext ctx) {
    return Collections.emptyList();
  }

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext  ctx) {
    return Arrays.<NativeModule>asList(new AdaptyReactModule(ctx));
  }

  public List<Class<? extends JavaScriptModule>> createJSModules() {
    return null;
  }
}