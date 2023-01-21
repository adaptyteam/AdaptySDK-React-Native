import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {formatDistance, format} from 'date-fns';

import {adapty, AdaptyError} from 'react-native-adapty';
import {colors} from '../../components/Colors';
import {Section} from '../../components/Section';
import {SectionEmoji} from '../../components/SectionEmoji';
import {Body, H4} from '../../components/Text';

export const ScreenSubscribed = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [access, setAccess] = useState(null);

  useEffect(() => {
    async function fetch() {
      // Now, of course, we could pass purchaser info via props
      // Here is an alternative — Adapty has a cache for everything it fetches for you
      // So, following fetch would not make any network request and would try to return value immediately
      // Same thing applies to paywalls, products, etc.
      setIsLoading(true);
      try {
        const result = await adapty.purchases.getInfo({forceUpdate: false});

        // Same as in App.js, you would probably have one static access level name
        // Here we make it compatible with any app
        Object.keys(result.accessLevels).map(levelName => {
          const accessLevel = result.accessLevels[levelName];
          if (accessLevel.isActive) {
            setAccess(accessLevel);
          }
        });

        // result.subscriptions.ada.activatedAt;

        // subscriptions are historical data of user purchases, probably of little interest for your app
        setHistoricalData(Object.values(result.subscriptions));
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <SectionEmoji emoji="🫥">Failed to fetch your status</SectionEmoji>
        <Section title="If you get this error">
          {error instanceof AdaptyError
            ? error.localizedDescription
            : 'This error is most likely caused by a problem with your Adapty API key or your Adapty account.'}
        </Section>
      </View>
    );
  }

  // Renders a whole bunch of information about user's current access level
  const renderAccessInfo = () => {
    if (!access) {
      // Should be unreacheable
      return (
        <SectionEmoji emoji="🙊">
          You don't have any active access levels
        </SectionEmoji>
      );
    }

    return (
      <Section title="About your access" style={styles.section}>
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
            {'\u2022 '}You have initially unlocked this status, when you have
            purchased{' '}
            <Body style={styles.importantText}>{access.vendorProductId}</Body>
          </Body>

          <Body style={styles.sectionContent}>
            {'\u2022 '}You unlocked this status, when you have purchased{' '}
            <Body style={styles.importantText}>
              {fmtDate(access.activatedAt)}
            </Body>
          </Body>
        </View>
      </Section>
    );
  };

  const renderHistoricalData = () => {
    if (historicalData.length === 0) {
      // Should be unreacheable
      return (
        <SectionEmoji emoji="🙊">
          You don't have any historical data
        </SectionEmoji>
      );
    }
    return (
      <Section title="Your historical data" style={styles.section}>
        {historicalData
          .sort((a, b) => {
            // Sort by freshness
            var dateA = new Date(a.renewedAt);
            var dateB = new Date(b.renewedAt);

            return dateB - dateA;
          })
          .map(purchase => (
            <View key={purchase.vendorProductId}>
              <H4>
                {purchase.vendorProductId}{' '}
                <H4 style={purchase.isActive ? styles.active : styles.inactive}>
                  ({purchase.isActive ? 'active' : 'inactive'})
                </H4>
              </H4>
              <Body>starts {fmtDate(purchase.activatedAt)}</Body>
              <Body>expires {fmtDate(purchase.expiresAt)}</Body>
              <Body>last renewed {fmtDate(purchase.renewedAt)}</Body>
              <Body>Lifetime: {purchase.isLifetime ? 'true' : 'false'}</Body>
              <Body>
                Grace period: {purchase.isInGracePeriod ? 'true' : 'false'}
              </Body>
              <Body>Sandbox: {purchase.isSandbox ? 'true' : 'false'}</Body>
              <Body>Refunded: {purchase.isRefund ? 'true' : 'false'}</Body>
            </View>
          ))}
      </Section>
    );
  };
  return (
    <View style={styles.container}>
      <SectionEmoji emoji="🥳">You are subscribed</SectionEmoji>
      {renderAccessInfo()}
      {renderHistoricalData()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginVertical: 16,
  },
  sectionContent: {
    marginVertical: 4,
  },
  importantText: {
    fontWeight: 'bold',
  },
  active: {
    color: colors.green40,
  },
  inactive: {
    color: colors.red40,
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // opacity: 0.8,
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
