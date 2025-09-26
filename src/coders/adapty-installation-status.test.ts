import type { AdaptyInstallationStatus } from '@/types';
import type { Def } from '@/types/schema';
import { AdaptyInstallationStatusCoder } from '@/coders/adapty-installation-status';

type Model = AdaptyInstallationStatus;
type MockDef = Def['AdaptyInstallationStatus'];

const mocks: MockDef[] = [
  {
    status: 'not_available',
  },
  {
    status: 'not_determined',
  },
  {
    status: 'determined',
    details: {
      install_id: 'unique-install-id-12345',
      install_time: '2023-10-15T10:30:00.000Z',
      app_launch_count: 42,
      payload: 'custom-payload-data',
    },
  },
  {
    status: 'determined',
    details: {
      install_time: '2023-10-15T10:30:00.000Z',
      app_launch_count: 1,
      // Optional fields omitted
    },
  },
];

function toModel(mock: MockDef): Model {
  if (mock.status === 'determined') {
    return {
      status: 'determined',
      details: {
        installTime: new Date(mock.details.install_time),
        appLaunchCount: mock.details.app_launch_count,
        installId: mock.details.install_id,
        payload: mock.details.payload,
      },
    };
  } else {
    return {
      status: mock.status,
    };
  }
}

describe('AdaptyInstallationStatusCoder', () => {
  let coder: AdaptyInstallationStatusCoder;

  beforeEach(() => {
    coder = new AdaptyInstallationStatusCoder();
  });

  it.each(mocks)('should decode to expected result', mock => {
    const decoded = coder.decode(mock);

    expect(decoded).toStrictEqual(toModel(mock));
  });

  it.each(mocks)('should decode/encode', mock => {
    const decoded = coder.decode(mock);
    const encoded = coder.encode(decoded);

    expect(encoded).toStrictEqual(mock);
  });
});
