import readline from "readline";
import { promptForServerNameAndAdd } from "../helpers/wizardCredential.js";

export function wizardCommand(program) {
  program
    .command("wizard")
    .alias("w")
    .description("Add multiple SSH credentials using wizard")
    .argument("[credentials...]", "List of SSH credentials (user@host)", [])
    .action((credentials) => {
      if (credentials.length === 0) {
        promptForCredentials();
        return;
      }
      // Process each user@host input from the provided credentials
      processCredentials(credentials);
    });

  // Function to handle multiple credentials from the command
  function processCredentials(input) {
    const credentials = input[0].split(",").map((cred) => cred.trim());
    promptForServerNameAndAdd(credentials);
  }

  // Prompt for multiple credentials if no credentials are provided
  function promptForCredentials() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      'Enter credentials in the format user@host (or type "exit" to stop): ',
      function handleInput(input) {
        if (input.toLowerCase() === "exit") {
          rl.close();
          return;
        }

        const credentials = input.split(",").map((cred) => cred.trim());
        processCredentials(credentials);
        rl.close();
      }
    );
  }
}
