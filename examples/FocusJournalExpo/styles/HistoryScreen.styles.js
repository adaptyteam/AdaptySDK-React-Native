// styles/HistoryScreen.styles.js

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  itemContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  dateText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  entryText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
});

