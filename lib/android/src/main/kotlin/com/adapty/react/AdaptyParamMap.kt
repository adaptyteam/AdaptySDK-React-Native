package com.adapty.react

import com.adapty.internal.crossplatform.CrossplatformHelper
import com.facebook.react.bridge.ReadableMap

class ParamMap(val dict: ReadableMap) {
    inline fun <reified T> getRequiredValue(key: ParamKey): T {
        val value = dict.getString(key.value) ?: throw BridgeError.MissingRequiredArgument(key)

        return value as? T ?: throw BridgeError.TypeMismatch(
            key,
            T::class.simpleName ?: "UnknownType"
        )
    }

    inline fun <reified T> getOptionalValue(key: ParamKey): T? {
        val keyStr = key.value
        return when(T::class) {
            Boolean::class -> dict.getBoolean(keyStr) as? T
            String::class -> dict.getString(keyStr) as? T
            Int::class -> dict.getInt(keyStr) as T
            else -> null
        }
    }

    inline fun <reified T : Any> getDecodedValue(key: ParamKey): T {
        val jsonStr: String = getRequiredValue(key)

        try {
            return CrossplatformHelper.shared.fromJson(jsonStr, T::class.java)
        } catch (error: Error) {
            throw BridgeError.TypeMismatch(key, "JSON-encoded ${T::class.simpleName}")
        }
    }

    inline fun <reified T : Any> getDecodedOptionalValue(key: ParamKey): T? {
        val jsonStr: String = getOptionalValue(key) ?: return null

        try {
            return CrossplatformHelper.shared.fromJson(jsonStr, T::class.java)
        } catch (error: Error) {
            throw BridgeError.TypeMismatch(key, "JSON-encoded ${T::class.simpleName}")
        }
    }

    inline fun <reified T : Any> getDecodedValue(
        key: ParamKey,
        decoder: (str: String?) -> T?
    ): T {
        val jsonStr: String = getRequiredValue(key)

        return decoder(jsonStr)
            ?: throw BridgeError.TypeMismatch(key, "JSON-encoded ${T::class.simpleName}")
    }
}
