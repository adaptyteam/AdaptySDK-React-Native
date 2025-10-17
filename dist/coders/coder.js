"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleCoder = exports.Coder = void 0;
const adapty_error_1 = require("../adapty-error");
const react_native_1 = require("react-native");
class Coder {
    encode(data) {
        return this.encodeWithProperties(data, this.properties);
    }
    // From vendor_product_id to productId
    decode(data) {
        return this.decodeWithProperties(data, this.properties);
    }
    isType(value, type) {
        switch (type) {
            case 'string':
            case 'boolean':
            case 'number':
                return typeof value === type;
            case 'object':
                return value !== null && typeof value === 'object';
            case 'array':
                return Array.isArray(value);
        }
    }
    getNestedValue(obj, key) {
        const keys = key.split('.');
        let current;
        if (typeof obj === 'string') {
            try {
                current = JSON.parse(obj);
            }
            catch (error) {
                return undefined;
            }
        }
        else {
            current = obj;
        }
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (current[key] !== undefined) {
                current = current[key];
            }
            else {
                return undefined;
            }
        }
        return current;
    }
    assignNestedValue(obj, key, value) {
        const keys = String(key).split('.');
        let currentObj = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (currentObj[key] === undefined) {
                currentObj[key] = {};
            }
            currentObj = currentObj[key];
        }
        currentObj[keys[keys.length - 1]] = value;
        return obj;
    }
    encodeWithProperties(data, properties) {
        const result = {};
        for (const key in data) {
            if (key === 'ios' || key === 'android') {
                // Read properties from ios/android platform keys and flatten them
                const platformResult = this.encodeWithProperties(data[key], properties[key]);
                Object.assign(result, platformResult);
                continue;
            }
            const property = properties[key];
            if (!property) {
                throw adapty_error_1.AdaptyError.failedToEncode(`Failed to find encoder for property "${key}"`);
            }
            const converter = property.converter;
            this.assignNestedValue(result, property.key, converter ? converter.encode(data[key]) : data[key]);
        }
        return result;
    }
    decodeWithProperties(data, properties, platform) {
        const result = {};
        for (const key in properties) {
            if (key === 'android' || key === 'ios') {
                // Add ios/android property and fill platform data there
                result[key] =
                    this.decodeWithProperties(data, properties[key], key);
                continue;
            }
            const property = properties[key];
            if (!property) {
                throw adapty_error_1.AdaptyError.failedToDecode(`Failed to find decoder for property "${key}"`);
            }
            const value = this.getNestedValue(data, property.key);
            if (property.required &&
                value === undefined &&
                (!platform || platform == react_native_1.Platform.OS)) {
                throw adapty_error_1.AdaptyError.failedToDecode(`Failed to decode native response, because it is missing required property "${key}"`);
            }
            // If value is null or undefined and property is not required, continue
            if (value == null)
                continue;
            if (!this.isType(value, property.type)) {
                throw adapty_error_1.AdaptyError.failedToDecode(`Failed to decode native response, because its property "${key}" has invalid type. Expected type: ${property.type}. Received type: ${typeof value}`);
            }
            // If a converter is provided, use it to convert the value
            result[key] = property.converter
                ? property.converter.decode(value)
                : value;
        }
        return result;
    }
}
exports.Coder = Coder;
class SimpleCoder extends Coder {
}
exports.SimpleCoder = SimpleCoder;
//# sourceMappingURL=coder.js.map