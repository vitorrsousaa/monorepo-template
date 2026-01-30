/**
 * Fake userId used when authentication is not yet implemented.
 * Valid UUID v4 so it passes zod .uuid() validation.
 * Remove when real auth (JWT) is in place.
 */
export const MOCK_USER_ID = "aaaaaaaa-bbbb-4ccc-d000-000000000000" as const;
