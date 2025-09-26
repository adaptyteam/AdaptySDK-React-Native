import type { AdaptyPlacement } from '../types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
type Model = AdaptyPlacement;
type Serializable = Def['AdaptyPlacement'];
export declare class AdaptyPlacementCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-placement.d.ts.map