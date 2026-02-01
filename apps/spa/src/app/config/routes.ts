export const TODO_ROUTES = {
	INBOX: "/todo/inbox",
	DASHBOARD: "/todo/dashboard",
	TODAY: "/todo/today",
	UPCOMING: "/todo/upcoming",
	COMPLETED: "/todo/completed",
} as const;

export const PROJECTS_ROUTES = {
	PROJECT_DETAILS: "/projects/:id",
} as const;

export const ROUTES = {
	USER: "/settings",
	SIGNIN: "/login",
	SIGNUP: "/signup",
	GOOGLE_CALLBACK: "/google/callback",
	GOALS_DASHBOARD: "/goals/dashboard",
	TODO: TODO_ROUTES,
	PROJECTS: PROJECTS_ROUTES,
} as const;
