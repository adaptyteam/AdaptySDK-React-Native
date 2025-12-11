"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAssetId = exports.extractBase64Data = exports.colorToHex = exports.formatDateUTC = void 0;
const formatDateUTC = (date) => {
    const pad = (num, digits = 2) => {
        const str = num.toString();
        const paddingLength = digits - str.length;
        return paddingLength > 0 ? '0'.repeat(paddingLength) + str : str;
    };
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    const millis = pad(date.getUTCMilliseconds(), 3);
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${millis}Z`;
};
exports.formatDateUTC = formatDateUTC;
exports.colorToHex = {
    fromARGB(value) {
        const hex = value.toString(16).padStart(8, '0');
        return `#${hex.slice(2)}${hex.slice(0, 2)}`;
    },
    fromRGBA(value) {
        return `#${value.toString(16).padStart(8, '0')}`;
    },
    fromRGB(value) {
        return `#${value.toString(16).padStart(6, '0')}ff`;
    },
};
const extractBase64Data = (input) => {
    const commaIndex = input.indexOf(',');
    if (input.startsWith('data:') && commaIndex !== -1) {
        return input.slice(commaIndex + 1);
    }
    return input;
};
exports.extractBase64Data = extractBase64Data;
const resolveAssetId = (asset, select) => {
    if ('relativeAssetPath' in asset) {
        return (select({
            ios: asset.relativeAssetPath,
            android: `${asset.relativeAssetPath}a`,
        }) || '');
    }
    const fileLocation = asset.fileLocation;
    return (select({
        ios: fileLocation.ios.fileName,
        android: 'relativeAssetPath' in fileLocation.android
            ? `${fileLocation.android.relativeAssetPath}a`
            : `${fileLocation.android.rawResName}r`,
    }) || '');
};
exports.resolveAssetId = resolveAssetId;
//# sourceMappingURL=utils.js.map