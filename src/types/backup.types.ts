interface IBackupImportCounts {
  products: number;
  recipes: number;
  cookLogs: number;
}

/** A refusal on a non-empty database is an expected outcome, not a write error, so it is not an exception. */
export type TBackupImportResult =
  { status: "imported"; counts: IBackupImportCounts } | { status: "notEmpty" };
