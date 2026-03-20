import { getSiteUrl, getTelegramEnv, hasServerSupabaseEnv } from "@/lib/env";
import { getServiceSupabaseClient } from "@/lib/supabase/service";
import type {
  ConsultationLeadPayload,
  LeadPayload,
  LeadRecord,
  LeadStatus,
  LeadType,
  LeadUpdateInput,
  MentoringLeadPayload
} from "@/lib/types";

function normalizeEmpty(value?: string) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length ? trimmed : null;
}

function createLeadInsert(payload: LeadPayload) {
  const base = {
    lead_type: payload.leadType,
    name: payload.name.trim(),
    contact: payload.contact.trim(),
    city_timezone: normalizeEmpty(payload.cityTimezone),
    consent_privacy: payload.consentPrivacy,
    consent_pd: payload.consentPd,
    source: payload.source
  };

  if (payload.leadType === "consultation") {
    const consultationPayload = payload as ConsultationLeadPayload;

    return {
      ...base,
      question_description: consultationPayload.questionDescription.trim()
    };
  }

  const mentoringPayload = payload as MentoringLeadPayload;

  return {
    ...base,
    age_range: mentoringPayload.ageRange.trim(),
    goal: mentoringPayload.goal.trim(),
    training_background: mentoringPayload.trainingBackground.trim(),
    blockers: mentoringPayload.blockers.trim(),
    expectations: mentoringPayload.expectations.trim(),
    readiness: mentoringPayload.readiness.trim(),
    question_for_ulyana: mentoringPayload.questionForUlyana.trim(),
    extra_notes: normalizeEmpty(mentoringPayload.extraNotes)
  };
}

