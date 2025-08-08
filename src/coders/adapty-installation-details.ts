import { AdaptyInstallationDetails } from '@/types';
import type { Def } from '@/types/schema';
import { Converter } from './types';
import { DateCoder } from './date';

export class AdaptyInstallationDetailsCoder
  implements
    Converter<AdaptyInstallationDetails, Def['AdaptyInstallationDetails']>
{
  encode(model: AdaptyInstallationDetails): Def['AdaptyInstallationDetails'] {
    const result: Def['AdaptyInstallationDetails'] = {
      install_time: new DateCoder().encode(model.installTime),
      app_launch_count: model.appLaunchCount,
    };

    if (model.installId) {
      result.install_id = model.installId;
    }

    if (model.payload) {
      result.payload = model.payload;
    }

    return result;
  }

  decode(json: Def['AdaptyInstallationDetails']): AdaptyInstallationDetails {
    return {
      installTime: new DateCoder().decode(json.install_time),
      appLaunchCount: json.app_launch_count,
      installId: json.install_id,
      payload: json.payload,
    };
  }
}
