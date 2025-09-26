import { generateId } from '@/utils/generate-id';

describe('generateId', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns predictable id with mocked Math.random', () => {
    const values = [0.1, 0.2, 0.3];
    let idx = 0;
    jest
      .spyOn(Math, 'random')
      .mockImplementation(() => values[idx++ % values.length]!);
    const id = generateId();
    const expected = values
      .map(v => v.toString(36).slice(2))
      .join('')
      .slice(0, 12);
    expect(id).toBe(expected);
  });

  it('generates unique values across multiple calls', () => {
    const count = 200;
    const ids = new Set<string>();
    for (let i = 0; i < count; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(count);
  });

  it('matches expected format', () => {
    const id = generateId();
    expect(/^[a-z0-9]{12}$/.test(id)).toBe(true);
  });
});
