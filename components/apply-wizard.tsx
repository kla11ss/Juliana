"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { collectClientMeta } from "@/lib/client-meta";

type WizardFormState = {
  name: string;
  contact: string;
  cityTimezone: string;
  ageRange: string;
  goal: string;
  trainingBackground: string;
  blockers: string;
  expectations: string;
  readiness: string;
  questionForUlyana: string;
  extraNotes: string;
  consentPrivacy: boolean;
  consentPd: boolean;
};

const storageKey = "ulyana-mentoring-draft";

const initialState: WizardFormState = {
  name: "",
  contact: "",
  cityTimezone: "",
  ageRange: "",
  goal: "",
  trainingBackground: "",
  blockers: "",
  expectations: "",
  readiness: "",
  questionForUlyana: "",
  extraNotes: "",
  consentPrivacy: false,
  consentPd: false
};

const steps = [
  {
    id: "contact",
    label: "Контакт"
  },
  {
    id: "context",
    label: "Контекст"
  },
  {
    id: "expectations",
    label: "Фокус"
  },
  {
    id: "finish",
    label: "Финал"
  }
] as const;

function stepIsValid(step: number, state: WizardFormState) {
  if (step === 0) {
    return (
      state.name.trim().length > 1 &&
      state.contact.trim().length > 2 &&
      state.cityTimezone.trim().length > 1 &&
      state.ageRange.trim().length > 1
    );
  }

  if (step === 1) {
    return (
      state.goal.trim().length > 9 &&
      state.trainingBackground.trim().length > 9 &&
      state.blockers.trim().length > 9
    );
  }

  if (step === 2) {
    return state.expectations.trim().length > 9 && state.readiness.trim().length > 2;
  }

  return (
    state.questionForUlyana.trim().length > 9 &&
    state.consentPrivacy &&
    state.consentPd
  );
}

