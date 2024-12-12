import { loadCredentials } from './helpers.js'; // Import the loadCredentials function
import chalk from 'chalk';

export function getHostnames(servernames) {
  // Convert the comma-separated string into an array of servernames, and normalize to lowercase
  const servernameArray = servernames.split(',').map((item) => item.trim().toLowerCase());

  // Load stored credentials
  const credentials = loadCredentials();

  // Iterate through each servername in the array
  servernameArray.forEach((servername) => {
    // Filter the credentials based on servername or ID (normalize both to lowercase)
    const foundCredentials = credentials.credentials.filter(
      (cred) => 
        (cred.serverName && cred.serverName.toLowerCase() === servername) || 
        (cred.id && cred.id === parseInt(servername, 10))
    );

    // If no credentials were found for the server, log a message
    if (foundCredentials.length === 0) {
      console.log(chalk.yellow(`\n⚠️ No credentials found for the provided server name or ID: ${servername}\n`));
      return;
    }

    // Show the hostname(s) for each matching server
    foundCredentials.forEach((cred) => {
      console.log(chalk.green(`\n✅ IP for ${cred.serverName || servername} is: ${cred.hostname}\n`));
    });
  });
}
