import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Unsupported request." }, { status: 415 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const intent = typeof body.intent === "string" ? body.intent.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !EMAIL_RE.test(email) || !intent || message.length > 3000) {
    return NextResponse.json({ error: "Please check the required fields." }, { status: 400 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      { error: "Contact routing is not configured yet." },
      { status: 503 },
    );
  }

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      source: "axin.group",
      submittedAt: new Date().toISOString(),
      name,
      company,
      email,
      intent,
      message,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Unable to submit right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
