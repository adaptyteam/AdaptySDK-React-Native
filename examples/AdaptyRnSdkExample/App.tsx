/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { Button, Platform, Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { adapty, GetPaywallForDefaultAudienceParamsInput } from 'react-native-adapty';
import adaptyVersion from 'react-native-adapty/dist/version';

import { readCredentials, useJsLogs } from './src/helpers';
import { PlacementId } from './src/constants';

import HomeScreen from './src/screens/Home';
import LogsScreen from './src/screens/Logs';
import LogPayloadScreen from './src/screens/LogPayload';

const Stack = createNativeStackNavigator();

async function init() {
  // Check credentials (only for this example)
  // This is for demonstration purposes only
  const token = await readCredentials();
  if (!token) {
    return;
  }

  try {
    console.info('[ADAPTY] Activating Adapty SDK...');
    // Async activate Adapty
    await adapty.activate(token, {
      logLevel: 'verbose',
    });

    let params: GetPaywallForDefaultAudienceParamsInput = {
      fetchPolicy: 'reload_revalidating_cache_data',
    };

    // Get paywall for default audience
    adapty.getPaywallForDefaultAudience(PlacementId.Standard, undefined, params);
  } catch (error: any) {
    console.warn('[ADAPTY] Error activating Adapty SDK', error.message);
  }
}

init();

const App: React.FC = () => {
  const logs = useJsLogs();

  useEffect(() => {
    adapty.addEventListener('onLatestProfileLoad', data => {
      console.log('NEW PROFILE EVENT', data);
    });

    return () => {
      // Unsubscribe from adapty events
      console.log('[ADAPTY] Unsubscribing from adapty events');
      adapty.removeAllListeners();
    };
  }, []);

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
              headerRight: () => Platform.OS === 'ios' ? (
                <Text style={{ color: '#4777FF', fontSize: 20 }}>📋</Text>
              ) : null,
            }}>
            {(props: any) => <LogsScreen {...props} logs={logs} />}
          </Stack.Screen>
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name="LogPayload"
            options={{
              title: 'Log payload',
            }}>
            {(props: any) => <LogPayloadScreen {...props} />}
          </Stack.Screen>
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HeaderRightButton: React.FC = () => {
  const navigation = useNavigation<any>();

  return <Button title="Logs" onPress={() => navigation.navigate('Logs')} />;
};

export default App;
