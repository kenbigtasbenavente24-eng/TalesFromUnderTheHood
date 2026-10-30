-- Run this once in your Neon/Supabase SQL editor.
-- Deliberately no IP, user agent, or any identifying column.
CREATE TABLE IF NOT EXISTS messages (
  id         BIGSERIAL PRIMARY KEY,
  body       TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at DESC);

-- ---------------------------------------------------------------------------
-- Forum mode: submissions are closed, visitors can only comment on stories.
-- Run this block once in the SQL editor. It is safe to re-run.
-- ---------------------------------------------------------------------------

-- Stories stay private until you publish them from /admin.
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT false;

-- Optional: publish every existing story at once instead of one by one.
-- UPDATE messages SET published = true;

CREATE TABLE IF NOT EXISTS comments (
  id         BIGSERIAL PRIMARY KEY,
  message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  author     TEXT CHECK (author IS NULL OR char_length(author) <= 30),
  body       TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS comments_message_idx ON comments (message_id, created_at);
