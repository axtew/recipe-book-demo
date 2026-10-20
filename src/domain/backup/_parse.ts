import { BACKUP_VERSION } from "./_constants";
import { backupSchema } from "./_schema";
import type { TBackupParseResult } from "./_types";

/** Путь проблемы в виде `products[2].name`. */
function formatPath(path: PropertyKey[]): string {
  return path
    .map((part, index) => {
      if (typeof part === "number") return `[${part}]`;
      return index === 0 ? String(part) : `.${String(part)}`;
    })
    .join("");
}

/**
 * Разбор текста файла бэкапа.
 *
 * Ничего не бросает: любой дефект файла возвращается кодом, чтобы вызывающий
 * мог показать причину и не трогать базу.
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
