import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the credentials file
const credentialsFilePath = path.join(__dirname, "../ssh_credentials.json");

// Ensure the file exists, or create it with an empty structure
if (!fs.existsSync(credentialsFilePath)) {
  fs.writeFileSync(
    credentialsFilePath,
    JSON.stringify({ credentials: [] }, null, 2)
  );
}

// Function to load credentials from the file
export function loadCredentials() {
  const fileContent = fs.readFileSync(credentialsFilePath, "utf-8");
  return JSON.parse(fileContent);
}

// Function to save credentials to the file
export function saveCredentials(data) {
  fs.writeFileSync(credentialsFilePath, JSON.stringify(data, null, 2));
}
