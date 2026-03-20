"use client";

import { useEffect, useMemo, useState } from "react";

import type { LeadRecord, LeadStatus, LeadType } from "@/lib/types";

const statusOptions: LeadStatus[] = [
  "new",
  "in_review",
  "contacted",
  "qualified",
  "closed"
];

const statusLabel: Record<LeadStatus, string> = {
  new: "Новая",
  in_review: "В работе",
  contacted: "Связались",
  qualified: "Подходит",
  closed: "Закрыта"
};

const typeLabel: Record<LeadType, string> = {
  mentoring: "Менторинг",
  consultation: "Консультация"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function AdminDashboard({ initialLeads }: { initialLeads: LeadRecord[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [selectedId, setSelectedId] = useState(initialLeads[0]?.id || "");
  const [filterType, setFilterType] = useState<LeadType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");
  const [noteDraft, setNoteDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState<LeadStatus>("new");
  const [saveState, setSaveState] = useState("");

  const visibleLeads = useMemo(() => {
    return leads.filter((lead) => {
      const typeMatches = filterType === "all" || lead.lead_type === filterType;
      const statusMatches = filterStatus === "all" || lead.status === filterStatus;

      return typeMatches && statusMatches;
    });
  }, [filterStatus, filterType, leads]);

  const selectedLead = useMemo(() => {
    return visibleLeads.find((lead) => lead.id === selectedId) || visibleLeads[0] || null;
  }, [selectedId, visibleLeads]);

  useEffect(() => {
    if (!selectedLead) {
      setNoteDraft("");
      return;
    }

    setSelectedId(selectedLead.id);
    setNoteDraft(selectedLead.internal_note || "");
    setStatusDraft(selectedLead.status);
  }, [selectedLead]);

  async function patchLead(patch: {
    status?: LeadStatus;
    internalNote?: string | null;
    contactedAt?: string | null;
  }) {
    if (!selectedLead) {
      return;
    }

    setSaveState("Сохраняем...");

    try {
      const response = await fetch(`/api/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(patch)
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Не удалось обновить заявку.");
      }

      setLeads((current) =>
        current.map((lead) => (lead.id === selectedLead.id ? (data.lead as LeadRecord) : lead))
      );
      setSaveState("Сохранено.");
    } catch (error) {
      setSaveState(error instanceof Error ? error.message : "Не удалось обновить заявку.");
    }
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-toolbar">
          <label className="field">
            <span className="field-label">Тип</span>
            <select
              className="input"
              value={filterType}
              onChange={(event) => setFilterType(event.target.value as LeadType | "all")}
            >
              <option value="all">Все</option>
              <option value="mentoring">Менторинг</option>
              <option value="consultation">Консультация</option>
            </select>
          </label>

          <label className="field">
            <span className="field-label">Статус</span>
            <select
              className="input"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value as LeadStatus | "all")}
            >
              <option value="all">Все</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusLabel[status]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="admin-list">
          {visibleLeads.map((lead) => (
            <button
              key={lead.id}
              className={lead.id === selectedLead?.id ? "lead-card lead-card--active" : "lead-card"}
              type="button"
              onClick={() => setSelectedId(lead.id)}
            >
              <div className="lead-card__row">
                <strong>{lead.name}</strong>
                <span className={`status-pill status-pill--${lead.status}`}>{statusLabel[lead.status]}</span>
              </div>
              <p>{typeLabel[lead.lead_type]}</p>
              <small>{formatDate(lead.created_at)}</small>
            </button>
          ))}

          {!visibleLeads.length ? <p className="empty-state">По этим фильтрам заявок нет.</p> : null}
        </div>
      </aside>

      <section className="admin-detail">
        {selectedLead ? (
          <>
            <div className="admin-detail__head">
              <div>
                <p className="section-kicker">Карточка заявки</p>
                <h1>{selectedLead.name}</h1>
                <p className="admin-detail__meta">
                  {typeLabel[selectedLead.lead_type]} · {formatDate(selectedLead.created_at)}
                </p>
              </div>

              <div className="admin-detail__actions">
                <label className="field field--compact">
                  <span className="field-label">Статус</span>
                  <select
                    className="input"
                    value={statusDraft}
                    onChange={(event) => setStatusDraft(event.target.value as LeadStatus)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel[status]}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() =>
                    patchLead({
                      status: "contacted",
                      contactedAt: new Date().toISOString()
                    })
                  }
                >
                  Отметить контакт
                </button>

                <button
                  className="button button--primary"
                  type="button"
                  onClick={() =>
                    patchLead({
                      status: statusDraft,
                      internalNote: noteDraft
                    })
                  }
                >
                  Сохранить
                </button>
              </div>
            </div>

            <div className="admin-detail__grid">
              <div className="admin-panel">
                <h2>Контакт</h2>
                <dl className="admin-fields">
                  <div>
                    <dt>Контакт</dt>
                    <dd>{selectedLead.contact}</dd>
                  </div>
                  <div>
                    <dt>Город / часовой пояс</dt>
                    <dd>{selectedLead.city_timezone || "—"}</dd>
                  </div>
                  <div>
                    <dt>Статус</dt>
                    <dd>{statusLabel[selectedLead.status]}</dd>
                  </div>
                  <div>
                    <dt>Связались</dt>
                    <dd>{selectedLead.contacted_at ? formatDate(selectedLead.contacted_at) : "Ещё нет"}</dd>
                  </div>
                </dl>
              </div>

              <div className="admin-panel">
                <h2>Содержимое заявки</h2>
                <div className="admin-copy">
                  {selectedLead.lead_type === "mentoring" ? (
                    <>
                      <p>
                        <strong>Возраст:</strong> {selectedLead.age_range || "—"}
                      </p>
                      <p>
                        <strong>Цель:</strong> {selectedLead.goal || "—"}
                      </p>
                      <p>
                        <strong>Тренировочный опыт:</strong> {selectedLead.training_background || "—"}
                      </p>
                      <p>
                        <strong>Что мешает:</strong> {selectedLead.blockers || "—"}
                      </p>
                      <p>
                        <strong>Ожидания:</strong> {selectedLead.expectations || "—"}
                      </p>
                      <p>
                        <strong>Готовность:</strong> {selectedLead.readiness || "—"}
                      </p>
                      <p>
                        <strong>Вопрос Ульяне:</strong> {selectedLead.question_for_ulyana || "—"}
                      </p>
                      <p>
                        <strong>Дополнительно:</strong> {selectedLead.extra_notes || "—"}
                      </p>
                    </>
                  ) : (
                    <p>
                      <strong>Вопрос на консультацию:</strong>{" "}
                      {selectedLead.question_description || "—"}
                    </p>
                  )}
                </div>
              </div>

              <div className="admin-panel admin-panel--wide">
                <h2>Внутренняя заметка</h2>
                <textarea
                  className="textarea textarea--admin"
                  placeholder="Что важно помнить по этой заявке, что уже обсудили, какой следующий шаг."
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                />
                {saveState ? <p className="admin-save-state">{saveState}</p> : null}
              </div>
            </div>
          </>
        ) : (
          <div className="admin-empty">
            <h1>Заявок пока нет</h1>
            <p>Как только кто-то отправит анкету или запрос на консультацию, карточка появится здесь.</p>
          </div>
        )}
      </section>
    </div>
  );
}
