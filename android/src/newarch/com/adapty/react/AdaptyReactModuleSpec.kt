package com.adapty.react

import com.facebook.react.bridge.ReactApplicationContext

// New architecture: the base class is the codegen-generated TurboModule spec
abstract class AdaptyReactModuleSpec(context: ReactApplicationContext) :
    NativeRNAdaptySpec(context)
