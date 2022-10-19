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
import {Progress} from './components/Progress';

const App = () => {
  const renderContent = () => {
    if (2 > 1) {
      // TODO: Replace with a check for valid credentials
      return null;
    }

    return <ActivityIndicator margin={48} />;
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.primary10}}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary10} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Header />
        <View style={{backgroundColor: colors.white}}>
          <Progress />

          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

async function readCredentials() {
  try {
    const credentials = await import('./.adapty-credentials.json');
    return credentials.token;
  } catch (error) {
    console.error(
      "Failed to read Adapty credentials. Please, follow the instructions in the example's README.md file to proceed.",
    );

    console.error(error);
  }
}
