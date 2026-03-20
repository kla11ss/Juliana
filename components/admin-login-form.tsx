"use client";

import { FormEvent, useState } from "react";

import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setStatus("");

    try {
      const supabase = getBrowserSupabaseClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/admin`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo
        }
      });

      if (error) {
        throw error;
      }

      setStatus("Ссылка для входа отправлена. Проверьте почту.");
      setEmail("");
    } catch (authError) {
      setStatus(authError instanceof Error ? authError.message : "Не удалось отправить ссылку.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field-label">Рабочий email</span>
        <input
          className="input"
          placeholder="team@example.com"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <button className="button button--primary button--full" disabled={!email || isSending} type="submit">
        {isSending ? "Отправляем..." : "Получить magic link"}
      </button>

      {status ? <p className="admin-login-status">{status}</p> : null}
    </form>
  );
}
