import { useRef } from "react";

import { Button } from "@/components/Button";
import { B2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { Section } from "../Section";
import { SFileInput } from "./_styles";
import { useImportBlock } from "./_useImportBlock";

/**
 * Restoring the database from a backup file: picking the file, validation, import into an empty
 * database.
 */
export function ImportBlock() {
  const l = useI18nSelector(({ l }) => l.settings.importBlock);
  const { handleFileChange, isPending, message, isError } = useImportBlock();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Section title={l.title}>
      <B2 color="textMuted">{l.description}</B2>
      <SFileInput
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
      />
      <Button
        variant="primaryOutline"
        type="button"
        isInline
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
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
