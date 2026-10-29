import { BACKUP_VERSION } from "./_constants";
import { backupSchema } from "./_schema";
import type { TBackupParseResult } from "./_types";

/** Path of the problem in the form `products[2].name`. */
function formatPath(path: PropertyKey[]): string {
  return path
    .map((part, index) => {
      if (typeof part === "number") return `[${part}]`;
      return index === 0 ? String(part) : `.${String(part)}`;
    })
    .join("");
}

/**
 * Parses the backup file text.
 *
 * Throws nothing: any defect of the file is returned as a code, so that the caller
 * can show the reason and leave the database alone.
 */
export function parseBackup(text: string): TBackupParseResult {
  let raw: unknown;

  try {
    raw = JSON.parse(text);
  } catch {
    return { status: "notJson" };
  }

  if (typeof raw !== "object" || raw === null || !("version" in raw)) {
    return { status: "notBackup" };
  }

  if (raw.version !== BACKUP_VERSION) {
    return { status: "unsupportedVersion", version: String(raw.version) };
  }

  const result = backupSchema.safeParse(raw);

  if (!result.success) {
    return { status: "invalid", path: formatPath(result.error.issues[0].path) };
  }

  return { status: "ok", backup: result.data };
}
