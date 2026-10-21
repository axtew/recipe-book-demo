import { useNavigate, useSearch } from "@tanstack/react-router";
import type { SubmitEvent } from "react";

import { useSignIn } from "@/hooks/useAuth.hook";
import { useForm } from "@/hooks/useForm";
import { env } from "@/utils/env";

type TLoginFields = Record<"email" | "password", string>;

interface IUseLoginFormResult {
  email: string;
  password: string;
  isSubmitDisabled: boolean;
  hasError: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

/** Состояние формы входа и переход на запрошенный роут после успешного входа. */
export function useLoginForm(): IUseLoginFormResult {
  const { signIn, isPending, hasError } = useSignIn();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });

  // В демо поля подставлены, а пустой prevValue делает форму «изменённой» сразу:
  // иначе «Войти» оставалась бы заблокированной, пока посетитель что-нибудь не изменит.
  const { form, disabled, updateFieldValue, onSubmit } = useForm<TLoginFields>(
    {
      email: { value: env.demoCredentials?.email ?? "", prevValue: "" },
      password: { value: env.demoCredentials?.password ?? "", prevValue: "" },
    },
    async (state) => {
      const success = await signIn(state.email.value, state.password.value);

      // Бросаем при неверных данных, чтобы useForm не считал попытку успешной:
      // иначе после одной неудачи форма помечается «нетронутой» и повторное
      // нажатие «Войти» без изменения полей ничего не отправляет.
      if (!success) {
        throw new Error("Не удалось войти");
      }

      void navigate({ href: redirect });
    },
  );

  return {
    email: form.email.value,
    password: form.password.value,
    isSubmitDisabled: disabled || isPending,
    hasError,
    setEmail: (value) => updateFieldValue("email", value),
    setPassword: (value) => updateFieldValue("password", value),
    handleSubmit: onSubmit,
  };
}
