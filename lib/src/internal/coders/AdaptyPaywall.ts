import type { AdaptyPaywall } from '../../types';

import { Coder } from './coder';

type Type = AdaptyPaywall;

export class AdaptyPaywallCoder extends Coder<Type> {
  static backendCache: Map<string, Record<string, any>> = new Map();

  constructor(data: Type) {
    super(data);
  }

  override encode(): Record<string, any> {
    const d = this.data;

    // const result = {
    //   ab_test_name: d.abTestName,
    //   developer_id: d.id,
    //   paywall_name: d.name,
    //   custom_payload: d.remoteConfigString,
    //   revision: d.revision,
    //   variation_id: d.variationId,
    //   products: products,
    //   // products: d.vendorProductIds?.map(vendorProductId => ({
    //   //   vendor_product_id: vendorProductId,
    //   // })),
    // };
    return AdaptyPaywallCoder.backendCache.get(d.id)!;
  }

  static override tryDecode(json_obj: unknown): AdaptyPaywallCoder {
    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || data === null) {
      throw this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });
    }

    const abTestName = data['ab_test_name'] as Type['abTestName'];
    if (!abTestName) {
      throw this.errRequired('abTestName');
    }
    if (typeof abTestName !== 'string') {
      throw this.errType({
        name: 'abTestName',
        expected: 'string',
        current: typeof abTestName,
      });
    }

    const id = data['developer_id'] as Type['id'];
    if (!id) {
      throw this.errRequired('id');
    }
    if (typeof id !== 'string') {
      throw this.errType({
        name: 'id',
        expected: 'string',
        current: typeof id,
      });
    }

    const name = data['paywall_name'] as Type['name'];
    if (name && typeof name !== 'string') {
      throw this.errType({
        name: 'name',
        expected: 'string',
        current: typeof name,
      });
    }

    const payload = data['remote_config'] as { lang: string; data?: string };
    if (!payload) {
      throw this.errRequired('payload');
    }
    if (typeof payload !== 'object' || payload === null) {
      throw this.errType({
        name: 'payload',
        expected: 'object',
        current: typeof payload,
      });
    }
    const locale = payload['lang'] as Type['locale'];
    if (!locale) {
      throw this.errRequired('locale');
    }
    if (typeof locale !== 'string') {
      throw this.errType({
        name: 'locale',
        expected: 'string',
        current: typeof locale,
      });
    }
    const remoteConfigString = payload['data'] as Type['remoteConfigString'];
    if (remoteConfigString && typeof remoteConfigString !== 'string') {
      throw this.errType({
        name: 'remoteConfigString',
        expected: 'string',
        current: typeof remoteConfigString,
      });
    }
    const remoteConfig = (
      remoteConfigString ? JSON.parse(remoteConfigString) : undefined
    ) as Type['remoteConfig'];

    const revision = data['revision'] as Type['revision'];
    if (!revision) {
      throw this.errRequired('revision');
    }
    if (typeof revision !== 'number') {
      throw this.errType({
        name: 'revision',
        expected: 'number',
        current: typeof revision,
      });
    }

    const variationId = data['variation_id'] as Type['variationId'];
    if (!variationId) {
      throw this.errRequired('variationId');
    }
    if (typeof variationId !== 'string') {
      throw this.errType({
        name: 'variationId',
        expected: 'string',
        current: typeof variationId,
      });
    }

    const vendorProducts = data['products'];
    if (!Array.isArray(vendorProducts)) {
      throw this.errType({
        name: 'vendorProductIds',
        expected: 'array',
        current: typeof vendorProducts,
      });
    }
    const vendorProductIds = vendorProducts?.map(
      product => product['vendor_product_id'],
    );

    const result: Required<Type> = {
      abTestName: abTestName,
      id: id,
      locale: locale!,
      name: name!,
      remoteConfig: remoteConfig!,
      remoteConfigString: remoteConfigString!,
      revision: revision,
      variationId: variationId,
      vendorProductIds: vendorProductIds,
    };

    // drop empty fields
    Object.keys(result).forEach(keyStr => {
      const key = keyStr as keyof typeof result;
      if (result[key] == null || result[key] === undefined) {
        delete result[key];
      }
    });

    this.backendCache.set(id, data);
    return new AdaptyPaywallCoder(result);
  }
}
