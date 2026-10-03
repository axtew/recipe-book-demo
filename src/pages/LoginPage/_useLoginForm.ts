import { useNavigate, useSearch } from "@tanstack/react-router";
import type { SubmitEvent } from "react";

import { useSignIn } from "@/hooks/useAuth.hook";
import { useForm } from "@/hooks/useForm";

type TLoginFields = Record<"email" | "password", string>;

interface IUseLoginFormResult {
  email: string;
  password: string;
  isPending: boolean;
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

  const { form, updateFieldValue, onSubmit } = useForm<TLoginFields>(
    { email: "", password: "" },
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
    isPending,
    hasError,
    setEmail: (value) => updateFieldValue("email", value),
    setPassword: (value) => updateFieldValue("password", value),
    handleSubmit: onSubmit,
  };
}
