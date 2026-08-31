import { B1, H1 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { SStub } from "./_styles";

interface IProps {
  title: string;
}

/** Плейсхолдер вкладки, экран которой ещё не реализован. */
export function RouteStub({ title }: IProps) {
  const l = useI18nSelector(({ l }) => l.routeStub);

  return (
    <SStub>
      <H1>{title}</H1>
      <B1 color="textMuted">{l.placeholder}</B1>
    </SStub>
  );
}
