import React from 'react';
import {View} from 'react-native';

export const Modal = ({children, visible, onRequestClose}) => {
  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={visible}
      onRequestClose={onRequestClose}>
      <View flex={1} justifyContent="center" alignItems="center">
        {children}
      </View>
    </Modal>
  );
};
