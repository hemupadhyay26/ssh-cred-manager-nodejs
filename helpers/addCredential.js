import fs from 'fs';
import chalk from 'chalk';
import { loadCredentials, saveCredentials } from './helpers.js';

// Function to add a new SSH credential
export function addCredential(host, username, serverName) {
  const credentials = loadCredentials();

  // Check if the credential already exists for the same username and host
  const existingCredential = credentials.credentials.find(
    (cred) => cred.hostname === host && cred.username === username
  );

  if (existingCredential) {
    console.log(chalk.red(`\n❌ Credential for ${username}@${host} already exists.`));
    return;
  }

  const newCredential = {
    id: Date.now(), // Unique identifier (timestamp-based)
    username,
    hostname: host,
    serverName, // Added serverName field
    updatedAt: Date.now(), // Timestamp of when the credential was added
  };

  credentials.credentials.push(newCredential);
  saveCredentials(credentials);
  console.log(chalk.green(`\n✅ Credential for ${username}@${host} (Server: ${serverName}) added successfully.`));
}
