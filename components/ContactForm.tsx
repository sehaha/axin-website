"use client";

import { FormEvent, useState } from "react";

type State = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    // 先抓住表单引用：await 之后 event.currentTarget 会变成 null，
    // 直接在那时候调 reset() 会抛错，把成功的提交也带进 catch 里报错。
    const formEl = event.currentTarget;
    const payload = Object.fromEntries(new FormData(formEl).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to submit.");
      formEl.reset();
      setState("success");
      setMessage("Thank you. Our team will follow up shortly.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit right now.");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field-grid">
        <label><span>Name *</span><input name="name" required autoComplete="name" /></label>
        <label><span>Company</span><input name="company" autoComplete="organization" /></label>
      </div>
      <label><span>Email *</span><input name="email" type="email" required autoComplete="email" /></label>
      <label>
        <span>What are you looking to build? *</span>
        <select name="intent" required defaultValue="">
          <option value="" disabled>Select an area</option>
          <option>Technology & Intelligent Systems</option>
          <option>U.S. Market Expansion</option>
          <option>Global Services</option>
          <option>Capital & Investment</option>
          <option>Strategic Partnership</option>
          <option>Media</option>
          <option>Other</option>
        </select>
      </label>
      <label><span>Message</span><textarea name="message" rows={4} maxLength={3000} /></label>
      {/* 蜜罐：屏幕阅读器和键盘都跳过，只有机器人会填 */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />
      <div className="form-footer">
        <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Start a Conversation"}<span aria-hidden="true">↗</span></button>
        <p className={`form-status ${state}`} aria-live="polite">{message}</p>
      </div>
    </form>
  );
}
