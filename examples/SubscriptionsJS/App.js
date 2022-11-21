import React, {useEffect, useState} from 'react';
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
import {adapty, activateAdapty} from 'react-native-adapty';
import {ScreenPaywallList} from './screens/ScreenPaywallList';
import {ScreenSubscribed} from './screens/ScreenSubscribed';

const App = () => {
  // This is for demonstation purposes only
  // Since your app will have static credentials, validating is redundant in your case,
  // In this example this flag is used to show debug screen info
  const [areCredentialsValid, setCredentialsValid] = useState(null);
  // This is for demonstation purposes only
  // This check is optional whereas you put Adapty activation in the root component,
  // In this example this flag is used to show debug screen info
  const [isAdaptyActivated, setIsAdaptyActivated] = useState(null);
  // This is for demonstation purposes only
  // checks, whether user access level is fetched
  const [isUserAccessFetched, setIsUserAccessFetched] = useState(null);

  // This check is what you most probably want to use in your app
  // to show user a premium content
  const [isUserSubscribed, setIsUserSubscribed] = useState(null);

  useEffect(() => {
    async function init() {
      // Check credentials (only for this example)
      const token = await readCredentials();

      if (!token) {
        setCredentialsValid(false);
        return;
      }
      setCredentialsValid(true);

      console.info('[ADAPTY] Activating Adapty SDK...');
      // Async activate Adapty
      await activateAdapty({sdkKey: token});
      setIsAdaptyActivated(true);

      // Set a listener to handle purchases or status updates
      // such as subscription expiration.
      // I think it is better to set uo a listener right after initialization
      adapty.addEventListener('onInfoUpdate', info => {
        console.info('[ADAPTY] event `onInfoUpdate` event received');

        Object.keys(info.accessLevels).forEach(accessLevelName => {
          const accessLevel = info.accessLevels[accessLevelName];
          setIsUserSubscribed(accessLevel.isActive);

          console.info(
            `[ADAPTY] from received event: new access level '${accessLevelName}' status = `,
            accessLevel.isActive ? 'ACTIVE' : 'INACTIVE',
          );
        });
      });

      // Check if user is subscribed on your app mount
      console.info('[ADAPTY] Checking user subscription status...');
      const info = await adapty.purchases.getInfo();
      setIsUserAccessFetched(true);

      // In your app you will statically know names of your access levels
      // it would probably be "premium" (set up in Adapty dashboard)
      // So you can check user status as `info.accessLevels.premium.isActive`
      // Most probably you will have only one access level
      //
      // This example handles a case when you don't know a name of an access level
      let hasActiveSubscription = false;

      Object.keys(info.accessLevels).forEach(accessLevelName => {
        const accessLevel = info.accessLevels[accessLevelName];
        if (accessLevel.isActive) {
          hasActiveSubscription = true;
        }

        setIsUserSubscribed(accessLevel.isActive);

        console.info(
          `[ADAPTY] User status for access level '${accessLevel.id}':`,
          accessLevel.isActive ? 'active' : 'inactive',
        );
      });

      if (!hasActiveSubscription) {
        console.info('[ADAPTY] User has no access levels');
        setIsUserSubscribed(false);
      }
    }

    init();

    return () => {
      // Unsubscribe from adapty events
      console.log('[ADAPTY] Unsubscribing from adapty events');
      adapty.removeAllListeners();
    };
  }, []);

  // Display content for subscribed users
  const renderPremiumContent = () => {
    switch (isUserSubscribed) {
      case null:
        // Wait until we get user subscription status
        return <ActivityIndicator margin={48} />;
      case false:
        // User is not subscribed, show a paywall
        return <ScreenPaywallList />;
      case true:
        // User is subscribed, show premium content
        return <ScreenSubscribed />;
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.primary10}}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary10} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Header />
        <View style={{backgroundColor: colors.white}}>
          <Progress
            credentials={areCredentialsValid}
            activation={isAdaptyActivated}
            access={isUserAccessFetched}
          />
          {renderPremiumContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

// readCredentials handles generated credentials
// This function is only for this example
async function readCredentials() {
  try {
    const credentials = await import('./.adapty-credentials.json');
    return credentials.token;
  } catch (error) {
    console.error(
      "[ADAPTY] Failed to read Adapty credentials. Please, follow the instructions in the example's README.md file to proceed.",
    );

    console.error(error);
  }
}
