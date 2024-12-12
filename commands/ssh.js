import { sshIntoServer, sshViaListIntoServer } from '../helpers/sshConnect.js'; // Path to your SSH function
import chalk from 'chalk'; // For interactive prompts

export function sshCommand(program) {
  program
    .command('ssh [identifier]')
    .description('SSH into a server using the server name or ID')
    .action(async (identifier) => {
      try {
        if (!identifier || identifier.trim() === '') {
          await sshViaListIntoServer()
        } else {
          // Identifier provided; attempt to connect directly
          sshIntoServer(identifier);
        }
      } catch (error) {
        // Graceful error handling to prevent unwanted logs
        console.error(chalk.red(`\n❌ Something went wrong: ${error.message}`));
      }
    });
}
