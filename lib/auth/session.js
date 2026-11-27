import { cookies } from "next/headers";

/**
 * Session & Authentication Helper
 * Provides a unified auth abstraction backed by Supabase session cookies.
 */

/**
 * @typedef {Object} SessionUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [avatar]
 * @property {string} [role]
 */

/**
 * Retrieves the current active user session from server-side cookies
 * @returns {Promise<SessionUser | null>}
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("sb-user-id")?.value;
    const userEmail = cookieStore.get("sb-user-email")?.value;
    const userName = cookieStore.get("sb-user-name")?.value;

    if (userId) {
      return {
        id: userId,
        email: userEmail ? decodeURIComponent(userEmail) : "",
        name: userName ? decodeURIComponent(userName) : "",
      };
    }
  } catch {
    // cookies() can throw if called outside request context (e.g. static generation)
  }

  return null;
}

/**
 * Route guard helper for Server Actions and Server Components
 * @throws {Error} if unauthenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized. Please log in to continue.");
  }
  return user;
}
