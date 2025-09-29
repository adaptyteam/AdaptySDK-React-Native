import { Def } from '@/types/schema';
import { AdaptyUiDialogConfigCoder } from '@/coders/adapty-ui-dialog-config';

const mocks: Def['AdaptyUI.DialogConfiguration'][] = [
  {
    default_action_title: 'default_action_title',
    secondary_action_title: 'secondary_action_title',
    title: 'title',
    content: 'content',
  },
  {
    default_action_title: 'default_action_title2',
  },
];

describe('AdaptyUiDialogConfigCoder', () => {
  const coder = new AdaptyUiDialogConfigCoder();

  it.each(mocks)('should encode/decode', mock => {
    const decoded = coder.decode(mock);
    const encoded = coder.encode(decoded);

    expect(encoded).toEqual(mock);
  });
});
