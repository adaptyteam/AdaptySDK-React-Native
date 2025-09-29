import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptyUiMediaCache } from '../ui/types';
type Model = AdaptyUiMediaCache;
type Serializable = Required<Def['AdaptyConfiguration']>['media_cache'];
export declare class AdaptyUiMediaCacheCoder extends SimpleCoder<Model, Serializable> {
    protected properties: Properties<Model, Serializable>;
}
export {};
//# sourceMappingURL=adapty-ui-media-cache.d.ts.map