import { STextInput } from "@/components/TextInput";
import { B2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { SAddButton, SSection } from "../../_styles";
import { RemoveButton } from "../RemoveButton";
import { SVideoRow } from "./_styles";

interface IProps {
  urls: string[];
  onChange: (urls: string[]) => void;
}

/** Video links: a list of fields, one per link. The address is validated on save. */
export function VideoLinks({ urls, onChange }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeEditor.video);

  return (
    <SSection>
      <H3>{l.title}</H3>

      {urls.map((url, index) => (
        // Links are not reordered and have no id of their own — the index is stable as long as rows
        // are only appended and removed.
        <SVideoRow key={index}>
          <STextInput
            type="url"
            inputMode="url"
            enterKeyHint="done"
            placeholder={l.placeholder}
            aria-label={l.placeholder}
            value={url}
            onChange={(event) =>
              onChange(
                urls.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)),
              )
            }
          />
          <RemoveButton
            label={l.remove}
            onClick={() => onChange(urls.filter((_, itemIndex) => itemIndex !== index))}
          />
        </SVideoRow>
      ))}

      <SAddButton type="button" onClick={() => onChange([...urls, ""])}>
        <B2 as="span">{l.add}</B2>
      </SAddButton>
    </SSection>
  );
}
