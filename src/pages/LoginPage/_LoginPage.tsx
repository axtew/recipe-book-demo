import { STextInput } from "@/components/TextInput";
import { B2, B3, Caption2, H1 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { SField, SForm, SSubmit, SWrapper } from "./_styles";
import { useLoginForm } from "./_useLoginForm";

/** Экран входа. Регистрации нет — аккаунты заводятся в дашборде Supabase. */
export function LoginPage() {
  const l = useI18nSelector(({ l }) => l.auth.login);
  const { email, password, isPending, hasError, setEmail, setPassword, handleSubmit } =
    useLoginForm();

  return (
    <SWrapper>
      <H1 textAlign="center">{l.title}</H1>
      <SForm onSubmit={handleSubmit}>
        <SField>
          <Caption2 color="textMuted">{l.emailLabel}</Caption2>
          <STextInput
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </SField>
        <SField>
          <Caption2 color="textMuted">{l.passwordLabel}</Caption2>
          <STextInput
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </SField>
        {hasError && <B3 color="danger">{l.error}</B3>}
        <SSubmit type="submit" disabled={isPending}>
          <B2 as="span">{l.submitButton}</B2>
        </SSubmit>
      </SForm>
    </SWrapper>
  );
}
