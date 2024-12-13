import { sshIntoServer, sshViaListIntoServer } from '../helpers/sshConnect.js'; // Path to your SSH function
import chalk from 'chalk'; // For interactive prompts

export function sshCommand(program) {
  program
    .command('ssh [identifier]')
    .description('SSH into a server using the server name or ID')
    .option('-k, --key <pemKey>', 'Path to PEM key for authentication')
    .option('-p, --port <port>', 'Port to use for SSH connection')
    .action(async (identifier, options) => {
      try {
        const { key: pemKey, port } = options;

        if (!identifier || identifier.trim() === '') {
          await sshViaListIntoServer(pemKey, port);
        } else {
          // Identifier provided; attempt to connect directly
          sshIntoServer(identifier, pemKey, port);
        }
      } catch (error) {
        // Graceful error handling to prevent unwanted logs
        console.error(chalk.red(`\n❌ Something went wrong: ${error.message}`));
      }
    });
}
