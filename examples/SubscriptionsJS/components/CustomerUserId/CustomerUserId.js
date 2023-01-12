import React, {useEffect, useState} from 'react';

import {Group} from '../Group';
import {LineButton} from '../LineButton';
import {LineInput} from '../LineInput';

export const CustomerUserId = ({
  profile,
  loading,
  onRequestIdentify = () => undefined,
}) => {
  const userId = profile?.customerUserId;

  const [processing, setProcessing] = useState(false);
  const [input, setInput] = useState(userId || '');

  useEffect(() => {
    setInput(userId || '');
  }, [userId]);

  return (
    <Group title="Customer User ID">
      <LineInput
        bordered
        loading={loading}
        value={input}
        placeholder="Enter customer user ID"
        onChange={value_ => setInput(value_)}
      />
      <LineButton
        text="Identify"
        disabled={input === (userId ?? '')}
        onPress={async () => {
          setProcessing(true);
          await onRequestIdentify(input);
          setProcessing(false);
        }}
        loading={processing}
        bottomRadius
      />
    </Group>
  );
};
