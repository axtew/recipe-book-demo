import { useNavigate, useSearch } from "@tanstack/react-router";
import { type SubmitEvent, useState } from "react";

import { useSignIn } from "@/hooks/useAuth.hook";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isPending, hasError } = useSignIn();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();

    void signIn(email, password).then((success) => {
      if (success) {
        void navigate({ href: redirect });
      }
    });
  }

  return { email, password, isPending, hasError, setEmail, setPassword, handleSubmit };
}
