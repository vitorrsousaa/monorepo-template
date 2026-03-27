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

export const FINANCE_ROUTES = {
	OVERVIEW: "/finance/overview",
	TRANSACTIONS: "/finance/transactions",
	BUDGETS: "/finance/budgets",
	ACCOUNTS: "/finance/accounts",
	REPORTS: "/finance/reports",
} as const;

export const SHARED_ROUTES = {
	WITH_ME: "/shared/with-me",
	MY_CONTENT: "/shared/my-content",
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
	FINANCE: FINANCE_ROUTES,
	SHARED: SHARED_ROUTES,
} as const;
