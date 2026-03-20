"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { collectClientMeta } from "@/lib/client-meta";

type ConsultationFormState = {
  name: string;
  contact: string;
  cityTimezone: string;
  questionDescription: string;
  consentPrivacy: boolean;
  consentPd: boolean;
};

const initialState: ConsultationFormState = {
  name: "",
  contact: "",
  cityTimezone: "",
  questionDescription: "",
  consentPrivacy: false,
  consentPd: false
};

export function ConsultationForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [startedAt] = useState(() => new Date().toISOString());

  const isValid = useMemo(() => {
    return (
      form.name.trim().length > 1 &&
      form.contact.trim().length > 2 &&
      form.questionDescription.trim().length > 11 &&
      form.consentPrivacy &&
      form.consentPd
    );
  }, [form]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          leadType: "consultation",
          name: form.name,
          contact: form.contact,
          cityTimezone: form.cityTimezone,
          questionDescription: form.questionDescription,
          consentPrivacy: form.consentPrivacy,
          consentPd: form.consentPd,
          source: "landing-consultation",
          meta: collectClientMeta({
            startedAt,
            submittedStepCount: 1
          })
        })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Не удалось отправить консультационный запрос.");
      }

      setForm(initialState);
      router.push("/thank-you?type=consultation");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось отправить консультационный запрос."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="consultation-form" onSubmit={handleSubmit}>
      <label className="field field--compact">
        <span className="field-label">Имя</span>
        <input
          autoComplete="name"
          className="input"
          name="name"
          placeholder="Как к вам обращаться"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
        />
      </label>

      <label className="field field--compact">
        <span className="field-label">Контакт</span>
        <input
          autoComplete="email"
          className="input"
          name="contact"
          placeholder="@telegram, телефон или email"
          value={form.contact}
          onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))}
        />
      </label>

      <label className="field field--compact">
        <span className="field-label">Город / часовой пояс</span>
        <input
          className="input"
          name="cityTimezone"
          placeholder="Москва, GMT+3"
          value={form.cityTimezone}
          onChange={(event) =>
            setForm((current) => ({ ...current, cityTimezone: event.target.value }))
          }
        />
      </label>

      <label className="field field--large">
        <span className="field-label">Опишите ваш вопрос</span>
        <textarea
          className="textarea"
          name="questionDescription"
          placeholder="Расскажите, что хотите разобрать на консультации: цель, текущая ситуация, запрос, сомнения."
          value={form.questionDescription}
          onChange={(event) =>
            setForm((current) => ({ ...current, questionDescription: event.target.value }))
          }
        />
      </label>

      <label className="checkbox">
        <input
          checked={form.consentPrivacy}
          type="checkbox"
          onChange={(event) =>
            setForm((current) => ({ ...current, consentPrivacy: event.target.checked }))
          }
        />
        <span>
          Согласна с <a href="/privacy">политикой конфиденциальности</a>.
        </span>
      </label>

      <label className="checkbox">
        <input
          checked={form.consentPd}
          type="checkbox"
          onChange={(event) => setForm((current) => ({ ...current, consentPd: event.target.checked }))}
        />
        <span>
          Даю согласие на <a href="/consent">обработку персональных данных</a>.
        </span>
      </label>

      <div className="form-footer">
        <button
          className="button button--consultation button--full"
          disabled={!isValid || isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Отправляем..." : "Хочу консультацию"}
        </button>
        <p className="form-helper">Стоимость консультации: 20 000 ₽</p>
      </div>

      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
}
