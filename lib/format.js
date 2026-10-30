const TIMEZONE = "Asia/Manila";

export function formatDate(value) {
  return new Date(value).toLocaleString("en-US", {
    timeZone: TIMEZONE,
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function excerpt(text, max = 280) {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).trimEnd() + "…";
}
