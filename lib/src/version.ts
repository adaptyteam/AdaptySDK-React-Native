let version: string | undefined;

export function GET_VERSION(): string {
  if (!version) {
    const packageJsonPath = require.resolve('../../package.json');
    const packageJson = require(packageJsonPath);
    version = packageJson.version;
  }

  return version as string;
}
