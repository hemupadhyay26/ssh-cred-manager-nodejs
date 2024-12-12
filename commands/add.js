import readline from 'readline';
import chalk from 'chalk';  // Import chalk
import { addCredential } from '../helpers/addCredential.js';

export function addCommand(program) {
  program
    .command('add')
    .alias('a')
    .description('Add a new SSH credential')
    .option('-h, --host <host>', 'Host address')
    .option('-u, --username <username>', 'Username')
    .option('-s, --server <server>', 'Server name')
    .action((options) => {
      // Check if any of the options are missing and prompt for input if necessary
      if (!options.host || !options.username || !options.server) {
        console.log(chalk.cyan("\nIt looks like you're missing some details. Let's gather them interactively.\n"));
        promptForMissingData(options);
      } else {
        // If all options are provided, directly add the credential
        console.log(chalk.green(`\nAdding SSH credential for ${options.username}@${options.host}...\n`));
        addCredential(options.host, options.username, options.server);
        console.log(chalk.green('Credential successfully added!\n'));
      }
    });
}

// Function to prompt for missing data interactively
function promptForMissingData(options) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let host = options.host || '';
  let username = options.username || '';
  let server = options.server || '';

  // Prompt for host if not provided
  if (!host) {
    rl.question(chalk.yellow('Please enter the host address: '), (answer) => {
      host = answer.trim();
      // If host is still empty, prompt again
      if (!host) {
        console.log(chalk.red('\nError: Host address is required!\n'));
        rl.close();
        return;
      }
      // Prompt for username if not provided
      promptForUsername();
    });
  } else {
    // If host is provided, just prompt for username
    console.log(chalk.cyan('\nHost address found. Moving on to the username...\n'));
    promptForUsername();
  }

  function promptForUsername() {
    if (!username) {
      rl.question(chalk.yellow('Please enter the username: '), (answer) => {
        username = answer.trim();
        if (!username) {
          console.log(chalk.red('\nError: Username is required!\n'));
          rl.close();
          return;
        }
        // Prompt for server if not provided
        promptForServer();
      });
    } else {
      // If username is provided, just prompt for server
      console.log(chalk.cyan('\nUsername found. Moving on to the server name...\n'));
      promptForServer();
    }
  }

  function promptForServer() {
    if (!server) {
      rl.question(chalk.yellow('Please enter the server name: '), (answer) => {
        server = answer.trim();
        if (!server) {
          console.log(chalk.red('\nError: Server name is required!\n'));
          rl.close();
          return;
        }

        console.log(chalk.cyan('\nAdding credential now...\n'));
        // Add the credential once all fields are filled
        addCredential(host, username, server);
        rl.close();
      });
    } else {
      // If server is provided, just add the credential
      console.log(chalk.cyan('\nServer name found. Adding credential...\n'));
      addCredential(host, username, server);
      rl.close();
    }
  }
}
