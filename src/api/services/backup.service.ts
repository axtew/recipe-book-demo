import { z } from "zod";

import { BACKUP_VERSION, backupSchema, type TBackup } from "@/domain/backup";
import type { TBackupImportResult } from "@/types/backup.types";

import { supabase } from "../supabase";

/** Text of the exception with which `import_backup` rejects a non-empty database. */
const TARGET_NOT_EMPTY_MESSAGE = "backup_target_not_empty";

const importCountsSchema = z.object({
  products: z.int(),
  recipes: z.int(),
  cook_logs: z.int(),
});

/**
 * The whole backup as one database snapshot.
 *
 * The file goes through the same schema as on import: an export that the app
 * could not accept back itself must not reach the user as a “backup”.
 */
export async function exportBackup(): Promise<TBackup> {
  const { data, error } = await supabase.rpc("export_backup");

  if (error) throw new Error("An error occurred while exporting the backup.", { cause: error });

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error("The backup export returned data of an unexpected shape.");
  }

  return backupSchema.parse({
    version: BACKUP_VERSION,
    exported_at: new Date().toISOString(),
    ...data,
  });
}

/** Restore from a file in one transaction; writes nothing into a non-empty database. */
export async function importBackup(backup: TBackup): Promise<TBackupImportResult> {
  const { data, error } = await supabase.rpc("import_backup", { p_backup: backup });

  if (error) {
    if (error.message === TARGET_NOT_EMPTY_MESSAGE) return { status: "notEmpty" };

    throw new Error("An error occurred while importing the backup.", { cause: error });
  }

  const counts = importCountsSchema.parse(data);

  return {
    status: "imported",
    counts: { products: counts.products, recipes: counts.recipes, cookLogs: counts.cook_logs },
  };
}
