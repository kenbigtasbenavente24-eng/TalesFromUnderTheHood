import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { COOKIE_NAME, isValidSession } from "@/lib/auth";
import {
  login,
  logout,
  deleteMessage,
  setPublished,
  deleteComment,
} from "./actions";
import DeleteButton from "./DeleteButton";
import "./admin.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const TIMEZONE = "Asia/Taipei"; // change to your timezone if needed

export default async function AdminPage({ searchParams }) {
  const store = await cookies();
  const authed = isValidSession(store.get(COOKIE_NAME)?.value);

  if (!authed) {
    const { error } = await searchParams;
    return (
      <main className="wrap">
        <form className="card" action={login}>
          <h1>Admin</h1>
          <p className="sub">Enter the admin password to read messages.</p>
          <input
            className="pw"
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            autoFocus
          />
          {error && <p className="login-err">Wrong password.</p>}
          <button className="btn" type="submit">
            Log in
          </button>
        </form>
      </main>
    );
  }

  const messages = await sql`
    SELECT id, body, created_at, published
    FROM messages
    ORDER BY created_at DESC
    LIMIT 200
  `;

  const allComments = await sql`
    SELECT id, message_id, author, body, created_at
    FROM comments
    ORDER BY created_at ASC
    LIMIT 2000
  `;
  const commentsByMessage = new Map();
  for (const c of allComments) {
    const key = String(c.message_id);
    if (!commentsByMessage.has(key)) commentsByMessage.set(key, []);
    commentsByMessage.get(key).push(c);
  }

  return (
    <main className="admin-wrap">
      <header className="admin-head">
        <div>
          <h1>Messages</h1>
          <span className="count">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </span>
        </div>
        <form action={logout}>
          <button className="link-btn" type="submit">
            Log out
          </button>
        </form>
      </header>

      {messages.length === 0 && (
        <div className="msg empty">No messages yet.</div>
      )}

      {messages.map((m) => {
        const comments = commentsByMessage.get(String(m.id)) ?? [];
        return (
          <article className="msg" key={m.id}>
            <p className="msg-body">{m.body}</p>
            <div className="msg-foot">
              <span>
                <time>
                  {new Date(m.created_at).toLocaleString("en-US", {
                    timeZone: TIMEZONE,
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
                <span className={m.published ? "badge live" : "badge"}>
                  {m.published ? "Public" : "Hidden"}
                </span>
              </span>
              <div className="msg-actions">
                <form action={setPublished}>
                  <input type="hidden" name="id" value={m.id} />
                  <input
                    type="hidden"
                    name="published"
                    value={m.published ? "false" : "true"}
                  />
                  <button className="pub" type="submit">
                    {m.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <DeleteButton id={m.id} action={deleteMessage} />
              </div>
            </div>

            {comments.length > 0 && (
              <div className="admin-comments">
                <strong>
                  {comments.length} {comments.length === 1 ? "comment" : "comments"}
                </strong>
                {comments.map((c) => (
                  <div className="admin-comment" key={c.id}>
                    <div>
                      <span className="admin-comment-meta">
                        {c.author || "Anonymous"} ·{" "}
                        {new Date(c.created_at).toLocaleString("en-US", {
                          timeZone: TIMEZONE,
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                      <p className="msg-body">{c.body}</p>
                    </div>
                    <DeleteButton
                      id={c.id}
                      action={deleteComment}
                      confirmText="Delete this comment permanently?"
                    />
                  </div>
                ))}
              </div>
            )}
          </article>
        );
      })}
    </main>
  );
}
