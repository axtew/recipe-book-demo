import { useState } from "react";

import { useExportBackupMutation } from "@/api/mutations/backup.mutations";
import { useI18nSelector } from "@/context/I18nContext";
import { getTodayDate } from "@/utils/helpers/dates";

import { fillTemplate } from "../../_helpers";
import { downloadTextFile } from "./_helpers";

interface IExportResult {
  text: string;
  isError: boolean;
}

/** Exporting the backup, downloading the file and the resulting message under the button. */
export function useExportBlock() {
  const l = useI18nSelector(({ l }) => l.settings.exportBlock);
  const { mutate, isPending } = useExportBackupMutation();
  const [result, setResult] = useState<IExportResult | null>(null);

  function handleExport() {
    setResult(null);

    mutate(undefined, {
      onSuccess: (backup) => {
        const fileName = `recipe-book-backup-${getTodayDate()}.json`;

        downloadTextFile(fileName, JSON.stringify(backup, null, 2), "application/json");
        setResult({ text: fillTemplate(l.success, { fileName }), isError: false });
      },
      onError: () => setResult({ text: l.error, isError: true }),
    });
  }

  return {
    handleExport,
    isPending,
    message: result?.text ?? null,
    isError: result?.isError ?? false,
  };
}
