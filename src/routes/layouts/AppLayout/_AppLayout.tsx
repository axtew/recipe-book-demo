import { Loader } from "@mantine/core";
import type { ReactNode } from "react";

import { Button } from "@/components/Button";
import { B2, H2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { useAppDataLoader } from "@/hooks/useAppData.hook";
import { env } from "@/utils/env";

import { DemoBanner } from "./_internal/DemoBanner";
import { SCenter, SShell } from "./_styles";

interface IProps {
  children: ReactNode;
}

/**
 * Shell of the main screen: a centered column up to 600px, safe-area insets,
 * `100dvh` instead of `100vh` (on mobile Safari `100vh` is larger than the visible area).
 *
 * The dataset loader is mounted here too — it is the only place above the whole
 * logged-in part, so the data arrives in full regardless of
 * which screen was opened first. In the demo build the demo-stand banner sits above the screen.
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

  // A background refetch does not cover the screen: the previous data stays in place
  // while the new data is on its way. Only the first load is caught here.
  if (isError) {
    return (
      <SShell>
        <SCenter>
          <H2 textAlign="center">{l.errorTitle}</H2>
          <B2 color="textMuted" textAlign="center">
            {l.errorHint}
          </B2>
          <Button variant="primary" type="button" onClick={refetch}>
            {l.retryButton}
          </Button>
        </SCenter>
      </SShell>
    );
  }

  return (
    <SShell>
      {env.isDemo && <DemoBanner />}
      {children}
    </SShell>
  );
}
