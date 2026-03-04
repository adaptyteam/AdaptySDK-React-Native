declare global {
    var expo: {
        modules?: {
            ExpoGo?: boolean;
        };
    };
}
/**
 * Returns a boolean value whether the app is running in Expo Go.
 */
export declare function isRunningInExpoGo(): boolean;
/**
 * Determines if mock mode should be enabled.
 * Mock mode is enabled in Expo Go or when running on web platform.
 * This is useful for environments where native modules are not available.
 *
 * @returns {boolean} true if running in Expo Go or on web, false otherwise
 */
export declare function shouldEnableMock(): boolean;
//# sourceMappingURL=env-detection.d.ts.map