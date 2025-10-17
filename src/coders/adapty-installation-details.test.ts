import type { AdaptyInstallationDetails } from '@/types';
import type { Def } from '@/types/schema';
import { AdaptyInstallationDetailsCoder } from '@/coders/adapty-installation-details';

type Model = AdaptyInstallationDetails;
type MockDef = Def['AdaptyInstallationDetails'];

const mocks: MockDef[] = [
  {
    install_id: 'unique-install-id-12345',
    install_time: '2023-10-15T10:30:00.000Z',
    app_launch_count: 42,
    payload: 'custom-payload-data',
  },
  {
    install_time: '2023-10-15T10:30:00.000Z',
    app_launch_count: 1,
    // Optional fields omitted
  },
];

function toModel(mock: MockDef): Model {
  return {
    installTime: new Date(mock.install_time),
    appLaunchCount: mock.app_launch_count,
    installId: mock.install_id,
    payload: mock.payload,
  };
}

describe('AdaptyInstallationDetailsCoder', () => {
  let coder: AdaptyInstallationDetailsCoder;

  beforeEach(() => {
    coder = new AdaptyInstallationDetailsCoder();
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
