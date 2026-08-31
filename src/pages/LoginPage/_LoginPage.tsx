import { useI18nSelector } from "@/context/I18nContext";

import { SError, SField, SForm, SInput, SSubmit, STitle, SWrapper } from "./_styles";
import { useLoginForm } from "./_useLoginForm";

/** Экран входа. Регистрации нет — аккаунты заводятся в дашборде Supabase. */
export function LoginPage() {
  const l = useI18nSelector(({ l }) => l.auth.login);
  const { email, password, isPending, hasError, setEmail, setPassword, handleSubmit } =
    useLoginForm();

  return (
    <SWrapper>
      <STitle>{l.title}</STitle>
      <SForm onSubmit={handleSubmit}>
        <SField>
          {l.emailLabel}
          <SInput
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </SField>
        <SField>
          {l.passwordLabel}
          <SInput
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </SField>
        {hasError && <SError>{l.error}</SError>}
        <SSubmit type="submit" disabled={isPending}>
          {l.submitButton}
        </SSubmit>
      </SForm>
    </SWrapper>
  );
}
