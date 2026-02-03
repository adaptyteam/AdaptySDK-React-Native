import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { AdaptyMockConfig } from '@/mock/types';

/**
 * Creates and activates an Adapty instance with mock configuration
 */
export async function createAdaptyInstance(
  config?: Partial<AdaptyMockConfig>,
): Promise<Adapty> {
  // Reset bridge to ensure clean state for each test
  resetBridge();

  const adapty = new Adapty();

  // Default config
  const defaultConfig: Partial<AdaptyMockConfig> = {
    premiumAccessLevelId: 'config_premium',
    autoGrantPremium: true,
  };

  // Merge config, allowing undefined to override defaults
  const mergedConfig: Partial<AdaptyMockConfig> = {
    ...defaultConfig,
    ...config,
  };

  // If premiumAccessLevelId is explicitly set to undefined, remove it
  if (
    config &&
    'premiumAccessLevelId' in config &&
    config.premiumAccessLevelId === undefined
  ) {
    delete mergedConfig.premiumAccessLevelId;
  }

  await adapty.activate('test_api_key', {
    enableMock: true,
    mockConfig: mergedConfig,
    logLevel: 'error', // Suppress logs during test
  });

  return adapty;
}

/**
 * Cleans up Adapty instance by removing all listeners
 */
export function cleanupAdapty(adapty: Adapty): void {
  adapty.removeAllListeners();
}
