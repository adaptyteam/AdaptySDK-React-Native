package com.rnadapty.react;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import androidx.annotation.NonNull;

import java.util.Collections;
import java.util.Arrays;
import java.util.List;

import com.rnadapty.react.AdaptyModule;

public class AdaptyPackage implements ReactPackage {
  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext ctx) {
    return Collections.emptyList();
  }

  @NonNull
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext  ctx) {
    return Arrays.<NativeModule>asList(new AdaptyModule(ctx));
  }
}