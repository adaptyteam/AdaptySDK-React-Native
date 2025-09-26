import { Def } from '@/types/schema';
import { AdaptyProfileParametersCoder } from './adapty-profile-parameters';

const mocks: Def['AdaptyProfileParameters'][] = [
  {
    first_name: 'John',
    last_name: 'Doe',
    gender: 'm',
    birthday: '1990-01-01',
    email: 'john.doe@example.com',
    phone_number: '+123456789',
    att_status: 2,
    custom_attributes: { attr1: 'value1', attr2: 'value2' },
    analytics_disabled: false,
  },
];

describe('AdaptyProfileParametersCoder', () => {
  const coder = new AdaptyProfileParametersCoder();

  it.each(mocks)('should encode/decode', mock => {
    const decoded = coder.decode(mock);
    const encoded = coder.encode(decoded);

    expect(encoded).toEqual(mock);
  });
});
