import { Button } from "@/components/Button";
import { B2, H1 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { CategoriesEditor } from "./_internal/CategoriesEditor";
import { ExportBlock } from "./_internal/ExportBlock";
import { ImportBlock } from "./_internal/ImportBlock";
import { LanguageBlock } from "./_internal/LanguageBlock";
import { SAccount, SPage } from "./_styles";
import { useSettingsPage } from "./_useSettingsPage";

/** Settings: backup to a file and back, category order and names, UI language, sign out. */
export function SettingsPage() {
  const l = useI18nSelector(({ l }) => ({ ...l.settings.account, navigation: l.navigation }));
  const { handleSignOut, isSignOutPending, hasSignOutError } = useSettingsPage();

  return (
    <SPage>
      <H1>{l.navigation.settings}</H1>

      <ExportBlock />
      <ImportBlock />
      <CategoriesEditor />
      <LanguageBlock />

      <SAccount>
        <Button
          variant="dangerOutline"
          type="button"
          isInline
          disabled={isSignOutPending}
          onClick={handleSignOut}
        >
          {l.logoutButton}
        </Button>
        {hasSignOutError && (
          <B2 role="alert" color="danger">
            {l.logoutError}
          </B2>
        )}
      </SAccount>
    </SPage>
  );
}
