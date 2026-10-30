// Story submissions are closed. The site is now read-and-comment only, so the
// stories that were already shared stay exactly as they are.
export async function POST() {
  return Response.json(
    { error: "Story submissions are closed." },
    { status: 410 }
  );
}
