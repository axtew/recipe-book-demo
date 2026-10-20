import { type ChangeEvent, useState } from "react";

import { useImportBackupMutation } from "@/api/mutations/backup.mutations";
import { useI18nSelector } from "@/context/I18nContext";
import { parseBackup } from "@/domain/backup";

import { fillTemplate } from "../../_helpers";

interface IImportResult {
  text: string;
  isError: boolean;
}

/**
 * Импорт бэкапа из выбранного файла.
 *
 * Файл читается и проверяется целиком до первого обращения к базе: битый файл
 * дальше этого шага не уходит, поэтому записать из него нечего.
 */
export function useImportBlock() {
  const l = useI18nSelector(({ l }) => l.settings.importBlock);
  const { mutate, isPending } = useImportBackupMutation();
  const [result, setResult] = useState<IImportResult | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    // Сброс позволяет выбрать тот же файл ещё раз после отказа.
    event.target.value = "";

    if (file === undefined) return;

    setResult(null);

    let text: string;

    try {
      text = await file.text();
    } catch {
      setResult({ text: l.readFailed, isError: true });
      return;
    }

    const parsed = parseBackup(text);

    switch (parsed.status) {
      case "notJson":
        setResult({ text: l.notJson, isError: true });
        return;
      case "notBackup":
        setResult({ text: l.notBackup, isError: true });
        return;
      case "unsupportedVersion":
        setResult({
          text: fillTemplate(l.unsupportedVersion, { version: parsed.version }),
          isError: true,
        });
        return;
      case "invalid":
        setResult({ text: fillTemplate(l.invalid, { path: parsed.path }), isError: true });
        return;
      case "ok":
        break;
    }

    mutate(parsed.backup, {
      onSuccess: (importResult) => {
        if (importResult.status === "notEmpty") {
          setResult({ text: l.notEmpty, isError: true });
          return;
        }

        const { products, recipes, cookLogs } = importResult.counts;

        setResult({
          text: fillTemplate(l.success, { products, recipes, cookLogs }),
          isError: false,
        });
      },
      onError: () => setResult({ text: l.importFailed, isError: true }),
    });
  }

  return {
    handleFileChange,
    isPending,
    message: result?.text ?? null,
    isError: result?.isError ?? false,
  };
}
