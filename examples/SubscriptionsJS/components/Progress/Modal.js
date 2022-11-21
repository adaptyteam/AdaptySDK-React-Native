import React from 'react';
import {StatusBar} from 'react-native';
import {View, Modal as RNModal} from 'react-native';

export const Modal = ({children, visible, onRequestClose}) => {
  return (
    <RNModal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={visible}
      onRequestClose={onRequestClose}>
      {visible && <StatusBar barStyle={'light-content'} />}
      <View flex={1} justifyContent="center" alignItems="center">
        {children}
      </View>
    </RNModal>
  );
};
