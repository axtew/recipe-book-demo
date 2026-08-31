import { useI18nSelector } from "@/context/I18nContext";

import { SPlaceholder, SStub, STitle } from "./_styles";

interface IProps {
  title: string;
}

/** Плейсхолдер вкладки, экран которой ещё не реализован. */
export function RouteStub({ title }: IProps) {
  const l = useI18nSelector(({ l }) => l.routeStub);

  return (
    <SStub>
      <STitle>{title}</STitle>
      <SPlaceholder>{l.placeholder}</SPlaceholder>
    </SStub>
  );
}
