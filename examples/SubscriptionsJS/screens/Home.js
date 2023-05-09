import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  Alert,
  Dimensions,
  Text,
  Clipboard,
  Platform,
  View,
} from 'react-native';

import {
  adapty,
  AdaptyError,
  AppTrackingTransparencyStatus,
} from 'react-native-adapty';
import adaptyVersion from 'react-native-adapty/lib/dist/version';

import {colors} from '../components/Colors';
import {Group} from '../components/Group';
import {Line} from '../components/Line';
import {CustomerUserId} from '../components/CustomerUserId/CustomerUserId';
import {LineButton} from '../components/LineButton';
import {GroupPaywall} from '../components/GroupPaywall';
import {GroupProfile} from '../components/GroupProfile';
import {LineParam} from '../components/LineParam';

const height = Dimensions.get('window').height;

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const fetchProfile = async (shouldAlert = false) => {
    setIsLoadingProfile(true);

    try {
      console.info('[ADAPTY] Fetching user profile...');
      const _profile = await adapty.getProfile();
      setProfile(_profile);
    } catch (error) {
      console.error('[ADAPTY] Error fetching user profile', error.message);

      if (shouldAlert && error instanceof AdaptyError) {
        Alert.alert(
          `Error fetching user profile ${error.adaptyCode}`,
          error.localizedDescription,
        );
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    async function fetch() {
      fetchProfile();

      adapty.addEventListener('onLatestProfileLoad', profile_ => {
        console.info('[ADAPTY] onLatestProfileLoad', profile_);
        setProfile(profile_);
      });
    }
    fetch();

    return () => {
      // Unsubscribe from adapty events
      console.log('[ADAPTY] Unsubscribing from adapty events');
      adapty.removeAllListeners();
    };
  }, []);

  return (
    <View
      style={{
        height,
        flex: 1,
      }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary10} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{height: 20}} />

        <Group title="Adapty Profile ID" postfix="👆 Tap to copy">
          <Line
            loading={isLoadingProfile}
            topRadius
            bottomRadius
            onPress={() => {
              Clipboard.setString(profile?.profileId);
            }}>
            <Text style={{fontSize: 15, flexShrink: 1}}>
              {profile?.profileId || ' '}
            </Text>
          </Line>
        </Group>

        <CustomerUserId
          profile={profile}
          loading={isLoadingProfile}
          onRequestIdentify={id => {
            try {
              console.log('[ADAPTY] Identifying user...', id);
              adapty.identify(id);
            } catch (error) {
              console.log('[ADAPTY] Identify Error:', error.message);

              if (error instanceof AdaptyError) {
                Alert.alert(
                  `Error identifying profile ${error.adaptyCode}`,
                  error.localizedDescription,
                );
              }
            }
          }}
        />

        <GroupProfile
          profile={profile}
          onRequestUpdate={() => fetchProfile(true)}
        />

        <GroupPaywall
          paywallId="example_ab_test"
          postfix="This is an example `example_ab_test` paywall and its content"
        />
        <GroupPaywall />

        <Group title="Other Actions">
          <LineButton
            text="Restore purchases"
            bordered
            topRadius
            onPress={async () => {
              try {
                console.log('[ADPTY]: Restoring purchases...');
                await adapty.restorePurchases();
                // 'onLatestProfileLoad' event should be triggered to update profile
              } catch (error) {
                console.log('[ADPTY]: Failed to restore: ', error.message);

                if (error instanceof AdaptyError) {
                  Alert.alert(
                    `Error restoring products #${error.adaptyCode}`,
                    error.localizedDescription,
                  );
                }
              }
            }}
          />
          <LineButton
            text="Update profile"
            bordered
            onPress={async () => {
              try {
                console.log('[ADPTY]: Updating profile...');
                await adapty.updateProfile({
                  appTrackingTransparencyStatus:
                    AppTrackingTransparencyStatus.Authorized,
                  codableCustomAttributes: {
                    foo: null,
                  },
                });
              } catch (error) {
                console.log(
                  '[ADPTY]: Failed to update profile: ',
                  error.message,
                );
                if (error instanceof AdaptyError) {
                  Alert.alert(
                    `Error updating profile #${error.adaptyCode}`,
                    error.localizedDescription,
                  );
                }
              }
            }}
          />
          {/* <LineButton
            text="Update attribution"
            bordered
            onPress={async () => {
              try {
                console.log('[ADPTY]: Restoring purchases...');
                await adapty.restorePurchases();
                // 'onLatestProfileLoad' event should be triggered to update profile
              } catch (error) {
                console.log('[ADPTY]: Failed to restore: ', error.message);

                if (error instanceof AdaptyError) {
                  Alert.alert(
                    `Error restoring products #${error.adaptyCode}`,
                    error.localizedDescription,
                  );
                }
              }
            }}
          /> */}
          <LineButton
            text="Send onboarding order 1"
            bordered
            onPress={async () => {
              try {
                console.log('[ADPTY]: logging onboarding...');
                await adapty.logShowOnboarding(1, 'rn_example', 'rn_1');
              } catch (error) {
                console.log(
                  '[ADPTY]: Failed to log onboarding: ',
                  error.message,
                );

                if (error instanceof AdaptyError) {
                  Alert.alert(
                    `Error logging onboarding #${error.adaptyCode}`,
                    error.localizedDescription,
                  );
                }
              }
            }}
          />
          <LineButton
            text="Send onboarding order 2"
            bordered
            onPress={async () => {
              try {
                console.log('[ADPTY]: logging onboarding...');
                await adapty.logShowOnboarding(2, 'rn_example', 'rn_2');
              } catch (error) {
                console.log(
                  '[ADPTY]: Failed to log onboarding: ',
                  error.message,
                );

                if (error instanceof AdaptyError) {
                  Alert.alert(
                    `Error logging onboarding #${error.adaptyCode}`,
                    error.localizedDescription,
                  );
                }
              }
            }}
          />
          <LineButton
            text="Send onboarding order 3"
            bordered
            onPress={async () => {
              try {
                console.log('[ADPTY]: logging onboarding...');
                await adapty.logShowOnboarding(3, 'rn_example', 'rn_3');
              } catch (error) {
                console.log(
                  '[ADPTY]: Failed to log onboarding: ',
                  error.message,
                );

                if (error instanceof AdaptyError) {
                  Alert.alert(
                    `Error logging onboarding #${error.adaptyCode}`,
                    error.localizedDescription,
                  );
                }
              }
            }}
          />
          {Platform.OS === 'ios' && (
            <LineButton
              text="Present code redemption sheet"
              bottomRadius
              onPress={async () => {
                console.log('[ADPTY]: presenting code redemption sheet');
                adapty.presentCodeRedemptionSheet();
              }}
            />
          )}
        </Group>

        <Group title="Attribution">
          <LineButton
            text="Adjust"
            bordered
            topRadius
            onPress={async () => {
              try {
                console.log('[ADAPTY] Updating Adjust attribution...');
                await adapty.updateAttribution(
                  JSON.stringify({
                    data: {
                      af_message: 'organic install',
                      af_status: 'Organic',
                      is_first_launch: 'true',
                    },
                    status: 'success',
                    type: 'onInstallConversionDataLoaded',
                  }),
                  'adjust',
                  'divan',
                );
                console.log('[ADAPTY] Adjust Attribution updated successfully');
              } catch (error) {
                console.log('[ADAPTY] Error:', error.message);
              }
            }}
          />
          <LineButton
            text="AppsFlyer"
            bordered
            onPress={async () => {
              try {
                console.log('[ADAPTY] Updating AppsFlyer attribution...');
                await adapty.updateAttribution(
                  JSON.stringify({
                    data: {
                      af_message: 'organic install',
                      af_status: 'Organic',
                      is_first_launch: 'true',
                    },
                    status: 'success',
                    type: 'onInstallConversionDataLoaded',
                  }),
                  'appsflyer',
                  'divan',
                );
                console.log(
                  '[ADAPTY] AppsFlyer Attribution updated successfully',
                );
              } catch (error) {
                console.log('[ADAPTY] Error:', error.message);
              }
            }}
          />
          <LineButton
            text="Branch"
            bottomRadius
            onPress={async () => {
              try {
                console.log('[ADAPTY] Updating Branch attribution...');
                await adapty.updateAttribution(
                  JSON.stringify({
                    data: {
                      af_message: 'organic install',
                      af_status: 'Organic',
                      is_first_launch: 'true',
                    },
                    status: 'success',
                    type: 'onInstallConversionDataLoaded',
                  }),
                  'branch',
                  'divan',
                );
                console.log('[ADAPTY] Branch Attribution updated successfully');
              } catch (error) {
                console.log('[ADAPTY] Error:', error.message);
              }
            }}
          />
        </Group>

        <Group>
          <LineButton
            red
            text="Logout"
            topRadius
            bottomRadius
            onPress={async () => {
              try {
                console.log('[ADPTY]: Logging out...');
                await adapty.logout();
                await fetchProfile(true);
              } catch (error) {
                console.log('[ADPTY]: Failed to logout: ', error.message);

                if (error instanceof AdaptyError) {
                  Alert.alert(
                    `Error logging out #${error.adaptyCode}`,
                    error.localizedDescription,
                  );
                }
              }
            }}
          />
        </Group>

        <Group>
          <LineParam label="SDK Version" value={`RN@${adaptyVersion}`} />
          {/* {logs.map((log, index) => (
            <LineParam key={index} label={log.logLevel} value={log.message} />
          ))} */}
        </Group>
      </ScrollView>
    </View>
  );
};

export default Home;
