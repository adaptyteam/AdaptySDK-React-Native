import type { Def } from '@/types/schema';
import type { AdaptyAccessLevel } from '../types';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptyAccessLevel;
type Serializable = Def['AdaptyProfile.AccessLevel'];
export declare class AdaptyAccessLevelCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-access-level.d.ts.map