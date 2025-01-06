package com.adapty.react

import com.adapty.internal.crossplatform.CrossplatformHelper

sealed class BridgeError : Throwable() {
    abstract val description: String
    private val helper = CrossplatformHelper

    private data class SerializedBridgeError(
        val errorType: String,
        val name: String? = null,
        val type: String? = null,
        val underlyingError: String? = null
    )

    fun toJson(): String {
        val serialized = when (this) {
            is MissingRequiredArgument -> SerializedBridgeError(
                errorType = "missingRequiredArgument",
                name = name.value
            )

            is TypeMismatch -> SerializedBridgeError(
                errorType = "typeMismatch",
                name = name.value,
                type = type
            )

            is EncodingFailed -> SerializedBridgeError(
                errorType = "encodingFailed",
                underlyingError = underlyingError.localizedMessage
            )

            is MethodNotImplemented -> SerializedBridgeError(
                errorType = "methodNotImplemented"
            )

            is UnexpectedError -> SerializedBridgeError(
                errorType = "unexpectedError",
                underlyingError = underlyingError.localizedMessage
            )
        }

        return helper.shared.toJson(serialized)
    }

    data class MissingRequiredArgument(val name: ParamKey) : BridgeError() {
        override val description: String
            get() = "Missing required argument: ${name.value}."
    }

    data class TypeMismatch(val name: ParamKey, val type: String) : BridgeError() {
        override val description: String
            get() = "Type mismatch for argument ${name.value}. Expected type $type."
    }

    data class EncodingFailed(val underlyingError: Throwable) : BridgeError() {
        override val description: String
            get() = "Failed to encode data into JSON with error: ${underlyingError.localizedMessage}."
    }

    object MethodNotImplemented : BridgeError() {
        override val description: String
            get() = "Method not implemented."
    }

    data class UnexpectedError(val underlyingError: Throwable) : BridgeError() {
        override val description: String
            get() = "Unexpected error: ${underlyingError.localizedMessage}."
    }
}
