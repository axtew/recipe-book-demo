import type { z } from "zod";

import type { backupSchema } from "./_schema";

/** Файл бэкапа, прошедший схему. */
export type TBackup = z.infer<typeof backupSchema>;

/**
 * Итог разбора текста файла. Причины отказа — коды, а не тексты: текст для
 * пользователя живёт в словаре.
 *
 * - `notJson` — не JSON;
 * - `notBackup` — JSON, но не объект с полем `version`;
 * - `unsupportedVersion` — версия формата, которую приложение не знает;
 * - `invalid` — версия верна, но данные не проходят схему; `path` — место первой проблемы.
 */
export type TBackupParseResult =
  | { status: "ok"; backup: TBackup }
  | { status: "notJson" }
  | { status: "notBackup" }
  | { status: "unsupportedVersion"; version: string }
  | { status: "invalid"; path: string };
