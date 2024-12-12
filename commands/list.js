import { listCredentials } from '../helpers/listCredentials.js';

export function listCommand(program) {
  program
    .command('list')
    .alias('l')
    .description('List all stored SSH credentials')
    .action(() => {
      listCredentials();
    });
}
