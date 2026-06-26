import { AdaptyFlowView } from './AdaptyFlowView';

describe('AdaptyFlowView observer props', () => {
  it('accepts onObserverPurchaseInitiated and onObserverRestoreInitiated props', () => {
    // Type-level assertion: the element must accept the observer props.
    // NOTE: in the embedded <AdaptyFlowView>, the handler return value is
    // IGNORED for closing — the close-on-`true` flag only applies to the
    // imperative FlowViewController. So these handlers return void here.
    const element = (
      <AdaptyFlowView
        flow={{ id: 'flow-1' } as any}
        onObserverPurchaseInitiated={(_product, onStart, onFinish) => {
          onStart();
          onFinish();
        }}
        onObserverRestoreInitiated={(onStart, onFinish) => {
          onStart();
          onFinish();
        }}
      />
    );

    expect(element.props.onObserverPurchaseInitiated).toBeInstanceOf(Function);
    expect(element.props.onObserverRestoreInitiated).toBeInstanceOf(Function);
  });
});
