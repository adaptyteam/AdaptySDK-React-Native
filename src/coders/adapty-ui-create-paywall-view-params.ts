import { Platform } from 'react-native';
import type {
  CreatePaywallViewParamsInput,
  AdaptyCustomAsset,
} from '@/ui/types';
import type { Def } from '@/types/schema';
import { AdaptyPurchaseParamsCoder } from './adapty-purchase-params';
import {
  colorToHex,
  extractBase64Data,
  formatDateUTC,
  resolveAssetId,
} from './utils';

type Model = CreatePaywallViewParamsInput;
type Serializable = {
  preload_products?: boolean;
  load_timeout?: number;
  custom_tags?: Def['AdaptyUI.CustomTagsValues'];
  custom_timers?: Def['AdaptyUI.CustomTimersValues'];
  custom_assets?: Def['AdaptyUI.CustomAssets'];
  product_purchase_parameters?: Def['AdaptyUI.ProductPurchaseParameters'];
};

export class AdaptyUICreatePaywallViewParamsCoder {
  encode(data: Model): Serializable {
    const result: Serializable = {};

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
      result.product_purchase_parameters = this.encodeProductPurchaseParams(
        data.productPurchaseParams,
      );
    }

    return result;
  }

  private encodeCustomTimers(
    timers: Record<string, Date>,
  ): Def['AdaptyUI.CustomTimersValues'] {
    const result: Record<string, string> = {};
    for (const key in timers) {
      if (timers.hasOwnProperty(key)) {
        const date = timers[key];
        if (date instanceof Date) {
          result[key] = formatDateUTC(date);
        }
      }
    }
    return result;
  }

  private encodeCustomAssets(
    assets: Record<string, AdaptyCustomAsset>,
  ): Def['AdaptyUI.CustomAssets'] {
    const getAssetId = (asset: any): string => {
      return resolveAssetId(asset, spec => Platform.select(spec)) || '';
    };

    return Object.entries(assets)
      .map(([id, asset]): Def['AdaptyUI.CustomAssets'][number] | undefined => {
        switch (asset.type) {
          case 'image':
            return 'base64' in asset
              ? {
                  id,
                  type: 'image',
                  value: extractBase64Data(asset.base64),
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
            let value: string;

            if ('argb' in asset) {
              value = colorToHex.fromARGB(asset.argb);
            } else if ('rgba' in asset) {
              value = colorToHex.fromRGBA(asset.rgba);
            } else if ('rgb' in asset) {
              value = colorToHex.fromRGB(asset.rgb);
            } else {
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
              .map(({ p, ...colorInput }) => {
                let color: string;

                if ('argb' in colorInput) {
                  color = colorToHex.fromARGB(colorInput.argb);
                } else if ('rgba' in colorInput) {
                  color = colorToHex.fromRGBA(colorInput.rgba);
                } else if ('rgb' in colorInput) {
                  color = colorToHex.fromRGB(colorInput.rgb);
                } else {
                  return undefined;
                }

                return { color, p };
              })
              .filter(
                (v): v is { color: string; p: number } => v !== undefined,
              );

            if (colorStops.length !== values.length) return undefined;

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
      .filter(
        (item): item is Def['AdaptyUI.CustomAssets'][number] =>
          item !== undefined,
      );
  }

  private encodeProductPurchaseParams(
    params: CreatePaywallViewParamsInput['productPurchaseParams'],
  ): Def['AdaptyUI.ProductPurchaseParameters'] {
    if (!params) return {};

    const purchaseParamsCoder = new AdaptyPurchaseParamsCoder();
    return Object.fromEntries(
      params.map(({ productId, params }) => [
        productId.adaptyProductId,
        purchaseParamsCoder.encode(params),
      ]),
    );
  }
}
