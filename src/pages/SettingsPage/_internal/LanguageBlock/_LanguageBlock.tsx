import { B1, B2 } from "@/components/Typography";
import { LANGUAGES } from "@/constants/i18n.constants";
import { useI18nSelector, useLanguage } from "@/context/I18nContext";

import { Section } from "../Section";
import { SGroup, SOption } from "./_styles";

/** UI language choice; applies immediately and is remembered on the device. */
export function LanguageBlock() {
  const l = useI18nSelector(({ l }) => l.settings.language);
  const { language, setLanguage } = useLanguage();

  return (
    <Section title={l.title}>
      <B2 color="textMuted">{l.hint}</B2>
      <SGroup aria-label={l.title}>
        {LANGUAGES.map((option) => (
          <SOption key={option}>
            <input
              type="radio"
              name="language"
              checked={language === option}
              onChange={() => setLanguage(option)}
            />
            <B1 as="span">{l.options[option]}</B1>
          </SOption>
        ))}
      </SGroup>
    </Section>
  );
}
