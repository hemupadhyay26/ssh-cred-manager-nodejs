import { loadCredentials } from './helpers.js';
import chalk from 'chalk';

// Command to list all stored SSH credentials
export function listCredentials() {
  const credentials = loadCredentials();
  
  if (credentials.credentials.length === 0) {
    console.log(chalk.yellow("\n⚠️ No credentials stored."));
  } else {
    console.log(chalk.cyan("\n--- List of Stored Credentials ---"));

    // Format each credential and add formatted date
    const formattedCredentials = credentials.credentials.map((cred) => {
      // Format the updatedAt field to a readable date string
      const formattedDate = cred.updatedAt 
        ? new Date(cred.updatedAt).toLocaleString() // Convert timestamp to local date string
        : 'Never'; // If updatedAt is not set, display 'Never'

      // Return the formatted credential
      return {
        'Server Name': cred.serverName,
        'Username': cred.username,
        'Host': cred.hostname,
        'id': cred.id
      };
    });

    // Display the credentials in a table format
    console.table(formattedCredentials);
  }
}
