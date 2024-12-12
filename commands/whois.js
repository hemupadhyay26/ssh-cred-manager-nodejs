import { getHostnames } from '../helpers/getHostnames.js'; // Import the function from getHostname.js

// Define the command to look up hostname(s) by server name(s) or ID(s)
export function whoisCommand(program) {
  program
    .command('whois <servernames>')
    .description('Get the hostname(s) for the given server name(s) or ID(s)')
    .action((servernames) => {
      // Ensure the input is processed as a string
      if (!servernames || servernames.trim() === '') {
        console.log(chalk.yellow('\n⚠️ Please provide at least one server name or ID.'));
        return;
      }

      // Pass the comma-separated string to getHostnames for processing
      getHostnames(servernames);
    });
}
