import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { COOKIE_NAME, isValidSession } from "@/lib/auth";
import { login, logout, deleteMessage } from "./actions";
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
    SELECT id, body, created_at
    FROM messages
    ORDER BY created_at DESC
    LIMIT 200
  `;

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

      {messages.map((m) => (
        <article className="msg" key={m.id}>
          <p className="msg-body">{m.body}</p>
          <div className="msg-foot">
            <time>
              {new Date(m.created_at).toLocaleString("en-US", {
                timeZone: TIMEZONE,
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </time>
            <DeleteButton id={m.id} action={deleteMessage} />
          </div>
        </article>
      ))}
    </main>
  );
}
