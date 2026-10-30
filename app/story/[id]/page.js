import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { formatDate } from "@/lib/format";
import Sky from "@/components/Sky";
import Forest from "@/components/Forest";
import CommentForm from "./CommentForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "A tale from under the hood",
};

export default async function StoryPage({ params }) {
  const { id } = await params;
  if (!/^\d{1,18}$/.test(id)) notFound();

  const stories = await sql`
    SELECT id, body, created_at
    FROM messages
    WHERE id = ${id}::bigint AND published
  `;
  const story = stories[0];
  if (!story) notFound();

  const comments = await sql`
    SELECT id, author, body, created_at
    FROM comments
    WHERE message_id = ${id}::bigint
    ORDER BY created_at ASC
    LIMIT 500
  `;

  return (
    <main className="page" style={{ "--fire": "0.45" }}>
      <Sky />
      <div className="content top">
        <div className="wide-col">
          <Link href="/" className="back">
            ← All stories
          </Link>

          <article className="card wide">
            <p className="story-full">{story.body}</p>
            <div className="meta">
              <time>{formatDate(story.created_at)}</time>
            </div>
          </article>

          <section aria-labelledby="comments-title">
            <h2 id="comments-title" className="comments-title">
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </h2>

            {comments.map((c) => (
              <div className="comment" key={c.id}>
                <div className="comment-head">
                  <strong>{c.author || "Anonymous"}</strong>
                  <time>{formatDate(c.created_at)}</time>
                </div>
                <p className="comment-body">{c.body}</p>
              </div>
            ))}

            <CommentForm storyId={story.id} />
          </section>
        </div>
      </div>

      <Forest />
    </main>
  );
}
