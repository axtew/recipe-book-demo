import type { z } from "zod";

import type { backupSchema } from "./_schema";

/** A backup file that passed the schema. */
export type TBackup = z.infer<typeof backupSchema>;

/**
 * Result of parsing the file text. Failure reasons are codes, not texts: the text for
 * the user lives in the dictionary.
 *
 * - `notJson` — not JSON;
 * - `notBackup` — JSON, but not an object with a `version` field;
 * - `unsupportedVersion` — a format version the app does not know;
 * - `invalid` — the version is right but the data fails the schema; `path` is the location of the first problem.
 */
export type TBackupParseResult =
  | { status: "ok"; backup: TBackup }
  | { status: "notJson" }
  | { status: "notBackup" }
  | { status: "unsupportedVersion"; version: string }
  | { status: "invalid"; path: string };
