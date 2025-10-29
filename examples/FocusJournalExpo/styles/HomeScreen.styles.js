// styles/HomeScreen.styles.js

import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  label: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.surface,
    ...typography.body,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    ...typography.body,
    fontWeight: '600',
  },
  previewHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  previewTitle: {
    ...typography.h2,
    color: colors.text,
    fontSize: 18,
    marginBottom: spacing.xs,
  },
  previewSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  previewList: {
    marginTop: spacing.sm,
  },
  maskedItemContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  maskedDateText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  maskedContentContainer: {
    gap: spacing.xs,
  },
  maskedLine: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 4,
    width: '100%',
  },
  maskedLineShort: {
    width: '70%',
  },
});

