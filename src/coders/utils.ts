export const formatDateUTC = (date: Date): string => {
  const pad = (num: number, digits: number = 2): string => {
    const str = num.toString();
    const paddingLength = digits - str.length;
    return paddingLength > 0 ? '0'.repeat(paddingLength) + str : str;
  };

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const millis = pad(date.getUTCMilliseconds(), 3);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${millis}Z`;
};

export const colorToHex = {
  fromARGB(value: number): string {
    const hex = value.toString(16).padStart(8, '0');
    return `#${hex.slice(2)}${hex.slice(0, 2)}`;
  },
  fromRGBA(value: number): string {
    return `#${value.toString(16).padStart(8, '0')}`;
  },
  fromRGB(value: number): string {
    return `#${value.toString(16).padStart(6, '0')}ff`;
  },
};

export const extractBase64Data = (input: string): string => {
  const commaIndex = input.indexOf(',');
  if (input.startsWith('data:') && commaIndex !== -1) {
    return input.slice(commaIndex + 1);
  }
  return input;
};

import type { FileLocation } from '@/types/inputs';

type PlatformSelector<T> = { ios: T; android: T };

export const resolveAssetId = (
  asset:
    | { relativeAssetPath: string }
    | { fileLocation: FileLocation },
  select: <T>(spec: PlatformSelector<T>) => T | undefined,
): string => {
  if ('relativeAssetPath' in asset) {
    return select({ ios: asset.relativeAssetPath, android: `${asset.relativeAssetPath}a` }) || '';
  }

  const fileLocation = asset.fileLocation;
  return (
    select({
      ios: fileLocation.ios.fileName,
      android: 'relativeAssetPath' in fileLocation.android
        ? `${fileLocation.android.relativeAssetPath}a`
        : `${(fileLocation.android as any).rawResName}r`,
    }) || ''
  );
};
