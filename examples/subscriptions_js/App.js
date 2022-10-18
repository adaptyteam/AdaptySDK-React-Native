import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  ActivityIndicator,
} from 'react-native';

import {Header} from './components/Header';
import {colors} from './components/Colors';
import {ScreenInvalidCredentials} from './screens/ScreenInvalidCredentials';

const App = () => {
  const renderContent = () => {
    if (2 > 1) {
      // TODO: Replace with a check for valid credentials
      return <ScreenInvalidCredentials />;
    }

    return <ActivityIndicator margin={48} />;
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.primary10}}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary10} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Header />
        <View style={{backgroundColor: colors.white}}>{renderContent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
