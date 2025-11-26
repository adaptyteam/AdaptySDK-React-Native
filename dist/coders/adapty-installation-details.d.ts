import { AdaptyInstallationDetails } from '../types';
import type { Def } from '@/types/schema';
import { Converter } from './types';
export declare class AdaptyInstallationDetailsCoder implements Converter<AdaptyInstallationDetails, Def['AdaptyInstallationDetails']> {
    encode(model: AdaptyInstallationDetails): Def['AdaptyInstallationDetails'];
    decode(json: Def['AdaptyInstallationDetails']): AdaptyInstallationDetails;
}
//# sourceMappingURL=adapty-installation-details.d.ts.map