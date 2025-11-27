"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptyUICreatePaywallViewParamsCoder = void 0;
const tslib_1 = require("tslib");
const react_native_1 = require("react-native");
const adapty_purchase_params_1 = require("./adapty-purchase-params");
const utils_1 = require("./utils");
class AdaptyUICreatePaywallViewParamsCoder {
    encode(data) {
        const result = {};
        if (data.prefetchProducts !== undefined) {
            result.preload_products = data.prefetchProducts;
        }
        if (data.loadTimeoutMs !== undefined) {
            result.load_timeout = data.loadTimeoutMs / 1000;
        }
        if (data.customTags) {
            result.custom_tags = data.customTags;
        }
        if (data.customTimers) {
            result.custom_timers = this.encodeCustomTimers(data.customTimers);
        }
        if (data.customAssets) {
            result.custom_assets = this.encodeCustomAssets(data.customAssets);
        }
        if (data.productPurchaseParams) {
            result.product_purchase_parameters = this.encodeProductPurchaseParams(data.productPurchaseParams);
        }
        return result;
    }
    encodeCustomTimers(timers) {
        const result = {};
        for (const key in timers) {
            if (timers.hasOwnProperty(key)) {
                const date = timers[key];
                if (date instanceof Date) {
                    result[key] = (0, utils_1.formatDateUTC)(date);
                }
            }
        }
        return result;
    }
    encodeCustomAssets(assets) {
        const getAssetId = (asset) => {
            return (0, utils_1.resolveAssetId)(asset, spec => react_native_1.Platform.select(spec)) || '';
        };
        return Object.entries(assets)
            .map(([id, asset]) => {
            switch (asset.type) {
                case 'image':
                    return 'base64' in asset
                        ? {
                            id,
                            type: 'image',
                            value: (0, utils_1.extractBase64Data)(asset.base64),
                        }
                        : {
                            id,
                            type: 'image',
                            asset_id: getAssetId(asset),
                        };
                case 'video':
                    return {
                        id,
                        type: 'video',
                        asset_id: getAssetId(asset),
                    };
                case 'color':
                    let value;
                    if ('argb' in asset) {
                        value = utils_1.colorToHex.fromARGB(asset.argb);
                    }
                    else if ('rgba' in asset) {
                        value = utils_1.colorToHex.fromRGBA(asset.rgba);
                    }
                    else if ('rgb' in asset) {
                        value = utils_1.colorToHex.fromRGB(asset.rgb);
                    }
                    else {
                        return undefined;
                    }
                    return {
                        id,
                        type: 'color',
                        value,
                    };
                case 'linear-gradient':
                    const { values, points = {} } = asset;
                    const { x0 = 0, y0 = 0, x1 = 1, y1 = 0 } = points;
                    const colorStops = values
                        .map((_a) => {
                        var { p } = _a, colorInput = tslib_1.__rest(_a, ["p"]);
                        let color;
                        if ('argb' in colorInput) {
                            color = utils_1.colorToHex.fromARGB(colorInput.argb);
                        }
                        else if ('rgba' in colorInput) {
                            color = utils_1.colorToHex.fromRGBA(colorInput.rgba);
                        }
                        else if ('rgb' in colorInput) {
                            color = utils_1.colorToHex.fromRGB(colorInput.rgb);
                        }
                        else {
                            return undefined;
                        }
                        return { color, p };
                    })
                        .filter((v) => v !== undefined);
                    if (colorStops.length !== values.length)
                        return undefined;
                    return {
                        id,
                        type: 'linear-gradient',
                        values: colorStops,
                        points: { x0, y0, x1, y1 },
                    };
                default:
                    return undefined;
            }
        })
            .filter((item) => item !== undefined);
    }
    encodeProductPurchaseParams(params) {
        if (!params)
            return {};
        const purchaseParamsCoder = new adapty_purchase_params_1.AdaptyPurchaseParamsCoder();
        return Object.fromEntries(params.map(({ productId, params }) => [
            productId.adaptyProductId,
            purchaseParamsCoder.encode(params),
        ]));
    }
}
exports.AdaptyUICreatePaywallViewParamsCoder = AdaptyUICreatePaywallViewParamsCoder;
//# sourceMappingURL=adapty-ui-create-paywall-view-params.js.map