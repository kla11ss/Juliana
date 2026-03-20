import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { updateLead } from "@/lib/leads";
import { leadUpdateSchema } from "@/lib/types";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          message: "Unauthorized"
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const payload = leadUpdateSchema.parse(await request.json());
    const lead = await updateLead(supabase, id, payload);

    return NextResponse.json({
      ok: true,
      lead
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Не удалось обновить заявку."
      },
      { status: 400 }
    );
  }
}
