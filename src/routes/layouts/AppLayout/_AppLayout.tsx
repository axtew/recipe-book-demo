import { Loader } from "@mantine/core";
import type { ReactNode } from "react";

import { B2, H2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { useAppDataLoader } from "@/hooks/useAppData.hook";

import { SCenter, SRetry, SShell } from "./_styles";

interface IProps {
  children: ReactNode;
}

/**
 * Каркас основного экрана: отцентрованная колонка до 600px, safe-area insets,
 * `100dvh` вместо `100vh` (на мобильном Safari `100vh` больше видимой области).
 *
 * Здесь же смонтирован загрузчик датасета — это единственное место под всей
 * залогиненной частью, поэтому данные приезжают целиком независимо от того,
 * какой экран открыли первым.
 */
export function AppLayout({ children }: IProps) {
  const l = useI18nSelector(({ l }) => l.appData);
  const { isPending, isError, refetch } = useAppDataLoader();

  if (isPending) {
    return (
      <SShell>
        <SCenter>
          <Loader />
        </SCenter>
      </SShell>
    );
  }

  // Фоновое обновление экран не закрывает: прежние данные остаются на месте,
  // пока едут новые. Здесь ловится только первая загрузка.
  if (isError) {
    return (
      <SShell>
        <SCenter>
          <H2 textAlign="center">{l.errorTitle}</H2>
          <B2 color="textMuted" textAlign="center">
            {l.errorHint}
          </B2>
          <SRetry type="button" onClick={refetch}>
            <B2 as="span">{l.retryButton}</B2>
          </SRetry>
        </SCenter>
      </SShell>
    );
  }

  return <SShell>{children}</SShell>;
}
