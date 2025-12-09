// Constants for error messages
const ADAPTY_PREFIX = '[ADAPTY]';
const CREDENTIALS_FILE = '.adapty-credentials.json';
const CREDENTIALS_COMMAND = "Please run 'yarn run credentials' to generate the credentials file.";

// Import credentials at the module level
let credentials: { token?: string; placement_id?: string };

try {
  credentials = require('../.adapty-credentials.json');
} catch (error) {
  throw new Error(
    `${ADAPTY_PREFIX} Failed to read Adapty credentials from ${CREDENTIALS_FILE} file. ${CREDENTIALS_COMMAND}`
  );
}

// This function is only for this example
export function readCredentials(): string {
  if (!credentials?.token) {
    throw new Error(`${ADAPTY_PREFIX} Token not found in ${CREDENTIALS_FILE} file. ${CREDENTIALS_COMMAND}`);
  }
  return credentials.token;
}

// This function is only for this example  
export function readPlacementId(): string {
  if (!credentials?.placement_id) {
    throw new Error(`${ADAPTY_PREFIX} Placement ID not found in ${CREDENTIALS_FILE} file. ${CREDENTIALS_COMMAND}`);
  }
  return credentials.placement_id;
}

