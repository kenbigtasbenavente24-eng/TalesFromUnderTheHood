"use client";

import { useState } from "react";
import Forest from "@/components/Forest";

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

  // The glow grows as the story grows, and goes to full once a story is shared.
  const level =
    status === "sent" ? 1 : Math.min(1, Math.log10(1 + body.length) / 4);
  const remaining = MAX_LENGTH - body.length;

  return (
    <main className="page" style={{ "--fire": level.toFixed(3) }}>
      <div className="content">
        {status === "sent" ? (
          <div className="hero">
            <h1>Thanks for sharing with us!</h1>
            <p className="sub">
              Don't worry, your story is safe with us. Your name stays under the hood.
            </p>
            <button
              className="btn btn-inline"
              type="button"
              onClick={() => setStatus("idle")}
            >
              Share another story
            </button>
          </div>
        ) : (
          <>
            <header className="hero">
              <h1>Tales from Under the Hood</h1>
              <p className="sub">
                Got a spooky school story? Tell us about them, friend! That night before an exam,
                or that terror teacher from high school—your stories are shared with us anonymously 👻📚
              </p>
            </header>

            <form className="card" onSubmit={handleSubmit}>
              <textarea
                aria-label="Your story"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={MAX_LENGTH}
                placeholder="This one time, I deleted my team's project..."
                rows={8}
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
                {status === "error" && (
                  <span className="err" role="alert">
                    {error}
                  </span>
                )}
              </div>

              <button
                className="btn"
                type="submit"
                disabled={!body.trim() || status === "sending"}
              >
                {status === "sending" ? "Sharing..." : "Share your story"}
              </button>

              <p className="fine">
                A Bit of Bonfire | BU ACCeSS 2627
              </p>
            </form>
          </>
        )}
      </div>

      <Forest />
    </main>
  );
}
