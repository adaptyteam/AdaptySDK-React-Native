/**
 * Guards the public type surface: src/types/index.ts is an explicit
 * allowlist, so a new core model is invisible to consumers until it is
 * listed there. These are compile-time assertions — the runtime body only
 * exists so Jest has something to run.
 */
import type {
  AdaptyFlow,
  AdaptyFlowUiSchema,
  AdaptyFlowUiSchemaGrid,
  AdaptyFlowUiSchemaLayout,
  AdaptyPromotedProduct,
} from '@/types';

describe('public type exports', () => {
  it('exposes AdaptyPromotedProduct', () => {
    const product: AdaptyPromotedProduct = {
      vendorProductId: 'yearly.premium.6999',
      localizedDescription: 'Premium',
      localizedTitle: 'Yearly Premium',
    };

    expect(product.vendorProductId).toBe('yearly.premium.6999');
  });

  it('exposes the flow ui schema types', () => {
    const layout: AdaptyFlowUiSchemaLayout = { flowLayoutId: 'layout1' };
    const grid: AdaptyFlowUiSchemaGrid = {
      platforms: 'all',
      devices: ['phone'],
      cells: [0, 1],
    };
    const uiSchema: AdaptyFlowUiSchema = { layouts: [layout], grids: [grid] };

    expect(uiSchema.grids[0]?.cells).toStrictEqual([0, 1]);
  });

  it('exposes uiSchema on AdaptyFlow', () => {
    const uiSchema: AdaptyFlow['uiSchema'] = {
      layouts: [],
      grids: [{ cells: [] }],
    };

    expect(uiSchema?.grids).toHaveLength(1);
  });
});
