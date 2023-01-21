import React from 'react';
import {Text} from 'react-native';
import {Group} from '../Group';
import {LineParam} from '../LineParam';
import {Line} from '../Line';
import {LineButton} from '../LineButton';

export const GroupProfile = ({profile, loading, onRequestUpdate}) => {
  const lvl = profile?.accessLevels?.premium;

  if (!lvl) {
    return (
      <Group title="Profile">
        <Line loading={loading}>
          <LineParam label="No subscriptions" value="" bordered />
          <LineButton
            text="Refresh"
            onPress={onRequestUpdate}
            loading={loading}
            bottomRadius
          />
        </Line>
      </Group>
    );
  }

  return (
    <Group title="Profile">
      <LineParam
        label="Premium active"
        value={lvl.isActive ? '✅' : '❌'}
        bordered
      />
      <LineParam
        label="isLifetime"
        value={String(lvl?.isLifetime || 'false')}
        bordered
      />
      <LineParam
        label="activatedAt"
        value={lvl.activatedAt?.toGMTString() ?? '-'}
        bordered
      />
      <LineParam
        label="renewedAt"
        value={lvl.renewedAt?.toGMTString() ?? '—'}
        bordered
      />
      <LineParam
        label="expiresAt"
        value={lvl.expiresAt?.toGMTString() ?? '—'}
        bordered
      />
      <LineParam
        label="willRenew"
        value={String(lvl?.willRenew || 'false')}
        bordered
      />
      <LineParam
        label="unsubscribedAt"
        value={lvl.unsubscribedAt?.toGMTString() ?? '—'}
        bordered
      />
      <LineParam
        label="cancellationReason"
        value={lvl.cancellationReason}
        bordered
      />
      <LineParam
        label="subscriptions"
        value={
          profile.subscriptions ? Object.keys(profile.subscriptions).length : 0
        }
        bordered
      />
      <LineParam
        label="nonSubscriptions"
        value={
          profile.nonSubscriptions
            ? Object.keys(profile.nonSubscriptions).length
            : 0
        }
        bordered
      />
      <LineButton
        text="Update"
        onPress={onRequestUpdate}
        loading={loading}
        bottomRadius
      />
    </Group>
  );
};
