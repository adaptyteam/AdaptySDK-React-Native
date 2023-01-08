import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  View,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
} from 'react-native';

import {formatDistance, format} from 'date-fns';
import {adapty} from 'react-native-adapty';

import {colors} from '../../components/Colors';
import {Body, H3} from '../../components/Text';
import {Section} from '../../components/Section';
import {SectionEmoji} from '../../components/SectionEmoji';
import {ScrollView} from 'react-native';

export const ScreenProfile = () => {
  const [profile, setProfile] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetch() {
    setIsLoading(true);
    setError(null);

    try {
      const profileRes = await adapty.getProfile();
      profileRes.accessLevels;
      setProfile(profileRes);
    } catch (adaptyError) {
      setError(adaptyError);
      console.error(adaptyError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, []);

  const renderHistory = () => {
    if (isLoading || !profile) {
      return null;
    }
    console.log('commiting', profile);
    const lvls = profile.accessLevels;

    if (Object.keys(lvls).length === 0) {
      return (
        <SectionEmoji emoji="🙊">
          You don't have any active access levels
        </SectionEmoji>
      );
    }

    return (
      <Section title="Your access levels">
        {Object.keys(lvls).map(levelName => {
          const access = lvls[levelName];

          return (
            <View>
              <Body style={styles.sectionContent}>
                {'\u2022 '}Your access level is{' '}
                <Body style={styles.importantText}>{access.id}</Body>
              </Body>

              <Body style={styles.sectionContent}>
                {'\u2022 '}Your status is{' '}
                <Body style={styles.importantText}>
                  {access.isActive ? 'active' : 'inactive'}
                </Body>
              </Body>

              <Body style={styles.sectionContent}>
                {'\u2022 '}Your status will expire{' '}
                <Body style={styles.importantText}>
                  {fmtDate(access.expiresAt)}
                </Body>
              </Body>

              <Body style={styles.sectionContent}>
                {'\u2022 '}Your status{' '}
                <Body style={styles.importantText}>
                  {access.willRenew ? 'will' : 'will not'}
                </Body>{' '}
                renew automatically
              </Body>

              <Body style={styles.sectionContent}>
                {'\u2022 '}You have initially unlocked this status, when you
                have purchased{' '}
                <Body style={styles.importantText}>
                  {access.vendorProductId}
                </Body>
              </Body>

              <Body style={styles.sectionContent}>
                {'\u2022 '}You unlocked this status, when you have purchased{' '}
                <Body style={styles.importantText}>
                  {fmtDate(access.activatedAt)}
                </Body>
              </Body>
            </View>
          );
        })}
      </Section>
    );
  };

  return (
    <ScrollView style={{height: '100%'}}>
      <View style={styles.profile}>
        <View style={styles.container}>
          <H3 style={styles.headerText}>Profile</H3>
          <TouchableOpacity
            disabled={!profile?.customerUserId}
            onPress={() => {
              if (profile?.customerUserId) {
                Clipboard.setString(profile?.customerUserId);
                Alert.alert(`"${profile?.customerUserId}" copied`);
              }
            }}>
            <Body>{profile?.customerUserId ?? 'No customer user ID'}</Body>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(profile?.profileId);
              Alert.alert(`"${profile?.profileId}" copied`);
            }}>
            <Body style={styles.preText}>[{profile?.profileId}]</Body>
          </TouchableOpacity>

          <View style={styles.wrapper}>
            <Button title="Refetch Profile" onPress={fetch} />
            <Button
              title="Update Profile"
              onPress={async () => {
                console.log('[ADAPTY]: Setting customer_user_id: ');

                try {
                  await adapty.updateProfile({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john_doe@example.com',
                    phone: '+1234567890',
                  });
                  // await fetch();
                } catch (error) {
                  console.log('[ADAPTY]: Error: ', error);
                }
              }}
            />
            <Button
              title="Restore Purchases"
              onPress={async () => {
                console.log('[ADAPTY]: Setting customer_user_id: ');

                try {
                  await adapty.restorePurchases();
                  await fetch();
                } catch (error) {
                  console.log('[ADAPTY]: Error: ', error);
                }
              }}
            />
            <Button
              title="Identify"
              onPress={async () => {
                Alert.prompt(
                  'Provide customer_user_id',
                  'You can later find it in Adapty Dashboard',
                  async value => {
                    console.log('[ADAPTY]: Setting customer_user_id: ', value);
                    if (value) {
                      await adapty.identify(value);
                      await fetch();
                    }
                  },
                );
              }}
            />
            <Button
              title="Logout"
              onPress={async () => {
                await adapty.logout();
                await fetch();
              }}
            />
          </View>

          <View style={{flexShrink: 0}}>{renderHistory()}</View>
        </View>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator style={styles.loadingIndicator} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profile: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    padding: 16,
    width: '100%',
    minHeight: '50%',
  },
  headerText: {
    marginBottom: 8,
  },
  preText: {
    color: colors.black60,
    fontSize: 12,
  },
  wrapper: {
    paddingVertical: 32,
    flexShrink: 0,
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    opacity: 0.5,
  },
  loadingIndicator: {
    flexGrow: 0,
    padding: 8,
    backgroundColor: colors.primary10,
    borderRadius: 50,
    borderWidth: 1,
    borderStyle: 'solid',
  },
});

function fmtDate(strDate) {
  const date = new Date(strDate);

  return `${formatDistance(date, new Date(), {addSuffix: true})} (${format(
    date,
    'dd/MM/yy HH:mm:ss',
  )})`;
}
