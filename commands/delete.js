import readline from 'readline';
import chalk from 'chalk'; // Import Chalk
import { deleteCredentials } from '../helpers/deleteCredential.js';

export function deleteCommand(program) {
  program
    .command('delete')
    .alias('d')
    .description('Delete SSH credentials by ID or host')
    .option(
      '-i, --identifiers <identifiers>',
      'Comma-separated list of identifiers (IDs)',
      (val) => val.split(',').map((item) => item.trim()) // Split and trim the input string
    )
    .action((options) => {
      if (!options.identifiers || options.identifiers.length === 0) {
        console.log(chalk.cyan("\nIt looks like you're missing some identifiers. Let's gather them interactively.\n"));
        promptForIdentifiers();
      } else {
        console.log(chalk.green(`\nDeleting credentials for: ${options.identifiers.join(', ')}...\n`));
        deleteCredentials(options.identifiers); // Call deleteCredentials function with the provided identifiers
      }
    });
}

// Function to prompt for identifiers interactively
function promptForIdentifiers() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    chalk.yellow('Please enter the identifiers (IDs or hostnames) separated by commas: '),
    (answer) => {
      const identifiers = answer
        .split(',')
        .map((item) => item.trim()) // Split the input and trim whitespace
        .filter((item) => item); // Remove any empty values
      
      if (identifiers.length === 0) {
        console.log(chalk.red('\nError: You must provide at least one identifier.\n'));
        rl.close();
        return;
      }

      console.log(chalk.cyan(`\nYou entered the following identifiers: ${identifiers.join(', ')}.\n`));
      deleteCredentials(identifiers); // Call the delete function with the provided identifiers
      rl.close();
    }
  );
}
