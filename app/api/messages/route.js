import { sql } from "@/lib/db";

const MAX_LENGTH = 10000;

export async function POST(request) {
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

  const body = typeof data.body === "string" ? data.body.trim() : "";

  if (!body) {
    return Response.json({ error: "Message can't be empty." }, { status: 400 });
  }
  if (body.length > MAX_LENGTH) {
    return Response.json(
      { error: `Message is too long (max ${MAX_LENGTH} characters).` },
      { status: 400 }
    );
  }

  // Only the message text is stored. No IP, no user agent.
  await sql`INSERT INTO messages (body) VALUES (${body})`;

  return Response.json({ ok: true });
}
