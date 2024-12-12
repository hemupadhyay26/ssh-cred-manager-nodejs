import { updateCredential } from '../helpers/updateCredential.js';

export function updateCommand(program) {
  program
    .command('update')
    .alias('u')
    .description('Update an SSH credential (username, host, or server name)')
    .requiredOption('-i, --identifier <identifier>', 'ID or host of the credential to update')
    .action((options) => {
      updateCredential(options.identifier);
    });
}
