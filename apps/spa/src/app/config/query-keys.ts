export const TODOS = {
	INBOX: ["todos", "inbox"],
	PROJECTS: ["projects"],
};

export const PROJECTS = {
	ALL: ["projects", "all"],
	DETAIL: (projectId: string) => ["projects", "detail", projectId],
};

export const QUERY_KEYS = { TODOS, PROJECTS } as const;
