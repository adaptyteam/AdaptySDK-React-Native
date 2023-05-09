import React from 'react';
import {Group} from '../Group';
import {LineParam} from '../LineParam';
import {Line} from '../Line';
import {LineButton} from '../LineButton';
import {Bool} from '../Bool';
import {dateFormat} from '../../helpers';

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
      <LineParam label="renewedAt" value={dateFormat(lvl.renewedAt)} bordered />
      <LineParam label="expiresAt" value={dateFormat(lvl.expiresAt)} bordered />
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
