#!/usr/bin/env node


import { program } from "commander";
import { addCommand } from "./commands/add.js";
import { listCommand } from "./commands/list.js";
import { deleteCommand } from "./commands/delete.js";
import { updateCommand } from "./commands/update.js";
import { wizardCommand } from "./commands/wizard.js";
import { whoisCommand } from "./commands/whois.js";
import { sshCommand } from "./commands/ssh.js";

// Set up version and description for the CLI tool
program.version("1.0.0").description("SSH Credential Manager CLI");

// Add the commands
addCommand(program);
listCommand(program);
deleteCommand(program);
updateCommand(program); // Add the update command
wizardCommand(program);
whoisCommand(program);
sshCommand(program);

program.parse(process.argv);
