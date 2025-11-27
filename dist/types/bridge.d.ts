import type { EmitterSubscription } from 'react-native';
import type { AdaptyProfile, AdaptyInstallationDetails } from '../types';
import type { AdaptyError } from '../adapty-error';
export type MethodName = (typeof MethodNames)[number];
/**
 * Types of values that can be passed
 * to the bridge without corruption
 */
export type Serializable = string | number | boolean | string[] | null | undefined;
/**
 * Interface of error that emit from native SDK
 */
export interface AdaptyNativeError {
    adaptyCode: number;
    message: string;
    detail?: string | undefined;
}
/**
 * Interface of error that was raised by native bridge
 */
export interface AdaptyBridgeError {
    errorType: string;
    name?: string;
    type?: string;
    underlyingError?: string;
    description?: string;
}
interface EventMap {
    onLatestProfileLoad: string;
    onInstallationDetailsSuccess: string;
    onInstallationDetailsFail: string;
}
export type UserEventName = keyof EventMap;
export type AddListenerGeneric<E extends UserEventName, Data> = (event: E, callback: (data: Data) => void | Promise<void>) => EmitterSubscription;
export type AddListenerFn = AddListenerGeneric<'onLatestProfileLoad', AdaptyProfile> | AddListenerGeneric<'onInstallationDetailsSuccess', AdaptyInstallationDetails> | AddListenerGeneric<'onInstallationDetailsFail', AdaptyError>;
export {};
//# sourceMappingURL=bridge.d.ts.map