import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/** The signed-in session, or null. For server components, route handlers and server actions. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** The signed-in session; redirects to sign-in when there is none. */
export async function requireSession(next = "/app") {
  const session = await getSession();
  if (!session) redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  return session;
}

/** A super-admin session; anyone else is sent to the app. */
export async function requireAdmin() {
  const session = await requireSession("/admin");
  if (session.user.role !== "admin") redirect("/app");
  return session;
}
