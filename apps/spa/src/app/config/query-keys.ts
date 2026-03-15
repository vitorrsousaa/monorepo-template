export const TODOS = {
	INBOX: ["todos", "inbox"],
	PROJECTS: ["projects"],
};

export const TASKS = {
	TODAY: ["tasks", "today"],
};

export const PROJECTS = {
	ALL: ["projects", "all"],
	DETAIL: (projectId: string) => ["projects", "detail", projectId],
};

export const SECTIONS = {
	BY_PROJECT: (projectId: string) => ["sections", "by-project", projectId],
};

export const GOALS = {
	ALL: ["goals", "all"],
};

export const AUTH = {
	PROFILE: ["auth", "profile"],
};

export const QUERY_KEYS = {
	TODOS,
	TASKS,
	PROJECTS,
	SECTIONS,
	GOALS,
	AUTH,
} as const;
