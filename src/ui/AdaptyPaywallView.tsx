import React, { memo, useEffect, useMemo } from 'react';
import {
  requireNativeComponent,
  ViewProps,
} from 'react-native';
import { AdaptyPaywall } from '@/types';
import { AdaptyPaywallCoder } from '@/coders/adapty-paywall';
import { AdaptyUICreatePaywallViewParamsCoder } from '@/coders';
import { generateId } from '@/utils/generate-id';
import { CreatePaywallViewParamsInput, EventHandlers } from './types';
import { registerEventHandlers, DEFAULT_PARAMS } from './view-controller';

export type Props = ViewProps & {
  paywall: AdaptyPaywall;
  params?: CreatePaywallViewParamsInput;
  eventHandlers?: Partial<EventHandlers>;
};

type NativeAdaptyPaywallViewProps = ViewProps & {
  viewId: string;
  paywallJson: string;
};

const NativeAdaptyPaywallView = requireNativeComponent<NativeAdaptyPaywallViewProps>(
  'AdaptyPaywallView',
);

const AdaptyPaywallViewComponent: React.FC<Props> = ({
  paywall,
  params,
  eventHandlers,
  ...rest
}) => {
  const uniqueViewId = useMemo(
    () => `${paywall.id}_${generateId()}`,
    [paywall.id],
  );

  const paywallJson = useMemo(() => {
    const encodedPaywall = new AdaptyPaywallCoder().encode(paywall);
    const paramsWithDefaults = { ...DEFAULT_PARAMS, ...params };
    const encodedParams = new AdaptyUICreatePaywallViewParamsCoder().encode(paramsWithDefaults);
    return JSON.stringify({ paywall: encodedPaywall, ...encodedParams });
  }, [paywall, params]);

  useEffect(() => {
    const unsubscribe = registerEventHandlers(eventHandlers ?? {}, uniqueViewId);
    return unsubscribe;
  }, [uniqueViewId, eventHandlers]);

  return (
    <NativeAdaptyPaywallView
      {...rest}
      viewId={uniqueViewId}
      paywallJson={paywallJson}
    />
  );
};

export const AdaptyPaywallView = memo(AdaptyPaywallViewComponent);
