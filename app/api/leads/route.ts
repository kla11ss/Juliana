import { NextResponse } from "next/server";

import { createLead } from "@/lib/leads";
import { leadPayloadSchema } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const payload = leadPayloadSchema.parse(await request.json());
    const lead = await createLead(payload);

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
      leadType: lead.lead_type
    });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error && error.message.startsWith("Missing environment variable:")
        ? "Серверная часть ещё не настроена. Заполните .env.local и Supabase перед приёмом заявок."
        : error instanceof Error
          ? error.message
          : "Не удалось отправить заявку.";

    return NextResponse.json(
      {
        ok: false,
        message
      },
      { status: 400 }
    );
  }
}
