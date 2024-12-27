import fs from 'fs';
import chalk from 'chalk';
import { loadCredentials } from './helpers.js';

export function exportCredentials(filePath) {
  try {
    const credentials = loadCredentials();
    if (!credentials || credentials.credentials.length === 0) {
      console.log(chalk.yellow('\n⚠️ No credentials to export.'));
      return;
    }

    fs.writeFileSync(filePath, JSON.stringify(credentials, null, 2));
    console.log(chalk.green(`\n✅ Credentials successfully exported to: ${filePath}`));
  } catch (error) {
    console.error(chalk.red(`\n❌ Failed to export credentials: ${error.message}`));
  }
}
