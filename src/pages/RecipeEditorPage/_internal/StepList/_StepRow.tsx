import { useLayoutEffect, useRef } from "react";

import { STextArea } from "@/components/TextArea";
import { B2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { RemoveButton } from "../RemoveButton";
import { SNumber, SStepBody } from "./_styles";

interface IProps {
  number: number;
  text: string;
  onChange: (text: string) => void;
  onRemove: () => void;
}

/** A step: number, text that grows with its content, and a delete button. */
export function StepRow({ number, text, onChange, onRemove }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeEditor.steps);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // The height adapts to the content: a fixed scrollable area inside a long step is inconvenient on
  // a phone.
  useLayoutEffect(() => {
    const element = textareaRef.current;
    if (element === null) return;

    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [text]);

  return (
    <SStepBody>
      <SNumber>
        <B2 as="span" color="textMuted">
          {number}
        </B2>
      </SNumber>
      <STextArea
        ref={textareaRef}
        rows={2}
        placeholder={l.placeholder}
        aria-label={`${l.stepLabel} ${number}`}
        value={text}
        onChange={(event) => onChange(event.target.value)}
      />
      <RemoveButton label={l.remove} onClick={onRemove} />
    </SStepBody>
  );
}
