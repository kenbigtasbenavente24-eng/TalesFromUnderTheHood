"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import {
  COOKIE_NAME,
  passwordMatches,
  sessionToken,
  isValidSession,
} from "@/lib/auth";

export async function login(formData) {
  // Small delay slows down password guessing.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!passwordMatches(formData.get("password"))) {
    redirect("/admin?error=1");
  }

  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  redirect("/admin");
}

export async function deleteMessage(formData) {
  // Server actions are public endpoints, so check the session here too.
  const store = await cookies();
  if (!isValidSession(store.get(COOKIE_NAME)?.value)) {
    redirect("/admin");
  }

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await sql`DELETE FROM messages WHERE id = ${id}`;
  revalidatePath("/admin");
}
