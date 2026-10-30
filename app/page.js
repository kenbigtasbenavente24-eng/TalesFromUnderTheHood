import Link from "next/link";
import { sql } from "@/lib/db";
import { formatDate, excerpt } from "@/lib/format";
import Sky from "@/components/Sky";
import Forest from "@/components/Forest";

export const dynamic = "force-dynamic";

export default async function Home() {
  const stories = await sql`
    SELECT
      m.id,
      m.body,
      m.created_at,
      (SELECT count(*) FROM comments c WHERE c.message_id = m.id)::int AS comment_count
    FROM messages m
    WHERE m.published
    ORDER BY m.created_at DESC
    LIMIT 200
  `;

  return (
    <main className="page" style={{ "--fire": "0.45" }}>
      <Sky />
      <div className="content top">
        <header className="hero">
          <h1>Tales from Under the Hood</h1>
          <p className="sub">
            The campfire is closed for new stories, but the ones you shared are
            still here. Pull up a log, read them, and tell us what you think 👻📚
          </p>
        </header>

        {stories.length === 0 && (
          <div className="card wide empty-note">
            No stories are up yet. Check back soon!
          </div>
        )}

        <div className="feed">
          {stories.map((s) => (
            <Link href={`/story/${s.id}`} className="card wide story-card" key={s.id}>
              <p className="story-text">{excerpt(s.body)}</p>
              <div className="meta">
                <time>{formatDate(s.created_at)}</time>
                <span>
                  💬 {s.comment_count}{" "}
                  {s.comment_count === 1 ? "comment" : "comments"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="fine">A Bit of Bonfire | BU ACCeSS 2627</p>
      </div>

      <Forest />
    </main>
  );
}