function createMetaInsert(leadId: string, payload: LeadPayload) {
  return {
    lead_id: leadId,
    utm_source: normalizeEmpty(payload.meta?.utmSource),
    utm_medium: normalizeEmpty(payload.meta?.utmMedium),
    utm_campaign: normalizeEmpty(payload.meta?.utmCampaign),
    referer: normalizeEmpty(payload.meta?.referer),
    locale: normalizeEmpty(payload.meta?.locale),
    device: normalizeEmpty(payload.meta?.device),
    started_at: normalizeEmpty(payload.meta?.startedAt),
    submitted_step_count: payload.meta?.submittedStepCount ?? null
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatLeadType(type: LeadType) {
  return type === "consultation" ? "Консультация" : "Менторинг";
}

function formatLeadStatus(status: LeadStatus) {
  const dictionary: Record<LeadStatus, string> = {
    new: "Новая",
    in_review: "В работе",
    contacted: "Связались",
    qualified: "Подходит",
    closed: "Закрыта"
  };

  return dictionary[status];
}

function hasAdminStorage() {
  return hasServerSupabaseEnv();
}

function buildTelegramMessage(lead: LeadRecord) {
  const adminUrl = `${getSiteUrl().replace(/\/$/, "")}/admin`;
  const meta = lead.lead_meta?.[0];

  const lines = [
    "Новая заявка с лендинга",
    `Тип: ${formatLeadType(lead.lead_type)}`,
    `Дата: ${formatDate(lead.created_at)}`,
    "",
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`
  ];

  if (lead.city_timezone) {
    lines.push(`Город / часовой пояс: ${lead.city_timezone}`);
  }

  if (lead.lead_type === "consultation") {
    if (lead.question_description) {
      lines.push("");
      lines.push("Вопрос на консультацию:");
      lines.push(lead.question_description);
    }
  } else {
    if (lead.goal) {
      lines.push("");
      lines.push("Цель:");
      lines.push(lead.goal);
    }

    if (lead.question_for_ulyana) {
      lines.push("");
      lines.push("Вопрос Ульяне:");
      lines.push(lead.question_for_ulyana);
    }
  }

  if (meta?.utm_source || meta?.utm_campaign) {
    lines.push("");
    lines.push(
      `UTM: ${meta.utm_source || "—"} / ${meta.utm_campaign || "—"}`
    );
  }

  if (hasAdminStorage()) {
    lines.push("");
    lines.push(`Админка: ${adminUrl}`);
  } else {
    lines.push("");
    lines.push("Режим: Telegram-only, без подключённой mini-CRM");
  }

  return lines.join("\n");
}

export async function sendLeadToTelegram(lead: LeadRecord) {
  const { botToken, chatId } = getTelegramEnv();
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildTelegramMessage(lead),
      disable_web_page_preview: true
    })
  });

  if (!response.ok) {
    throw new Error("Telegram API request failed.");
  }

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.description || "Telegram message failed.");
  }
}

export async function createLead(payload: LeadPayload) {
  if (!hasAdminStorage()) {
    const timestamp = new Date().toISOString();
    const fallbackLead: LeadRecord = {
      id: crypto.randomUUID(),
      created_at: timestamp,
      updated_at: timestamp,
      lead_type: payload.leadType,
      status: "new",
      name: payload.name.trim(),
      contact: payload.contact.trim(),
      city_timezone: normalizeEmpty(payload.cityTimezone),
      age_range: payload.leadType === "mentoring" ? payload.ageRange.trim() : null,
      goal: payload.leadType === "mentoring" ? payload.goal.trim() : null,
      training_background:
        payload.leadType === "mentoring" ? payload.trainingBackground.trim() : null,
      blockers: payload.leadType === "mentoring" ? payload.blockers.trim() : null,
      expectations: payload.leadType === "mentoring" ? payload.expectations.trim() : null,
      readiness: payload.leadType === "mentoring" ? payload.readiness.trim() : null,
      question_for_ulyana:
        payload.leadType === "mentoring" ? payload.questionForUlyana.trim() : null,
      question_description:
        payload.leadType === "consultation" ? payload.questionDescription.trim() : null,
      extra_notes:
        payload.leadType === "mentoring" ? normalizeEmpty(payload.extraNotes) : null,
      internal_note: null,
      contacted_at: null,
      consent_privacy: payload.consentPrivacy,
      consent_pd: payload.consentPd,
      source: payload.source,
      lead_meta: [
        {
          lead_id: "telegram-only",
          utm_source: normalizeEmpty(payload.meta?.utmSource),
          utm_medium: normalizeEmpty(payload.meta?.utmMedium),
          utm_campaign: normalizeEmpty(payload.meta?.utmCampaign),
          referer: normalizeEmpty(payload.meta?.referer),
          locale: normalizeEmpty(payload.meta?.locale),
          device: normalizeEmpty(payload.meta?.device),
          started_at: normalizeEmpty(payload.meta?.startedAt),
          submitted_step_count: payload.meta?.submittedStepCount ?? null
        }
      ]
    };

    await sendLeadToTelegram(fallbackLead);

    return fallbackLead;
  }

  const supabase = getServiceSupabaseClient();
  const insert = createLeadInsert(payload);

  const { data: insertedLead, error } = await supabase
    .from("leads")
    .insert(insert)
    .select("*")
    .single();

  if (error || !insertedLead) {
    throw new Error(error?.message || "Could not create lead.");
  }

  const lead = insertedLead as { id: string };

  const { error: metaError } = await supabase
    .from("lead_meta")
    .upsert(createMetaInsert(lead.id, payload), {
      onConflict: "lead_id"
    });

  if (metaError) {
    throw new Error(metaError.message);
  }

  const { data: fullLead, error: fullLeadError } = await supabase
    .from("leads")
    .select("*, lead_meta(*)")
    .eq("id", lead.id)
    .single();

  if (fullLeadError || !fullLead) {
    throw new Error(fullLeadError?.message || "Could not reload lead.");
  }

  try {
    await sendLeadToTelegram(fullLead as LeadRecord);
  } catch (telegramError) {
    console.error("Telegram notification failed", telegramError);
  }

  return fullLead as LeadRecord;
}

export async function listLeads() {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*, lead_meta(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as LeadRecord[];
}

export async function updateLead(id: string, input: LeadUpdateInput) {
  const supabase = getServiceSupabaseClient();
  const patch: Record<string, string | null> = {};

  if (input.status) {
    patch.status = input.status;
  }

  if (input.internalNote !== undefined) {
    patch.internal_note = input.internalNote;
  }

  if (input.contactedAt !== undefined) {
    patch.contacted_at = input.contactedAt;
  }

  const { data, error } = await supabase
    .from("leads")
    .update(patch)
    .eq("id", id)
    .select("*, lead_meta(*)")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Could not update lead.");
  }

  return data as LeadRecord;
}

export function summarizeLeadForUI(lead: LeadRecord) {
  const meta = lead.lead_meta?.[0];

  return {
    id: lead.id,
    leadTypeLabel: formatLeadType(lead.lead_type),
    statusLabel: formatLeadStatus(lead.status),
    createdAtLabel: formatDate(lead.created_at),
    utmLabel:
      meta?.utm_source || meta?.utm_campaign
        ? `${meta?.utm_source || "—"} / ${meta?.utm_campaign || "—"}`
        : null
  };
}
