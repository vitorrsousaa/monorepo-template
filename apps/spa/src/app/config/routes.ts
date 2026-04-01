export const TASKS_ROUTES = {
	INBOX: "/tasks/inbox",
	DASHBOARD: "/tasks/dashboard",
	TODAY: "/tasks/today",
	UPCOMING: "/tasks/upcoming",
} as const;

export const PROJECTS_ROUTES = {
	LIST: "/projects",
	PROJECT_DETAILS: "/projects/:id",
} as const;

export const USER_ROUTES = {
	PROFILE: "/user",
	SETTINGS: "/user/settings",
	SUPPORT: "/user/support",
	NOTIFICATIONS: "/user/notifications",
} as const;

export const FINANCE_ROUTES = {
	OVERVIEW: "/finance/overview",
	TRANSACTIONS: "/finance/transactions",
	BUDGETS: "/finance/budgets",
	ACCOUNTS: "/finance/accounts",
	REPORTS: "/finance/reports",
} as const;

export const ROUTES = {
	USER: USER_ROUTES,
	SIGNIN: "/login",
	SIGNUP: "/signup",
	GOOGLE_CALLBACK: "/google/callback",
	GOALS_DASHBOARD: "/goals/dashboard",
	PROJECTS: PROJECTS_ROUTES,
	TASKS: TASKS_ROUTES,
	FINANCE: FINANCE_ROUTES,
} as const;
