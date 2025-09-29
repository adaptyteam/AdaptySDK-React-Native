import { Def } from '@/types/schema';
import { AdaptyUiMediaCacheCoder } from '@/coders/adapty-ui-media-cache';

const mocks: Required<Def['AdaptyConfiguration']>['media_cache'][] = [
  {
    memory_storage_total_cost_limit: 100 * 1024 * 1024,
    memory_storage_count_limit: 2147483647,
    disk_storage_size_limit: 100 * 1024 * 1024,
  },
];

describe('AdaptyUiMediaCacheCoder', () => {
  const coder = new AdaptyUiMediaCacheCoder();

  it.each(mocks)('should encode/decode', mock => {
    const decoded = coder.decode(mock);
    const encoded = coder.encode(decoded);

    expect(encoded).toEqual(mock);
  });
});
