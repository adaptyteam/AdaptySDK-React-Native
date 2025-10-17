import { AdaptyInstallationStatus, AdaptyInstallationDetails } from '@/types';
import type { Def } from '@/types/schema';
import { Converter } from './types';
import { DateCoder } from './date';

export class AdaptyInstallationStatusCoder
  implements
    Converter<AdaptyInstallationStatus, Def['AdaptyInstallationStatus']>
{
  encode(model: AdaptyInstallationStatus): Def['AdaptyInstallationStatus'] {
    if (model.status === 'determined') {
      const details: Def['AdaptyInstallationDetails'] = {
        install_time: new DateCoder().encode(model.details.installTime),
        app_launch_count: model.details.appLaunchCount,
      };

      if (model.details.installId) {
        details.install_id = model.details.installId;
      }

      if (model.details.payload) {
        details.payload = model.details.payload;
      }

      return {
        status: 'determined',
        details,
      };
    }

    return {
      status: model.status,
    };
  }

  decode(json: Def['AdaptyInstallationStatus']): AdaptyInstallationStatus {
    if (json.status === 'determined') {
      const details: AdaptyInstallationDetails = {
        installTime: new DateCoder().decode(json.details.install_time),
        appLaunchCount: json.details.app_launch_count,
        installId: json.details.install_id,
        payload: json.details.payload,
      };

      return {
        status: 'determined',
        details,
      };
    }

    return {
      status: json.status,
    };
  }
}
