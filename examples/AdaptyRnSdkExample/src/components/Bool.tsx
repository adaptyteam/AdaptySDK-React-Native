import React from 'react';
import { Text } from 'react-native';

interface BoolProps {
  value: boolean | null | undefined;
}

export const Bool: React.FC<BoolProps> = ({ value }) => {
  const text = value === true ? '✅' : value === false ? '❌' : '-';
  return <Text style={{ fontSize: 16 }}>{text}</Text>;
};
