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

/** Sign-in form state and the redirect to the requested route after a successful sign-in. */
export function useLoginForm(): IUseLoginFormResult {
  const { signIn, isPending, hasError } = useSignIn();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });

  // In the demo the fields are prefilled, and an empty prevValue makes the form “changed” right
  // away: otherwise “Sign in” would stay disabled until the visitor changes something.
  const { form, disabled, updateFieldValue, onSubmit } = useForm<TLoginFields>(
    {
      email: { value: env.demoCredentials?.email ?? "", prevValue: "" },
      password: { value: env.demoCredentials?.password ?? "", prevValue: "" },
    },
    async (state) => {
      const success = await signIn(state.email.value, state.password.value);

      // Throw on invalid credentials so useForm does not count the attempt as successful: otherwise
      // after one failure the form is marked “untouched” and pressing “Sign in” again without
      // changing the fields sends nothing.
      if (!success) {
        throw new Error("Sign-in failed");
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
