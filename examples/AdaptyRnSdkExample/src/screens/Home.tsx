import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Alert,
  Dimensions,
  Text,
  View,
  Platform,
} from 'react-native';

import {
  adapty,
  AdaptyError,
  AppTrackingTransparencyStatus,
  AdaptyProfile,
  Gender,
} from 'react-native-adapty';

import { colors } from '../components/Colors';
import { Group } from '../components/Group';
import { Line } from '../components/Line';
import { LineButton } from '../components/LineButton';
import { LineParam } from '../components/LineParam';
import { Bool } from '../components/Bool';
import { PaywallSection } from '../components/PaywallSection';
import { dateFormat } from '../helpers';

const height = Dimensions.get('window').height;

interface AccessLevel {
  isActive: boolean;
  isLifetime?: boolean;
  activatedAt?: Date;
  renewedAt?: Date;
  expiresAt?: Date;
  willRenew?: boolean;
  unsubscribedAt?: Date;
  cancellationReason?: string;
}

const Home: React.FC = () => {
  const [profile, setProfile] = useState<AdaptyProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const fetchProfile = async (shouldAlert = false) => {
    setIsLoadingProfile(true);

    try {
      console.info('[ADAPTY] Fetching user profile...');
      const _profile = await adapty.getProfile();
      setProfile(_profile);
    } catch (error: any) {
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
      if (!adapty.isActivated()) {
        return;
      }
      fetchProfile();

      adapty.addEventListener(
        'onLatestProfileLoad',
        (profile_: AdaptyProfile) => {
          console.info('[ADAPTY] onLatestProfileLoad', profile_);
          setProfile(profile_);
        },
      );
    }
    fetch();

    return () => {
      // Unsubscribe from adapty events
      console.log('[ADAPTY] Unsubscribing from adapty events');
      adapty.removeAllListeners();
    };
  }, []);

  const lvl = profile?.accessLevels?.premium as AccessLevel | undefined;

  return (
    <View style={{ height, flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary10} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{ height: 20 }} />

        <Group title="Adapty Profile ID" postfix="👆 Tap to show">
          <Line
            loading={isLoadingProfile}
            topRadius
            bottomRadius
            onPress={() => {
              if (profile?.profileId) {
                Alert.alert('Profile ID', profile.profileId);
              }
            }}
          >
            <Text style={{ fontSize: 15, flexShrink: 1 }}>
              {profile?.profileId || ' '}
            </Text>
          </Line>
        </Group>

        {/* Profile Information */}
        <Group title="Profile">
          {!lvl ? (
            <>
              <LineParam label="No subscriptions" value="" bordered />
              <LineButton
                text="Refresh"
                onPress={() => fetchProfile(true)}
                loading={isLoadingProfile}
                bottomRadius
              />
            </>
          ) : (
            <>
              <LineParam
                label="Premium"
                value={<Bool value={lvl.isActive} />}
                bordered
              />
              <LineParam
                label="isLifetime"
                value={<Bool value={lvl?.isLifetime} />}
                bordered
              />
              <LineParam
                label="activatedAt"
                value={dateFormat(lvl.activatedAt)}
                bordered
              />
              <LineParam
                label="renewedAt"
                value={dateFormat(lvl.renewedAt)}
                bordered
              />
              <LineParam
                label="expiresAt"
                value={dateFormat(lvl.expiresAt)}
                bordered
              />
              <LineParam
                label="willRenew"
                value={<Bool value={lvl?.willRenew} />}
                bordered
              />
              <LineParam
                label="unsubscribedAt"
                value={dateFormat(lvl.unsubscribedAt)}
                bordered
              />
              <LineParam
                label="cancellationReason"
                value={lvl.cancellationReason || '-'}
                bordered
              />
              <LineParam
                label="subscriptions"
                value={
                  profile?.subscriptions
                    ? Object.keys(profile.subscriptions).length
                    : 0
                }
                bordered
              />
              <LineParam
                label="nonSubscriptions"
                value={
                  profile?.nonSubscriptions
                    ? Object.keys(profile.nonSubscriptions).length
                    : 0
                }
                bordered
              />
              <LineButton
                text="Update"
                onPress={() => fetchProfile(true)}
                loading={isLoadingProfile}
                bottomRadius
              />
            </>
          )}
        </Group>

        {/* Paywall Section */}
        <PaywallSection />

        {/* Other Actions */}
        <Group title="Other Actions">
          <LineButton
            text="Restore purchases"
            bordered
            topRadius
            onPress={async () => {
              try {
                console.log('[ADAPTY]: Restoring purchases...');
                const result = await adapty.restorePurchases();
                console.log('[ADAPTY] Restored purchases:', result);
                // 'onLatestProfileLoad' event should be triggered to update profile
              } catch (error: any) {
                console.log('[ADAPTY]: Failed to restore: ', error.message);

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
                console.log('[ADAPTY]: Updating profile...');
                const result = await adapty.updateProfile({
                  appTrackingTransparencyStatus:
                    AppTrackingTransparencyStatus.Authorized,
                  codableCustomAttributes: {
                    foo: null,
                  },
                  email: 'john@example.com',
                  phoneNumber: '+14325671098',
                  firstName: 'John',
                  lastName: 'Lennon',
                  gender: Gender.Male,
                });
                console.log('[ADAPTY] Updated profile:', result);
              } catch (error: any) {
                console.log(
                  '[ADAPTY]: Failed to update profile: ',
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
          <LineButton
            text="Update attribution"
            bordered
            onPress={async () => {
              try {
                console.log('[ADAPTY]: Updating custom attribution...');
                const result = await adapty.updateAttribution(
                  {
                    status: 'non_organic',
                    channel: 'Google Ads',
                    campaign: 'Adapty in-app',
                    ad_group: 'adapty ad_group',
                    ad_set: 'adapty ad_set',
                    creative: '12312312312312',
                  },
                  'custom',
                );
                console.log('[ADAPTY]: Updated custom attribution:', result);
              } catch (error: any) {
                console.log(
                  '[ADAPTY]: Failed to update custom attribution: ',
                  error.message,
                );

                if (error instanceof AdaptyError) {
                  Alert.alert(
                    `Error updating attribution #${error.adaptyCode}`,
                    error.localizedDescription,
                  );
                }
              }
            }}
          />

          <LineButton
            text="Get activation status"
            bordered
            onPress={async () => {
              try {
                let isActivated = await adapty.isActivated();
                console.log('isActivated:', isActivated);
                Alert.alert('isActivated:', `${isActivated}`);
              } catch (error: any) {
                console.error(
                  '[ADAPTY] Error checking activation status',
                  error.message,
                );
                if (error instanceof AdaptyError) {
                  Alert.alert(
                    `Error checking activation status #${error.adaptyCode}`,
                    error.localizedDescription,
                  );
                }
              }
            }}
          />
          {Platform.OS === 'ios' && (
            <LineButton
              text="Present code redemption sheet (ios)"
              bottomRadius
              onPress={async () => {
                console.log('[ADAPTY]: presenting code redemption sheet');
                const result = await adapty.presentCodeRedemptionSheet();
                console.log(
                  '[ADAPTY] Presented code redemption sheet:',
                  result,
                );
              }}
            />
          )}
        </Group>
      </ScrollView>
    </View>
  );
};

export default Home;
