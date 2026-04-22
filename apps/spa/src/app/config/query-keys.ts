const TASKS = {
	INBOX: ["tasks", "inbox"],
	TODAY: ["tasks", "today"],
};

const PROJECTS = {
	ALL: ["projects", "all"],
	DETAIL: (projectId: string) => ["projects", "detail", projectId],
	SUMMARY: ["projects", "summary"],
};

const SECTIONS = {
	BY_PROJECT: (projectId: string) => ["sections", "by-project", projectId],
};

const GOALS = {
	ALL: ["goals", "all"],
};

const AUTH = {
	ACCOUNT_INFO: ["auth", "account-info"],
};

const SHARING = {
	MEMBERS: (projectId: string) => ["sharing", "members", projectId],
	INVITATIONS: (projectId: string) => ["sharing", "invitations", projectId],
};

export const QUERY_KEYS = {
	TASKS,
	PROJECTS,
	SECTIONS,
	GOALS,
	AUTH,
	SHARING,
} as const;
