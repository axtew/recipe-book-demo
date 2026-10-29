import { B2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { getVideoLinks } from "./_helpers";
import { SLink, SList, SSection } from "./_styles";

interface IProps {
  urls: string[];
}

/**
 * Video links as buttons. They open in a new tab, and on a phone the platform's app picks the link
 * up.
 */
export function VideoBlock({ urls }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeCard.video);
  const links = getVideoLinks(urls);

  if (links.length === 0) return null;

  return (
    <SSection>
      <H3>{l.title}</H3>
      <SList>
        {links.map(({ url, label }, index) => (
          <li key={`${index}-${url}`}>
            <SLink href={url} target="_blank" rel="noopener noreferrer">
              <B2 as="span">{`${l.linkLabel}: ${label}`}</B2>
            </SLink>
          </li>
        ))}
      </SList>
    </SSection>
  );
}
