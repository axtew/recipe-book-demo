interface IBackupImportCounts {
  products: number;
  recipes: number;
  cookLogs: number;
}

/** Отказ при непустой базе — ожидаемый исход, а не ошибка записи, поэтому это не исключение. */
export type TBackupImportResult =
  { status: "imported"; counts: IBackupImportCounts } | { status: "notEmpty" };
