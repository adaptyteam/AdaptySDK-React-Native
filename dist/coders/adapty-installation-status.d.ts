import { AdaptyInstallationStatus } from '../types';
import type { Def } from '@/types/schema';
import { Converter } from './types';
export declare class AdaptyInstallationStatusCoder implements Converter<AdaptyInstallationStatus, Def['AdaptyInstallationStatus']> {
    encode(model: AdaptyInstallationStatus): Def['AdaptyInstallationStatus'];
    decode(json: Def['AdaptyInstallationStatus']): AdaptyInstallationStatus;
}
//# sourceMappingURL=adapty-installation-status.d.ts.map