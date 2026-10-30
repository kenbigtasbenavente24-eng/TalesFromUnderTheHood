"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MAX_BODY = 2000;
const MAX_NAME = 30;

export default function CommentForm({ storyId }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim() || status === "sending") return;

    setStatus("sending");
    setError("");

    const website = e.target.elements.website.value; // honeypot

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId, body, name, website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setBody("");
      setStatus("idle");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <form className="card wide comment-form" onSubmit={handleSubmit}>
      <input
        className="text-input"
        type="text"
        aria-label="Nickname (optional)"
        placeholder="Nickname (optional, otherwise Anonymous)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={MAX_NAME}
        disabled={status === "sending"}
      />

      <textarea
        aria-label="Your comment"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={MAX_BODY}
        placeholder="Add a comment..."
        rows={4}
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
        <span className={MAX_BODY - body.length < 200 ? "count warn" : "count"}>
          {body.length.toLocaleString()} / {MAX_BODY.toLocaleString()}
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
        {status === "sending" ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}
