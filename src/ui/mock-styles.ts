import { StyleSheet } from 'react-native';

/**
 * Shared styles for mock UI components (AdaptyPaywallView, AdaptyOnboardingView).
 * These styles are used to display informative placeholders when native modules
 * are not available (Expo Go, Web).
 */
export const mockStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    maxWidth: 400,
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#004085',
    textAlign: 'center',
    lineHeight: 20,
  },
  noteBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 12,
  },
  noteText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 18,
  },
});
