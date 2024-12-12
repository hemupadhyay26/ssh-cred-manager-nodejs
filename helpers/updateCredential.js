import fs from 'fs';
import readline from 'readline';
import chalk from 'chalk';
import { loadCredentials, saveCredentials } from './helpers.js';

// Function to update an existing SSH credential by ID or host
export function updateCredential(identifier) {
  const credentials = loadCredentials();
  let credentialToUpdate = null;

  // Find the credential by ID or host
  if (!isNaN(parseInt(identifier, 10))) {
    // Search by ID
    credentialToUpdate = credentials.credentials.find((cred) => cred.id === parseInt(identifier, 10));
  } else {
    // Search by host
    credentialToUpdate = credentials.credentials.find((cred) => cred.hostname === identifier);
  }

  if (credentialToUpdate) {
    // Show old credential details with enhanced formatting
    console.log(chalk.bold.cyan("\nCurrent Credential Details:"));
    console.log(`  ${chalk.bold.green('Username:')} ${credentialToUpdate.username}`);
    console.log(`  ${chalk.bold.green('Host:')} ${credentialToUpdate.hostname}`);
    console.log(`  ${chalk.bold.green('Server Name:')} ${credentialToUpdate.serverName}`);
    console.log(`  ${chalk.bold.green('Last Updated:')} ${credentialToUpdate.updatedAt ? chalk.yellow(new Date(credentialToUpdate.updatedAt).toLocaleString()) : 'Never'}`);

    // Prompt the user to update each field
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`${chalk.blue('Enter the new username')} (current: ${credentialToUpdate.username}): `, (newUsername) => {
      if (newUsername) credentialToUpdate.username = newUsername;

      rl.question(`${chalk.blue('Enter the new host')} (current: ${credentialToUpdate.hostname}): `, (newHost) => {
        if (newHost) credentialToUpdate.hostname = newHost;

        rl.question(`${chalk.blue('Enter the new server name')} (current: ${credentialToUpdate.serverName}): `, (newServerName) => {
          if (newServerName) credentialToUpdate.serverName = newServerName;

          // Update timestamp
          credentialToUpdate.updatedAt = Date.now(); // Add the updated timestamp

          // Save the updated credentials
          saveCredentials(credentials);

          // Final Confirmation of update with styling
          console.log(chalk.green(`\n✅ Credential updated successfully!`));
          console.log(`  ${chalk.bold.green('Updated Username:')} ${credentialToUpdate.username}`);
          console.log(`  ${chalk.bold.green('Updated Host:')} ${credentialToUpdate.hostname}`);
          console.log(`  ${chalk.bold.green('Updated Server Name:')} ${credentialToUpdate.serverName}`);
          console.log(`  ${chalk.bold.green('Updated At:')} ${chalk.yellow(new Date(credentialToUpdate.updatedAt).toLocaleString())}`);
          console.log(`\n`);

          rl.close();
        });
      });
    });
  } else {
    console.log(chalk.red(`\n❌ No credential found with identifier: ${identifier}`));
  }
}
