export const TODOS = {
	INBOX: ["todos", "inbox"],
	PROJECTS: ["projects"],
};

export const PROJECTS = {
	ALL: ["projects", "all"],
	DETAIL: (projectId: string) => ["projects", "detail", projectId],
};

export const SECTIONS = {
	BY_PROJECT: (projectId: string) => ["sections", "by-project", projectId],
};

export const QUERY_KEYS = { TODOS, PROJECTS, SECTIONS } as const;
