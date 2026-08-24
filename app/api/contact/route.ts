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
  const gotcha = typeof body._gotcha === "string" ? body._gotcha.trim() : "";

  // 蜜罐字段：真人看不见也填不了，有值就是机器人。静默返回成功，不给爬虫反馈。
  if (gotcha) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !EMAIL_RE.test(email) || !intent || message.length > 3000) {
    return NextResponse.json({ error: "Please check the required fields." }, { status: 400 });
  }

  const endpoint = process.env.FORMSPREE_ENDPOINT;
  if (!endpoint) {
    return NextResponse.json(
      { error: "Contact routing is not configured yet." },
      { status: 503 },
    );
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // 必须带上，否则 Formspree 返回 302 跳到它自己的致谢页而不是 JSON
        accept: "application/json",
      },
      body: JSON.stringify({
        name,
        company,
        email,
        intent,
        message,
        source: "axin.group",
        submittedAt: new Date().toISOString(),
        // Formspree 用它做邮件主题，便于在收件箱里一眼分辨来意
        _subject: `AXIN website enquiry — ${intent}`,
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "Unable to submit right now." }, { status: 502 });
  }

  if (!response.ok) {
    // 把 Formspree 的具体原因透出来（比如表单未激活、超出额度），否则线上排查全靠猜
    let detail = "";
    try {
      const err = (await response.json()) as { errors?: { message?: string }[] };
      detail = err.errors?.map((e) => e.message).filter(Boolean).join("; ") ?? "";
    } catch {
      /* Formspree 未返回 JSON，保持 detail 为空 */
    }
    console.error(`[contact] Formspree ${response.status}: ${detail || "(no detail)"}`);
    return NextResponse.json({ error: "Unable to submit right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
