import chalk from "chalk";

function showPopupBox(serverName, hostname) {
  const boxWidth = Math.max(serverName.length, hostname.length) + 4;
  const terminalWidth = process.stdout.columns;
  const popupX = terminalWidth - boxWidth - 2; // Calculate the starting column for the box
  const popupY = 2; // Fixed vertical position

  const topBorder = "┌" + "─".repeat(boxWidth) + "┐";
  const bottomBorder = "└" + "─".repeat(boxWidth) + "┘";
  const serverLine = `│ ${chalk.green(serverName)}${" ".repeat(
    boxWidth - serverName.length - 2
  )} │`;
  const ipLine = `│ ${chalk.cyan(hostname)}${" ".repeat(
    boxWidth - hostname.length - 2
  )} │`;

  // ANSI escape codes to position and clear specific areas
  process.stdout.write("\x1b7"); // Save cursor position
  process.stdout.write(`\x1b[${popupY};${popupX}H`); // Move to popup position
  console.log(topBorder);
  process.stdout.write(`\x1b[${popupY + 1};${popupX}H`); // Position for serverLine
  console.log(serverLine);
  process.stdout.write(`\x1b[${popupY + 2};${popupX}H`); // Position for ipLine
  console.log(ipLine);
  process.stdout.write(`\x1b[${popupY + 3};${popupX}H`); // Position for bottomBorder
  console.log(bottomBorder);
  process.stdout.write("\x1b8"); // Restore cursor position
}
function saveCursorPosition() {
  process.stdout.write("\x1b[s"); // Save the cursor position
}

function restoreCursorPosition() {
  process.stdout.write("\x1b[u"); // Restore the cursor position
}

function clearPopupBox() {
  const terminalWidth = process.stdout.columns;
  const boxWidth = 40; // Width of the popup box
  const popupX = terminalWidth - boxWidth - 2; // Calculate the starting column for the box
  const popupY = 2; // Fixed vertical position

  const emptySpace = " ".repeat(boxWidth);

  // Save the current cursor position
  saveCursorPosition();

  // Clear the popup box
  process.stdout.write(`\x1b[${popupY};${popupX}H`); // Move cursor to the top of the popup box
  console.log(emptySpace); // Overwrite the top border with spaces

  process.stdout.write(`\x1b[${popupY + 1};${popupX}H`); // Position for server line
  console.log(emptySpace); // Overwrite server name line with spaces

  process.stdout.write(`\x1b[${popupY + 2};${popupX}H`); // Position for hostname line
  console.log(emptySpace); // Overwrite hostname line with spaces

  process.stdout.write(`\x1b[${popupY + 3};${popupX}H`); // Position for bottom border
  console.log(emptySpace); // Overwrite bottom border with spaces

  // Restore the original cursor position
  restoreCursorPosition();
}
 
export { showPopupBox, clearPopupBox };
