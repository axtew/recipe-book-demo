import { z } from "zod";

import { BACKUP_VERSION, backupSchema, type TBackup } from "@/domain/backup";
import type { TBackupImportResult } from "@/types/backup.types";

import { supabase } from "../supabase";

/** Текст исключения, которым `import_backup` отказывает непустой базе. */
const TARGET_NOT_EMPTY_MESSAGE = "backup_target_not_empty";

const importCountsSchema = z.object({
  products: z.int(),
  recipes: z.int(),
  cook_logs: z.int(),
});

/**
 * Весь бэкап одним снимком базы.
 *
 * Файл проходит ту же схему, что и при импорте: выгрузка, которую приложение
 * само не сможет принять обратно, не должна дойти до пользователя как «бэкап».
 */
export async function exportBackup(): Promise<TBackup> {
  const { data, error } = await supabase.rpc("export_backup");

  if (error) throw new Error("Произошла ошибка при выгрузке бэкапа.", { cause: error });

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error("Выгрузка бэкапа вернула данные неожиданной формы.");
  }

  return backupSchema.parse({
    version: BACKUP_VERSION,
    exported_at: new Date().toISOString(),
    ...data,
  });
}

/** Восстановление из файла одной транзакцией; в непустую базу не пишет ничего. */
export async function importBackup(backup: TBackup): Promise<TBackupImportResult> {
  const { data, error } = await supabase.rpc("import_backup", { p_backup: backup });

  if (error) {
    if (error.message === TARGET_NOT_EMPTY_MESSAGE) return { status: "notEmpty" };

    throw new Error("Произошла ошибка при импорте бэкапа.", { cause: error });
  }

  const counts = importCountsSchema.parse(data);

  return {
    status: "imported",
    counts: { products: counts.products, recipes: counts.recipes, cookLogs: counts.cook_logs },
  };
}
