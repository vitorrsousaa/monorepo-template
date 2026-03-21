export const TODO_ROUTES = {
	TODAY: "/todo/today",
	UPCOMING: "/todo/upcoming",
	COMPLETED: "/todo/completed",
} as const;

export const TASKS_ROUTES = {
	INBOX: "/tasks/inbox",
	DASHBOARD: "/tasks/dashboard",
} as const;

export const PROJECTS_ROUTES = {
	LIST: "/projects",
	PROJECT_DETAILS: "/projects/:id",
} as const;

export const USER_ROUTES = {
	PROFILE: "/user",
	SETTINGS: "/user/settings",
	SUPPORT: "/user/support",
} as const;

export const ROUTES = {
	USER: USER_ROUTES,
	SIGNIN: "/login",
	SIGNUP: "/signup",
	GOOGLE_CALLBACK: "/google/callback",
	GOALS_DASHBOARD: "/goals/dashboard",
	TODO: TODO_ROUTES,
	PROJECTS: PROJECTS_ROUTES,
	TASKS: TASKS_ROUTES,
} as const;
