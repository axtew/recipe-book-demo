import { Button } from "@/components/Button";
import { B2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { Section } from "../Section";
import { useExportBlock } from "./_useExportBlock";

/** Downloading a backup of the whole database as a single JSON file. */
export function ExportBlock() {
  const l = useI18nSelector(({ l }) => l.settings.exportBlock);
  const { handleExport, isPending, message, isError } = useExportBlock();

  return (
    <Section title={l.title}>
      <B2 color="textMuted">{l.description}</B2>
      <Button
        variant="primaryOutline"
        type="button"
        isInline
        disabled={isPending}
        onClick={handleExport}
      >
        {l.button}
      </Button>
      {message !== null && (
        <B2 role={isError ? "alert" : "status"} color={isError ? "danger" : "primary"}>
          {message}
        </B2>
      )}
    </Section>
  );
}
