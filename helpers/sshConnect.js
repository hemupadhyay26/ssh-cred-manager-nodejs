import { spawn } from "child_process";
import { loadCredentials } from "./helpers.js"; // Replace with your actual helper path
import chalk from "chalk";
import inquirer from "inquirer";
import figlet from "figlet"; // Import figlet

// Function to fetch credentials and initiate SSH
export function sshIntoServer(identifier) {
  const credentials = loadCredentials(); // Load credentials from the file

  // Ensure the identifier is in lowercase for case-insensitive comparison
  const normalizedIdentifier = identifier.trim().toLowerCase();

  // Find the credential by server name or ID
  const foundCredential = credentials.credentials.find(
    (cred) =>
      (cred.serverName &&
        cred.serverName.toLowerCase() === normalizedIdentifier) ||
      (cred.id && cred.id === parseInt(normalizedIdentifier, 10))
  );

  if (!foundCredential) {
    console.log(
      chalk.yellow(
        `\n⚠️ No credentials found for the provided server name or ID: ${identifier}`
      )
    );
    return;
  }

  const { username, hostname, serverName } = foundCredential;
  const sshCommand = `${username}@${hostname}`; // SSH address

  console.log(chalk.blue(`\n🚀 Connecting to ${serverName}...`));

  // Use figlet to print the server name in ASCII art
  figlet(serverName, (err, data) => {
    if (err) {
      console.log(chalk.red("\n❌ Error generating server name art: "), err);
      return;
    }
    console.log(chalk.green(data)); // Display the server name as ASCII art
  });

  console.log(chalk.green(`Using: ssh ${sshCommand}`));

  try {
    // Spawn a child process to execute the SSH command
    const sshProcess = spawn("ssh", [sshCommand], {
      stdio: "inherit", // Attach to the current terminal's I/O
    });

    // Handle SSH process events
    sshProcess.on("error", (err) => {
      console.error(
        chalk.red(
          `\n❌ Error occurred while attempting to connect: ${err.message}`
        )
      );
    });

    sshProcess.on("close", (code) => {
      if (code === 0) {
        console.log(chalk.green("✅ SSH session closed successfully."));
      } else {
        console.error(chalk.red(`\n❌ SSH session exited with code: ${code}`));
      }
    });
  } catch (err) {
    console.error(chalk.red(`\n❌ Unexpected error: ${err.message}`));
  }
}

export async function sshViaListIntoServer() {
  const credentials = loadCredentials(); // Load credentials from file
  if (!credentials || credentials.credentials.length === 0) {
    console.log(
      chalk.red("\n❌ No SSH credentials found. Please add them first.")
    );
    return;
  }

  // No identifier provided; display table and prompt user
  console.log(chalk.blue("\nAvailable SSH Servers:"));
  console.log(
    credentials.credentials
      .map(
        (cred, index) =>
          `${index + 1}. ${cred.serverName || "Unnamed"} (${cred.username}@${
            cred.hostname
          })`
      )
      .join("\n")
  );

  // Prompt user to select a server
  const { selectedIndex } = await inquirer.prompt([
    {
      type: "number",
      name: "selectedIndex",
      message: "Enter the number of the server you want to connect to:",
      validate: (input) => {
        const index = parseInt(input, 10) - 1;
        return index >= 0 && index < credentials.credentials.length
          ? true
          : "Please enter a valid server number.";
      },
    },
  ]);

  const selectedCredential = credentials.credentials[selectedIndex - 1];
  if (selectedCredential) {
    console.log(
      chalk.green(
        `\nSelected: ${
          selectedCredential.serverName || selectedCredential.hostname
        }`
      )
    );
    sshIntoServer(selectedCredential.serverName || selectedIndex);
  } else {
    console.log(chalk.red("\n❌ Invalid selection. Exiting..."));
  }
}
