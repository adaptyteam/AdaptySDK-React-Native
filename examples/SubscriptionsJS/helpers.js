// readCredentials handles generated credentials
// This function is only for this example
export async function readCredentials() {
  try {
    const credentials = await import('./.adapty-credentials.json');
    return credentials.token;
  } catch (error) {
    console.error(
      "[ADAPTY] Failed to read Adapty credentials. Please, follow the instructions in the example's README.md file to proceed.",
    );

    console.error(error);
  }
}
