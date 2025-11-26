import type { CreatePaywallViewParamsInput } from '../ui/types';
import type { Def } from '@/types/schema';
type Model = CreatePaywallViewParamsInput;
type Serializable = {
    preload_products?: boolean;
    load_timeout?: number;
    custom_tags?: Def['AdaptyUI.CustomTagsValues'];
    custom_timers?: Def['AdaptyUI.CustomTimersValues'];
    custom_assets?: Def['AdaptyUI.CustomAssets'];
    product_purchase_parameters?: Def['AdaptyUI.ProductPurchaseParameters'];
};
export declare class AdaptyUICreatePaywallViewParamsCoder {
    encode(data: Model): Serializable;
    private encodeCustomTimers;
    private encodeCustomAssets;
    private encodeProductPurchaseParams;
}
export {};
//# sourceMappingURL=adapty-ui-create-paywall-view-params.d.ts.map