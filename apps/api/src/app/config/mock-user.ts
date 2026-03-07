/**
 * Fake userId used when authentication is not yet implemented.
 * Valid UUID v4 so it passes zod .uuid() validation.
 * Remove when real auth (JWT) is in place.
 */
export const MOCK_USER_ID = "93470f22-3bc0-4a98-90b2-306fb233e0f5" as const;
