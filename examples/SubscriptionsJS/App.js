import React from 'react';
import {Button, Platform, Text} from 'react-native';
import {SFSymbol} from 'react-native-sfsymbols';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {adapty} from 'react-native-adapty';
import adaptyVersion from 'react-native-adapty/lib/dist/version';

import {readCredentials, useJsLogs} from './helpers';

import HomeScreen from './screens/Home';
import LogsScreen from './screens/Logs';
import LogPayloadScreen from './screens/LogPayload';

const Stack = createNativeStackNavigator();

async function init() {
  // Check credentials (only for this example)
  // This is for demonstation purposes only
  const token = await readCredentials();
  if (!token) {
    return;
  }

  try {
    console.info('[ADAPTY] Activating Adapty SDK...');
    // Async activate Adapty
    await adapty.activate(token, {
      lockMethodsUntilReady: true,
      logLevel: 'verbose',
      enableUsageLogs: true,
    });

    // Set fallback paywalls
    const json = await Platform.select({
      ios: import('./assets/ios_fallback.json'),
      android: import('./assets/android_fallback.json'),
    });
    const str = JSON.stringify(json); // Webpack converts json string to object, but we need string here
    await adapty.setFallbackPaywalls(str);
  } catch (error) {
    console.error('[ADAPTY] Error activating Adapty SDK', error.message);
  }
}

init();

const App = () => {
  const logs = useJsLogs();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: `react-native-adapty@${adaptyVersion}`,
              headerRight: () => <HeaderRightButton />,
            }}
          />
          <Stack.Screen
            name="Logs"
            options={{
              headerRight: () =>
                Platform.OS === 'ios' ? (
                  <SFSymbol
                    name="square.and.arrow.up"
                    scale="medium"
                    color="#4777FF"
                    size={20}
                    resizeMode="center"
                    style={{width: 20, height: 20}}
                  />
                ) : null,
            }}>
            {props => <LogsScreen {...props} logs={logs} />}
          </Stack.Screen>
        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'modal'}}>
          <Stack.Screen
            name="LogPayload"
            options={{
              title: 'Log payload',
            }}>
            {props => <LogPayloadScreen {...props} />}
          </Stack.Screen>
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HeaderRightButton = () => {
  const navigation = useNavigation();

  return <Button title="Logs" onPress={() => navigation.navigate('Logs')} />;
};

export default App;
