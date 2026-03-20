import { z } from "zod";

export const leadTypeSchema = z.enum(["mentoring", "consultation"]);
export const leadStatusSchema = z.enum([
  "new",
  "in_review",
  "contacted",
  "qualified",
  "closed"
]);

const consentSchema = z.literal(true, {
  error: "Необходимо подтвердить согласия."
});

const metaSchema = z.object({
  utmSource: z.string().trim().optional(),
  utmMedium: z.string().trim().optional(),
  utmCampaign: z.string().trim().optional(),
  referer: z.string().trim().optional(),
  locale: z.string().trim().optional(),
  device: z.string().trim().optional(),
  startedAt: z.string().trim().optional(),
  submittedStepCount: z.number().int().positive().optional()
});

const commonLeadSchema = z.object({
  leadType: leadTypeSchema,
  name: z.string().trim().min(2, "Укажите имя."),
  contact: z.string().trim().min(3, "Укажите контакт."),
  cityTimezone: z.string().trim().max(120).optional(),
  consentPrivacy: consentSchema,
  consentPd: consentSchema,
  source: z.string().trim().default("website"),
  meta: metaSchema.optional()
});

export const mentoringLeadSchema = commonLeadSchema.extend({
  leadType: z.literal("mentoring"),
  ageRange: z.string().trim().min(2, "Укажите возрастной диапазон."),
  goal: z.string().trim().min(10, "Опишите цель."),
  trainingBackground: z.string().trim().min(10, "Расскажите о тренировочном опыте."),
  blockers: z.string().trim().min(10, "Опишите текущие сложности."),
  expectations: z.string().trim().min(10, "Опишите ожидания."),
  readiness: z.string().trim().min(3, "Опишите готовность к старту."),
  questionForUlyana: z.string().trim().min(10, "Добавьте вопрос Ульяне."),
  extraNotes: z.string().trim().optional()
});

export const consultationLeadSchema = commonLeadSchema.extend({
  leadType: z.literal("consultation"),
  questionDescription: z.string().trim().min(12, "Опишите вопрос подробнее.")
});

export const leadPayloadSchema = z.discriminatedUnion("leadType", [
  mentoringLeadSchema,
  consultationLeadSchema
]);

export const leadUpdateSchema = z.object({
  status: leadStatusSchema.optional(),
  internalNote: z.string().trim().max(4000).nullable().optional(),
  contactedAt: z.string().datetime().nullable().optional()
});

export type LeadType = z.infer<typeof leadTypeSchema>;
export type LeadStatus = z.infer<typeof leadStatusSchema>;
export type MentoringLeadPayload = z.infer<typeof mentoringLeadSchema>;
export type ConsultationLeadPayload = z.infer<typeof consultationLeadSchema>;
export type LeadPayload = z.infer<typeof leadPayloadSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;

export type LeadMetaRecord = {
  lead_id: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referer: string | null;
  locale: string | null;
  device: string | null;
  started_at: string | null;
  submitted_step_count: number | null;
};

export type LeadRecord = {
  id: string;
  created_at: string;
  updated_at: string;
  lead_type: LeadType;
  status: LeadStatus;
  name: string;
  contact: string;
  city_timezone: string | null;
  age_range: string | null;
  goal: string | null;
  training_background: string | null;
  blockers: string | null;
  expectations: string | null;
  readiness: string | null;
  question_for_ulyana: string | null;
  question_description: string | null;
  extra_notes: string | null;
  internal_note: string | null;
  contacted_at: string | null;
  consent_privacy: boolean;
  consent_pd: boolean;
  source: string;
  lead_meta?: LeadMetaRecord[] | null;
};
