import { sql } from "@/lib/db";
import { isCommentRateLimited } from "@/lib/ratelimit";

const MAX_BODY = 2000;
const MAX_NAME = 30;

export async function POST(request) {
  if (await isCommentRateLimited(request)) {
    return Response.json(
      { error: "Too many comments. Try again in a few minutes." },
      { status: 429 }
    );
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field. Pretend success to bots.
  if (data.website) {
    return Response.json({ ok: true });
  }

  const storyId = String(data.storyId ?? "");
  if (!/^\d{1,18}$/.test(storyId)) {
    return Response.json({ error: "Invalid story." }, { status: 400 });
  }

  const body = typeof data.body === "string" ? data.body.trim() : "";
  if (!body) {
    return Response.json({ error: "Comment can't be empty." }, { status: 400 });
  }
  if (body.length > MAX_BODY) {
    return Response.json(
      { error: `Comment is too long (max ${MAX_BODY} characters).` },
      { status: 400 }
    );
  }

  const name =
    typeof data.name === "string" ? data.name.trim().replace(/\s+/g, " ") : "";
  if (name.length > MAX_NAME) {
    return Response.json(
      { error: `Nickname is too long (max ${MAX_NAME} characters).` },
      { status: 400 }
    );
  }

  // Only comments on published stories are accepted. No IP or user agent is stored.
  const rows = await sql`
    INSERT INTO comments (message_id, author, body)
    SELECT ${storyId}::bigint, ${name || null}::text, ${body}::text
    WHERE EXISTS (
      SELECT 1 FROM messages WHERE id = ${storyId}::bigint AND published
    )
    RETURNING id
  `;

  if (rows.length === 0) {
    return Response.json({ error: "Story not found." }, { status: 404 });
  }

  return Response.json({ ok: true });
}
