import { exportCredentials } from "../helpers/export.js";
import { importCredentials } from "../helpers/import.js";

export function importExportCredentials(program) {
  // Export Command
  program
    .command("export")
    .description("Export SSH credentials to a JSON file")
    .requiredOption("-f, --file <path>", "Path to the JSON file for export")
    .action((options) => {
      exportCredentials(options.file);
    });

  // Import Command
  program
    .command("import")
    .description("Import SSH credentials from a JSON file (It append the import ssh credentials)")
    .requiredOption("-f, --file <path>", "Path to the JSON file for import")
    .action((options) => {
      importCredentials(options.file);
    });
}
