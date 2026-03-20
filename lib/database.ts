export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          lead_type: "mentoring" | "consultation";
          status: "new" | "in_review" | "contacted" | "qualified" | "closed";
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
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          lead_type: "mentoring" | "consultation";
          status?: "new" | "in_review" | "contacted" | "qualified" | "closed";
          name: string;
          contact: string;
          city_timezone?: string | null;
          age_range?: string | null;
          goal?: string | null;
          training_background?: string | null;
          blockers?: string | null;
          expectations?: string | null;
          readiness?: string | null;
          question_for_ulyana?: string | null;
          question_description?: string | null;
          extra_notes?: string | null;
          internal_note?: string | null;
          contacted_at?: string | null;
          consent_privacy: boolean;
          consent_pd: boolean;
          source?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "lead_meta_lead_id_fkey";
            columns: ["id"];
            referencedRelation: "lead_meta";
            referencedColumns: ["lead_id"];
          }
        ];
      };
      lead_meta: {
        Row: {
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
        Insert: {
          lead_id: string;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          referer?: string | null;
          locale?: string | null;
          device?: string | null;
          started_at?: string | null;
          submitted_step_count?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["lead_meta"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "lead_meta_lead_id_fkey";
            columns: ["lead_id"];
            referencedRelation: "leads";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      lead_status: "new" | "in_review" | "contacted" | "qualified" | "closed";
      lead_type: "mentoring" | "consultation";
    };
    CompositeTypes: Record<string, never>;
  };
};
