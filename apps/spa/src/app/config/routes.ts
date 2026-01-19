export const TODO_ROUTES = {
  INBOX: "/todo/inbox",
  DASHBOARD: "/todo/dashboard",
  TODAY: "/todo/today",
  UPCOMING: "/todo/upcoming",
  COMPLETED: "/todo/completed",
  PROJECTS: "/todo/projects/:id",
} as const;

export const ROUTES = {
  DASHBOARD: "/dashboard",
  SETTINGS: "/configuracoes",
  SIGNIN: "/login",
  GOOGLE_CALLBACK: "/google/callback",
  GOALS_DASHBOARD: "/goals/dashboard",
  TODO:TODO_ROUTES
} as const;
