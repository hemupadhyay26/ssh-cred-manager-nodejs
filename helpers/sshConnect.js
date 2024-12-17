import { spawn } from "child_process";
import { loadCredentials } from "./helpers.js"; // Replace with your actual helper path
import chalk from "chalk";
import inquirer from "inquirer";
import figlet from "figlet"; // Import figlet
import stringSimilarity from "string-similarity";

// Gracefully handle unexpected exits and user interruptions
function setupExitHandlers() {
  process.on("uncaughtException", (err) => {
    console.error(chalk.red("\n❌ Something went wrong"));
    process.exit(1); // Exit with error code
  });

  process.on("SIGINT", () => {
    console.log(
      chalk.yellow("\n⚠️ Program interrupted by user (Ctrl+C). Exiting...")
    );
    process.exit(0); // Exit without error
  });

  process.on("SIGTERM", () => {
    console.log(chalk.yellow("\n⚠️ Program terminated. Exiting..."));
    process.exit(0); // Exit without error
  });
}

setupExitHandlers();

export async function sshIntoServer(identifier, pemKey = null, port = null) {
  const credentials = loadCredentials(); // Load credentials from the file

  // Ensure the identifier is in lowercase for case-insensitive comparison
  const normalizedIdentifier = identifier.trim().toLowerCase();

  // Find the credential by exact server name or ID
  const foundCredential = credentials.credentials.find(
    (cred) =>
      (cred.serverName &&
        cred.serverName.toLowerCase() === normalizedIdentifier) ||
      (cred.id && cred.id === parseInt(normalizedIdentifier, 10))
  );

  // If a perfect match is found, proceed to SSH
  if (foundCredential) {
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

    // Build SSH command options
    const sshArgs = [];
    if (pemKey) {
      sshArgs.push("-i", pemKey);
    }
    if (port) {
      sshArgs.push("-p", port);
    }
    sshArgs.push(sshCommand);

    console.log(chalk.green(`Using: ssh ${sshArgs.join(" ")}`));

    try {
      // Spawn a child process to execute the SSH command
      const sshProcess = spawn("ssh", sshArgs, {
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
          console.error(
            chalk.red(`\n❌ SSH session exited with code: ${code}`)
          );
        }
      });
    } catch (err) {
      console.error(chalk.red(`\n❌ Unexpected error: ${err.message}`));
    }
  } else {
    // Advanced Suggestion Logic
    const serverNames = credentials.credentials.map((cred) =>
      cred.serverName.toLowerCase()
    );

    // Substring Match and Fuzzy Matching
    const substringMatches = serverNames.filter((name) =>
      name.includes(normalizedIdentifier)
    );

    const similarityMatches = stringSimilarity
      .findBestMatch(normalizedIdentifier, serverNames)
      .ratings.filter((match) => match.rating > 0.3) // Adjust threshold as needed
      .map((match) => match.target);

    // Merge and Deduplicate Matches
    const suggestions = [
      ...new Set([...substringMatches, ...similarityMatches]),
    ];

    if (suggestions.length > 0) {
      // Prompt user to select from similar matches
      const { selectedServer } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedServer",
          message: "🔍 Did you mean one of these servers?",
          choices: suggestions,
        },
      ]);

      // Retry the function with the selected server name
      sshIntoServer(selectedServer, pemKey, port);
    } else {
      console.log(chalk.red("\n❌ No similar servers found."));
    }
  }
}

export async function sshViaListIntoServer(pemKey = null, port = null) {
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
          `${index + 1}. ${cred.serverName || "Unnamed"} (${cred.username}@$${
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
    sshIntoServer(selectedCredential.serverName || selectedIndex, pemKey, port);
  } else {
    console.log(chalk.red("\n❌ Invalid selection. Exiting..."));
  }
}