export function ApplyWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<WizardFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [startedAt] = useState(() => new Date().toISOString());

  useEffect(() => {
    const storedDraft = window.localStorage.getItem(storageKey);

    if (!storedDraft) {
      return;
    }

    try {
      setForm((current) => ({
        ...current,
        ...JSON.parse(storedDraft)
      }));
    } catch (storageError) {
      console.error("Could not restore draft", storageError);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(form));
  }, [form]);

  const progress = useMemo(() => ((currentStep + 1) / steps.length) * 100, [currentStep]);

  function nextStep() {
    if (!stepIsValid(currentStep, form)) {
      setError("Заполните поля текущего шага, чтобы продолжить.");
      return;
    }

    setError("");
    setCurrentStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function prevStep() {
    setError("");
    setCurrentStep((current) => Math.max(current - 1, 0));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stepIsValid(3, form)) {
      setError("Добавьте вопрос Ульяне и подтвердите согласия.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          leadType: "mentoring",
          name: form.name,
          contact: form.contact,
          cityTimezone: form.cityTimezone,
          ageRange: form.ageRange,
          goal: form.goal,
          trainingBackground: form.trainingBackground,
          blockers: form.blockers,
          expectations: form.expectations,
          readiness: form.readiness,
          questionForUlyana: form.questionForUlyana,
          extraNotes: form.extraNotes,
          consentPrivacy: form.consentPrivacy,
          consentPd: form.consentPd,
          source: "landing-mentoring",
          meta: collectClientMeta({
            startedAt,
            submittedStepCount: steps.length
          })
        })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Не удалось отправить заявку.");
      }

      window.localStorage.removeItem(storageKey);
      setForm(initialState);
      router.push("/thank-you?type=mentoring");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось отправить заявку.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="wizard" onSubmit={handleSubmit}>
      <div className="wizard-topbar">
        <div>
          <p className="section-kicker">Анкета менторинга</p>
          <h1 className="wizard-title">Структурно, бережно, без случайных вопросов.</h1>
        </div>
        <div className="wizard-progress">
          <div className="wizard-progress__track">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p>
            Шаг {currentStep + 1} / {steps.length}
          </p>
        </div>
      </div>

      <div className="wizard-steps">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={index === currentStep ? "wizard-step wizard-step--active" : "wizard-step"}
          >
            <span>{step.id}</span>
            <strong>{step.label}</strong>
          </div>
        ))}
      </div>

      {currentStep === 0 ? (
        <div className="wizard-grid">
          <label className="field">
            <span className="field-label">Имя</span>
            <input
              className="input"
              placeholder="Как к вам обращаться"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
          </label>

          <label className="field">
            <span className="field-label">Контакт</span>
            <input
              className="input"
              placeholder="@telegram, телефон или email"
              value={form.contact}
              onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))}
            />
          </label>

          <label className="field">
            <span className="field-label">Город / часовой пояс</span>
            <input
              className="input"
              placeholder="Москва, GMT+3"
              value={form.cityTimezone}
              onChange={(event) =>
                setForm((current) => ({ ...current, cityTimezone: event.target.value }))
              }
            />
          </label>

          <label className="field">
            <span className="field-label">Возрастной диапазон</span>
            <input
              className="input"
              placeholder="Например: 28-34"
              value={form.ageRange}
              onChange={(event) => setForm((current) => ({ ...current, ageRange: event.target.value }))}
            />
          </label>
        </div>
      ) : null}

      {currentStep === 1 ? (
        <div className="wizard-stack">
          <label className="field">
            <span className="field-label">Главная цель</span>
            <textarea
              className="textarea"
              placeholder="Какой результат вы хотите получить через работу с Ульяной?"
              value={form.goal}
              onChange={(event) => setForm((current) => ({ ...current, goal: event.target.value }))}
            />
          </label>

          <label className="field">
            <span className="field-label">Тренировочный опыт</span>
            <textarea
              className="textarea"
              placeholder="Как давно вы тренируетесь, что уже пробовали, какой режим сейчас?"
              value={form.trainingBackground}
              onChange={(event) =>
                setForm((current) => ({ ...current, trainingBackground: event.target.value }))
              }
            />
          </label>

          <label className="field">
            <span className="field-label">Что мешает сейчас</span>
            <textarea
              className="textarea"
              placeholder="Какие сложности или тупики вы уже видите?"
              value={form.blockers}
              onChange={(event) => setForm((current) => ({ ...current, blockers: event.target.value }))}
            />
          </label>
        </div>
      ) : null}

      {currentStep === 2 ? (
        <div className="wizard-stack">
          <label className="field">
            <span className="field-label">Что вы ждёте от менторинга</span>
            <textarea
              className="textarea"
              placeholder="Каким вы видите идеальный формат работы и результат?"
              value={form.expectations}
              onChange={(event) =>
                setForm((current) => ({ ...current, expectations: event.target.value }))
              }
            />
          </label>

          <label className="field">
            <span className="field-label">Готовность к старту</span>
            <textarea
              className="textarea"
              placeholder="Когда хотите начать и насколько готовы к регулярной работе?"
              value={form.readiness}
              onChange={(event) => setForm((current) => ({ ...current, readiness: event.target.value }))}
            />
          </label>
        </div>
      ) : null}

      {currentStep === 3 ? (
        <div className="wizard-stack">
          <label className="field">
            <span className="field-label">Вопрос Ульяне</span>
            <textarea
              className="textarea"
              placeholder="Какой вопрос вы хотите задать лично до старта?"
              value={form.questionForUlyana}
              onChange={(event) =>
                setForm((current) => ({ ...current, questionForUlyana: event.target.value }))
              }
            />
          </label>

          <label className="field">
            <span className="field-label">Дополнительные детали</span>
            <textarea
              className="textarea"
              placeholder="Любые нюансы, которые помогут быстрее понять ваш запрос."
              value={form.extraNotes}
              onChange={(event) => setForm((current) => ({ ...current, extraNotes: event.target.value }))}
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
              onChange={(event) =>
                setForm((current) => ({ ...current, consentPd: event.target.checked }))
              }
            />
            <span>
              Даю согласие на <a href="/consent">обработку персональных данных</a>.
            </span>
          </label>
        </div>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}

      <div className="wizard-actions">
        <button
          className="button button--ghost"
          disabled={currentStep === 0 || isSubmitting}
          type="button"
          onClick={prevStep}
        >
          Назад
        </button>

        {currentStep < steps.length - 1 ? (
          <button className="button button--primary" type="button" onClick={nextStep}>
            Продолжить
          </button>
        ) : (
          <button className="button button--primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Отправляем заявку..." : "Отправить заявку"}
          </button>
        )}
      </div>
    </form>
  );
}
