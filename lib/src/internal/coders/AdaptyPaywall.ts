import { LogContext } from '../../logger';
import type { AdaptyPaywall } from '../../types';

import { Coder } from './coder';

type Type = AdaptyPaywall;

export class AdaptyPaywallCoder extends Coder<Type> {
  static backendCache: Map<string, Record<string, any>> = new Map();

  constructor(data: Type) {
    super(data);
  }

  override encode(ctx?: LogContext): Record<string, any> {
    const log = ctx?.encode({ methodName: this.constructor.name });

    const d = this.data;

    try {
      log?.start(d);

      const result = AdaptyPaywallCoder.backendCache.get(d.id)!;

      log?.success(result);
      return result;
    } catch (error) {
      log?.failed(error);
      throw error;
    }
  }

  static override tryDecode(
    json_obj: unknown,
    ctx?: LogContext,
  ): AdaptyPaywallCoder {
    const log = ctx?.decode({ methodName: this.prototype.constructor.name });
    log?.start({ json: json_obj });

    const data = json_obj as Record<string, any>;
    if (typeof data !== 'object' || !Boolean(data)) {
      const error = this.errType({
        name: 'data',
        expected: 'object',
        current: typeof data,
      });

      log?.failed({ error });
      throw error;
    }

    const abTestName = data['ab_test_name'] as Type['abTestName'];
    if (!abTestName) {
      const error = this.errRequired('abTestName');

      log?.failed({ error });
      throw error;
    }
    if (typeof abTestName !== 'string') {
      const error = this.errType({
        name: 'abTestName',
        expected: 'string',
        current: typeof abTestName,
      });

      log?.failed({ error });
      throw error;
    }

    const id = data['developer_id'] as Type['id'];
    if (!id) {
      const error = this.errRequired('id');

      log?.failed({ error });
      throw error;
    }
    if (typeof id !== 'string') {
      const error = this.errType({
        name: 'id',
        expected: 'string',
        current: typeof id,
      });

      log?.failed({ error });
      throw error;
    }

    const name = data['paywall_name'] as Type['name'];
    if (name && typeof name !== 'string') {
      const error = this.errType({
        name: 'name',
        expected: 'string',
        current: typeof name,
      });

      log?.failed({ error });
      throw error;
    }

    const payload = data['remote_config'] as { lang: string; data?: string };
    if (!payload) {
      const error = this.errRequired('payload');

      log?.failed({ error });
      throw error;
    }
    if (typeof payload !== 'object' || payload === null) {
      const error = this.errType({
        name: 'payload',
        expected: 'object',
        current: typeof payload,
      });

      log?.failed({ error });
      throw error;
    }
    const locale = payload['lang'] as Type['locale'];
    if (!locale) {
      const error = this.errRequired('locale');

      log?.failed({ error });
      throw error;
    }
    if (typeof locale !== 'string') {
      const error = this.errType({
        name: 'locale',
        expected: 'string',
        current: typeof locale,
      });

      log?.failed({ error });
      throw error;
    }
    const remoteConfigString = payload['data'] as Type['remoteConfigString'];
    if (remoteConfigString && typeof remoteConfigString !== 'string') {
      const error = this.errType({
        name: 'remoteConfigString',
        expected: 'string',
        current: typeof remoteConfigString,
      });

      log?.failed({ error });
      throw error;
    }
    const remoteConfig = (
      remoteConfigString ? JSON.parse(remoteConfigString) : undefined
    ) as Type['remoteConfig'];

    const revision = data['revision'] as Type['revision'];
    if (!revision) {
      const error = this.errRequired('revision');

      log?.failed({ error });
      throw error;
    }
    if (typeof revision !== 'number') {
      const error = this.errType({
        name: 'revision',
        expected: 'number',
        current: typeof revision,
      });

      log?.failed({ error });
      throw error;
    }

    const variationId = data['variation_id'] as Type['variationId'];
    if (!variationId) {
      const error = this.errRequired('variationId');

      log?.failed({ error });
      throw error;
    }
    if (typeof variationId !== 'string') {
      const error = this.errType({
        name: 'variationId',
        expected: 'string',
        current: typeof variationId,
      });

      log?.failed({ error });
      throw error;
    }

    const vendorProducts = data['products'];
    if (!Array.isArray(vendorProducts)) {
      const error = this.errType({
        name: 'vendorProductIds',
        expected: 'array',
        current: typeof vendorProducts,
      });

      log?.failed({ error });
      throw error;
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

    log?.success(result);
    return new AdaptyPaywallCoder(result);
  }
}
