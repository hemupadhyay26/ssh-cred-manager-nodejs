import readline from 'readline';
import { addCredential } from './addCredential.js';

// Function to extract and add a credential from input string (user@host)
export function extractAndAddCredential(input, serverName) {
  const match = input.match(/^(?<username>[^@]+)@(?<host>[^@]+)$/);
  if (match) {
    const { username, host } = match.groups;
    addCredential(host, username, serverName);
  } else {
    console.log("Invalid format. Please provide input in the format user@host.");
  }
}

// Function to prompt for server name and add each credential in the array
export function promptForServerNameAndAdd(credentials) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Iterate through each credential (user@host)
  function askForServerName(index) {
    if (index >= credentials.length) {
      rl.close(); // Close the readline interface once all credentials are processed
      return;
    }

    const credential = credentials[index];
    const [username, host] = credential.split('@');
    if (!host) {
      console.log(`Invalid format for credential: ${credential}`);
      askForServerName(index + 1); // Continue to next credential
      return;
    }

    rl.question(
      `Enter the server name for ${username}@${host}: `,
      (serverName) => {
        if (!serverName) {
          console.log("Server name is required. Please try again.");
          askForServerName(index); // Retry if server name is empty
          return;
        }
        extractAndAddCredential(`${username}@${host}`, serverName);
        askForServerName(index + 1); // Continue with the next credential
      }
    );
  }

  askForServerName(0); // Start processing from the first credential
}

// Get the current file directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Path to the credentials file
// const credentialsFilePath = path.join(__dirname, "../ssh_credentials.json");

// // Ensure the file exists, or create it with an empty structure
// if (!fs.existsSync(credentialsFilePath)) {
//   fs.writeFileSync(
//     credentialsFilePath,
//     JSON.stringify({ credentials: [] }, null, 2)
//   );
// }

// // Function to load credentials from the file
// export function loadCredentials() {
//   const fileContent = fs.readFileSync(credentialsFilePath, "utf-8");
//   return JSON.parse(fileContent);
// }

// // Function to save credentials to the file
// export function saveCredentials(data) {
//   fs.writeFileSync(credentialsFilePath, JSON.stringify(data, null, 2));
// }

// // Function to add a new SSH credential
// export function addCredential(host, username, serverName) {
//   const credentials = loadCredentials();

//   // Check if the credential already exists for the same username and host
//   const existingCredential = credentials.credentials.find(
//     (cred) => cred.hostname === host && cred.username === username
//   );

//   if (existingCredential) {
//     console.log(`Credential for ${username}@${host} already exists.`);
//     return;
//   }

//   const newCredential = {
//     id: Date.now(), // Unique identifier (timestamp-based)
//     username,
//     hostname: host,
//     serverName, // Added serverName field
//   };

//   credentials.credentials.push(newCredential);
//   saveCredentials(credentials);
//   console.log(
//     `Credential for ${username}@${host} (Server: ${serverName}) added successfully.`
//   );
// }

// // Command to list all stored SSH credentials
// export function listCredentials() {
//   const credentials = loadCredentials();
//   if (credentials.credentials.length === 0) {
//     console.log("No credentials stored.");
//   } else {
//     console.table(credentials.credentials);
//   }
// }

// // Command to delete an SSH credential by ID or host
// export function deleteCredential(identifier) {
//   const credentials = loadCredentials();
//   let updatedCredentials;

//   if (!isNaN(parseInt(identifier, 10))) {
//     // Identifier is a numeric ID
//     updatedCredentials = credentials.credentials.filter(
//       (cred) => cred.id !== parseInt(identifier, 10)
//     );
//   } else {
//     // Identifier is a host string
//     updatedCredentials = credentials.credentials.filter(
//       (cred) => cred.hostname !== identifier
//     );
//   }

//   if (updatedCredentials.length === credentials.credentials.length) {
//     console.log(`No credential found with identifier: ${identifier}`);
//   } else {
//     saveCredentials({ credentials: updatedCredentials });
//     console.log(
//       `Credential with identifier: ${identifier} deleted successfully.`
//     );
//   }
// }


// Function to update an existing SSH credential by ID or host
// export function updateCredential(identifier) {
//     const credentials = loadCredentials();
//     let credentialToUpdate = null;
  
//     // Find the credential by ID or host
//     if (!isNaN(parseInt(identifier, 10))) {
//       // Search by ID
//       credentialToUpdate = credentials.credentials.find((cred) => cred.id === parseInt(identifier, 10));
//     } else {
//       // Search by host
//       credentialToUpdate = credentials.credentials.find((cred) => cred.hostname === identifier);
//     }
  
//     if (credentialToUpdate) {
//       // Show old credential details with enhanced formatting
//       console.log(chalk.bold.cyan(`\nCurrent Credential Details:`));
//       console.log(`  ${chalk.bold.green('Username:')} ${credentialToUpdate.username}`);
//       console.log(`  ${chalk.bold.green('Host:')} ${credentialToUpdate.hostname}`);
//       console.log(`  ${chalk.bold.green('Server Name:')} ${credentialToUpdate.serverName}`);
//       console.log(`  ${chalk.bold.green('Last Updated:')} ${credentialToUpdate.updatedAt ? chalk.yellow(new Date(credentialToUpdate.updatedAt).toLocaleString()) : 'Never'}`);
  
//       // Prompt the user to update each field
//       const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//       });
  
//       rl.question(`${chalk.blue('Enter the new username')} (current: ${credentialToUpdate.username}): `, (newUsername) => {
//         if (newUsername) credentialToUpdate.username = newUsername;
  
//         rl.question(`${chalk.blue('Enter the new host')} (current: ${credentialToUpdate.hostname}): `, (newHost) => {
//           if (newHost) credentialToUpdate.hostname = newHost;
  
//           rl.question(`${chalk.blue('Enter the new server name')} (current: ${credentialToUpdate.serverName}): `, (newServerName) => {
//             if (newServerName) credentialToUpdate.serverName = newServerName;
  
//             // Update timestamp
//             credentialToUpdate.updatedAt = Date.now(); // Add the updated timestamp
  
//             // Save the updated credentials
//             saveCredentials(credentials);
  
//             // Final Confirmation of update with styling
//             console.log(chalk.bold.cyan(`\nCredential updated successfully!`));
//             console.log(`  ${chalk.bold.green('Updated Username:')} ${credentialToUpdate.username}`);
//             console.log(`  ${chalk.bold.green('Updated Host:')} ${credentialToUpdate.hostname}`);
//             console.log(`  ${chalk.bold.green('Updated Server Name:')} ${credentialToUpdate.serverName}`);
//             console.log(`  ${chalk.bold.green('Updated At:')} ${chalk.yellow(new Date(credentialToUpdate.updatedAt).toLocaleString())}`);
//             console.log(`\n`);
  
//             rl.close();
//           });
//         });
//       });
//     } else {
//       console.log(chalk.red(`\nNo credential found with identifier: ${identifier}`));
//     }
//   }
