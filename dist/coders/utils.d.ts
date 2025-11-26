export declare const formatDateUTC: (date: Date) => string;
export declare const colorToHex: {
    fromARGB(value: number): string;
    fromRGBA(value: number): string;
    fromRGB(value: number): string;
};
export declare const extractBase64Data: (input: string) => string;
import type { FileLocation } from '../types/inputs';
type PlatformSelector<T> = {
    ios: T;
    android: T;
};
export declare const resolveAssetId: (asset: {
    relativeAssetPath: string;
} | {
    fileLocation: FileLocation;
}, select: <T>(spec: PlatformSelector<T>) => T | undefined) => string;
export {};
//# sourceMappingURL=utils.d.ts.map