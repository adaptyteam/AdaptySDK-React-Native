import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';
import { AdaptyUiMediaCache } from '@/ui/types';

type Model = AdaptyUiMediaCache;
type Serializable = Required<Def['AdaptyConfiguration']>['media_cache'];

export class AdaptyUiMediaCacheCoder extends SimpleCoder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    memoryStorageTotalCostLimit: {
      key: 'memory_storage_total_cost_limit',
      required: false,
      type: 'number',
    },
    memoryStorageCountLimit: {
      key: 'memory_storage_count_limit',
      required: false,
      type: 'number',
    },
    diskStorageSizeLimit: {
      key: 'disk_storage_size_limit',
      required: false,
      type: 'number',
    },
  };
}
