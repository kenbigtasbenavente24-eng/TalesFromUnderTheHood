"use client";

import { useState } from "react";

const MAX_LENGTH = 10000;

export default function Home() {
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim() || status === "sending") return;

    setStatus("sending");
    setError("");

    const website = e.target.elements.website.value; // honeypot

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setBody("");
      setStatus("sent");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <main className="wrap">
        <div className="card center">
          <h1>Sent 🤫</h1>
          <p className="sub">Your message was delivered anonymously.</p>
          <button className="btn" onClick={() => setStatus("idle")}>
            Send another
          </button>
        </div>
      </main>
    );
  }

  const remaining = MAX_LENGTH - body.length;

  return (
    <main className="wrap">
      <form className="card" onSubmit={handleSubmit}>
        <h1>send me anonymous messages</h1>
        <p className="sub">Write as much as you want. I won&apos;t know who sent it.</p>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="say something..."
          rows={10}
          disabled={status === "sending"}
        />

        {/* Honeypot: hidden from humans, bots tend to fill it */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hp"
        />

        <div className="row">
          <span className={remaining < 500 ? "count warn" : "count"}>
            {body.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
          </span>
          {status === "error" && <span className="err">{error}</span>}
        </div>

        <button className="btn" type="submit" disabled={!body.trim() || status === "sending"}>
          {status === "sending" ? "Sending..." : "Send"}
        </button>

        <p className="fine">
          🔒 Nothing identifying is saved with your message.
        </p>
      </form>
    </main>
  );
}
