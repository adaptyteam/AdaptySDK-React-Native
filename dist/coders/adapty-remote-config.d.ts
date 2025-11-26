import type { AdaptyRemoteConfig } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { Coder } from './coder';
type Model = AdaptyRemoteConfig;
type CodableModel = Omit<Model, 'dataString'>;
type Serializable = Required<Def['AdaptyPaywall']>['remote_config'];
export declare class AdaptyRemoteConfigCoder extends Coder<Model, CodableModel, Serializable> {
    protected properties: Properties<CodableModel, Serializable>;
    decode(data: Serializable): Model;
    encode(data: Model): Serializable;
}
export {};
//# sourceMappingURL=adapty-remote-config.d.ts.map