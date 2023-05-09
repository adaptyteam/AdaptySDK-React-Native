import React from 'react';
import {ActivityIndicator, View, TextInput} from 'react-native';

import {Line} from '../Line';

export const LineInput = ({
  value = '',
  placeholder = '',
  editable = true,
  loading = false,
  topRadius = false,
  bottomRadius = false,
  bordered = false,
  onChange = () => undefined,
}) => {
  return (
    <Line bordered={bordered} topRadius={topRadius} bottomRadius={bottomRadius}>
      <TextInput
        value={value}
        autoCapitalize="none"
        editable={editable}
        style={{
          fontSize: 15,
          ...(!editable && {color: '#8E8E93FF'}),
        }}
        placeholder={placeholder}
        onChangeText={text => onChange(text)}
      />
      {loading && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            right: 16,
            marginVertical: 10,
          }}>
          <ActivityIndicator />
        </View>
      )}
    </Line>
  );
};
