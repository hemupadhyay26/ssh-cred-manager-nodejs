import fs from 'fs';
import chalk from 'chalk';
import { loadCredentials, saveCredentials } from './helpers.js';

export function importCredentials(filePath) {
  try {
    let importedData;

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.log(chalk.yellow(`\n⚠️ The file ${filePath} does not exist.`));
      console.log(chalk.blue(`\nCreating ${filePath} and initializing with default structure...`));

      // Initialize the file with an empty credentials array
      importedData = { credentials: [] };
      fs.writeFileSync(filePath, JSON.stringify(importedData, null, 2), 'utf-8');
      console.log(chalk.green(`\n✅ File ${filePath} created successfully.`));
    } else {
      // Read and parse the file content
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      importedData = JSON.parse(fileContent);
    }

    // Validate the imported data
    if (!Array.isArray(importedData.credentials)) {
      console.error(chalk.red('\n❌ Invalid file format. Expected an array of credentials.'));
      return;
    }

    // Load current credentials and merge with imported data
    const currentData = loadCredentials();
    currentData.credentials.push(...importedData.credentials);

    // Save the updated credentials back to the storage
    saveCredentials(currentData);
    console.log(chalk.green(`\n✅ Credentials successfully imported from: ${filePath}`));
  } catch (error) {
    console.error(chalk.red(`\n❌ Failed to import credentials: ${error.message}`));
  }
}
