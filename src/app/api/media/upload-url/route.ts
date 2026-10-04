import { NextResponse } from "next/server";
import { getCmsUser } from "@/lib/auth/session-guard";
import { createUploadTarget, isAllowedContentType } from "@/lib/cms/media";

export async function POST(request: Request) {
  const user = await getCmsUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { contentType?: string } | null;

  if (!body || !isAllowedContentType(body.contentType)) {
    return NextResponse.json({ error: "Tipo de imagen no soportado." }, { status: 400 });
  }

  try {
    const target = await createUploadTarget(body.contentType);
    return NextResponse.json(target);
  } catch {
    return NextResponse.json({ error: "No se pudo generar la URL de subida." }, { status: 500 });
  }
}
