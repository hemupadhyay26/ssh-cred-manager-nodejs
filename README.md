# SSH Credential Manager CLI

## Overview

The **SSH Credential Manager CLI** is a command-line tool designed to help manage and securely store SSH credentials. With this tool, you can add, list, update, delete, and SSH into servers using stored credentials. The tool supports SSH operations based on saved credentials, allowing users to easily connect to remote servers without having to manually enter login information each time.

This tool also allows you to organize your SSH credentials by associating them with server names or IDs, and it simplifies the process of connecting to servers via SSH.

## Features

- **Add Credentials**: Store SSH credentials including server name, username, and hostname.
- **List Credentials**: View all stored SSH credentials.
- **Update Credentials**: Modify existing credentials.
- **Delete Credentials**: Remove SSH credentials.
- **Connect via SSH**: SSH into a server directly using saved credentials.
- **Interactive Selection**: Choose a server from a list when no identifier is provided.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/ssh-credential-manager.git
   cd ssh-credential-manager
   ```

2. **Install Dependencies:**

   Use npm to install all required dependencies.

   ```bash
   npm install
   ```

3. **Make `index.js` Executable (Optional):**

   If you want to make the `gotossh` command executable globally, use the following command:

   ```bash
   chmod +x index.js
   ```

4. **Link the Command Globally (Optional):**

   To make the `gotossh` command available globally, run:

   ```bash
   npm link
   ```

   This will allow you to run the command from anywhere using `gotossh` in your terminal.

## Commands

### `gotossh`

- **Description**: This command lets you SSH into a server based on saved credentials.
- **Usage**: Simply run `gotossh` to be prompted with a list of available servers. If you don't specify an identifier, the tool will display the list of stored credentials and allow you to choose one to SSH into. Use --help for more information.
- **Example**:

   ```bash
   gotossh
   ```

### `add`

- **Description**: Adds a new SSH credential.
- **Usage**: Add a server's credentials to the storage.
- **Example**:

   ```bash
   gotossh add | a
   ```

### `list`

- **Description**: Lists all stored SSH credentials.
- **Usage**: Displays a table of all saved SSH credentials.
- **Example**:

   ```bash
   gotossh list | l
   ```

### `delete [id]`

- **Description**: Deletes an SSH credential by ID.
- **Usage**: Deletes the credential corresponding to the provided ID.
- **Example**:

   ```bash
   gotossh delete | d ID
   ```

### `update [id]`

- **Description**: Updates an existing SSH credential by ID or hostname.
- **Usage**: Allows you to update the stored details (username, hostname, server name) of an SSH credential.
- **Example**:

   ```bash
   gotossh update | u ID
   ```

### `wizard`

- **Description**: Starts an interactive prompt to help you set up a new SSH credential.
- **Usage**: Guides you through the process of creating and storing new SSH credentials interactively.
- **Example**:

   ```bash
   gotossh wizard | w
   ```

### `whois [identifier]`

- **Description**: Displays details of a specific server, including the hostname (IP address).
- **Usage**: Fetch and display the hostname (IP) of a server based on its name or ID.
- **Example**:

   ```bash
   gotossh whois <serverName|ID>
   ```

---

## How It Works

1. **Storage Format**:
   - SSH credentials are stored in a JSON file that includes the server's name, username, and hostname.
   - Each credential has a unique ID, which allows for easy searching and management.

2. **SSH Functionality**:
   - When you run the `gotossh` command, the tool will check the credentials in the file and prompt you to select a server if no identifier is provided.
   - The tool uses the `ssh` command to initiate the connection. Once connected, the SSH session will use the terminal.

3. **Credential Search**:
   - The CLI performs a case-insensitive search for credentials based on the server name or ID.
   - If no match is found, the user is prompted to choose from a list of available servers.

---

## Example Usage

1. **Add a New Credential**:

   ```bash
   gotossh add
   ```

   This will guide you through adding a new SSH credential interactively.

2. **View Stored Credentials**:

   ```bash
   gotossh list
   ```

   Displays all your saved credentials.

3. **SSH into a Server**:

   ```bash
   gotossh
   ```

   Select a server from the list or provide an identifier to directly connect.

4. **Delete a Credential**:

   ```bash
   gotossh delete 1
   ```

   Deletes the credential with ID `1`.

5. **Update a Credential**:

   ```bash
   gotossh update 1
   ```

   Updates the credential with ID `1`.

---

## Contributing

Contributions are welcome! If you want to contribute, feel free to fork the repository and submit a pull request. If you find a bug or have an idea for improvement, open an issue.

---

## Conclusion

The **SSH Credential Manager CLI** is a powerful tool to manage your SSH credentials securely and efficiently. With a simple and intuitive interface, you can add, update, and remove credentials, and connect to remote servers with ease.
