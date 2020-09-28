export class AdaptyError {
  public title: string;
  public description?: string;

  constructor({ title, description }: { title: string; description: string }) {
    this.title = title;
    this.description = description;
  }
}

export function attemptToDecodeError(
  swiftError: Record<string, any>,
): AdaptyError {
  const DEFAULT_TITLE = 'Adapty has thrown an error';
  const DEFAULT_DESC = 'Adapty has thrown an undefined error';

  const title = swiftError.code || DEFAULT_TITLE;
  const description = swiftError.message || DEFAULT_DESC;

  return new AdaptyError({
    title,
    description,
  });
}

/** @throws AdaptyError */
export function isSdkAuthorized(isAuthorized: boolean): void {
  if (!isAuthorized) {
    throw new AdaptyError({
      title: 'Adapty SDK not initialized',
      description: 'Please, init adapty with useAdapty or activateAdapty',
    });
  }
}
