package com.adapty.react

import android.app.Activity
import com.adapty.errors.AdaptyError
import com.adapty.internal.crossplatform.CrossplatformHelper
import com.adapty.utils.AdaptyResult
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

class AdaptyContext(
    val method: String,
    val args: ReadableMap,
    private val promise: Promise,
    val helper: CrossplatformHelper,
    val activity: Activity?
) {

    fun resolve(result: AdaptyResult<*>) {
        when (result) {
            is AdaptyResult.Success -> success(result.value?.let(helper::toJson))
            is AdaptyResult.Error -> err(result.error)
        }
    }
    fun emptyOrError(error: AdaptyError?) {
        if (error != null) {
            return err(error)
        }

        success(null)
    }

    fun success(str: String?) {
        promise.resolve(str)
    }

    fun err(error: AdaptyError) {
        promise.reject("adapty", helper.toJson(error))
    }
    fun notImplemented() {
        promise.reject("adapty", "{\"adapty_code\":0,\"message\":\"method not implemented\"}")
    }
    fun argNotFound(name: String) {
        promise.reject("adapty", "{\"adapty_code\":2003,\"message\":\"Argument $name was not passed to a native module\"}")
    }
    fun failedToSerialize() {
        promise.reject("adapty", "{\"adapty_code\":23,\"message\":\"Failed to serialize data on a native side\"}")
    }

    inline fun <reified T: Any> parseJsonArgument(paramKey: String): T? {
        return try {
            args.getString(paramKey)?.takeIf(String::isNotEmpty)?.let { json ->
                helper.fromJson(json, T::class.java)
            }
        } catch (e: Exception) { null }
    }

}

