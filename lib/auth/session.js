/**
 * Session & Authentication Helper
 * Provides a unified auth abstraction.
 * When plugging in NextAuth/Auth.js or Clerk in the future,
 * only update this file.
 */

/**
 * @typedef {Object} SessionUser
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} avatar
 * @property {string} role
 */

export const MOCK_USER = {
  id: "usr_alex_morgan",
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  targetRole: "Senior Software Engineer",
  targetSalary: "$180,000+",
};

/**
 * Retrieves the current active user session
 * @returns {Promise<SessionUser | null>}
 */
export async function getCurrentUser() {
  // Integration point:
  // e.g. const session = await auth(); return session?.user || null;
  // e.g. const { userId } = await auth(); return getUser(userId);
  return MOCK_USER;
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
