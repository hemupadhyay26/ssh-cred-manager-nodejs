import { loadCredentials, saveCredentials } from './helpers.js';
import chalk from 'chalk';

// Command to delete SSH credentials by ID
export function deleteCredentials(identifiers) {
  // Ensure that identifiers is an array
  if (typeof identifiers === 'string') {
    identifiers = identifiers.split(','); // Split by comma if passed as a string
  }

  const credentials = loadCredentials();
  let updatedCredentials = [...credentials.credentials];

  // Iterate through the identifiers and filter out the credentials by ID
  identifiers.forEach((identifier) => {
    identifier = identifier.trim(); // Clean up the identifier (remove any leading/trailing spaces)

    if (isNaN(parseInt(identifier, 10))) {
      // If identifier is not a valid number, show an error
      console.log(chalk.red(`\n⚠️ Invalid identifier '${identifier}', must be a numeric ID.`));
      return;
    }

    console.log(chalk.green('Deleting credentials...\n'));
    const id = parseInt(identifier, 10);
    updatedCredentials = updatedCredentials.filter((cred) => cred.id !== id); // Remove the credential by id
  });

  // Check if any credentials were deleted
  const deletedCredentialsCount = credentials.credentials.length - updatedCredentials.length;

  if (deletedCredentialsCount === 0) {
    console.log(chalk.yellow(`\n⚠️ No credentials found for the provided IDs.`));
  } else {
    saveCredentials({ credentials: updatedCredentials });
    console.log(chalk.green(`\n✅ Successfully deleted ${deletedCredentialsCount} credential(s).`));
  }
}
