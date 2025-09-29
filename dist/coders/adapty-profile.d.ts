import type { AdaptyProfile } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptyProfile;
type Serializable = Def['AdaptyProfile'];
export declare class AdaptyProfileCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-profile.d.ts.map