import { ROUTES } from "@/config/routes";
import { TodoLayout } from "@/layouts/app/todo-layout";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Dashboard = lazy(() =>
	import("@/pages/app/todo/dashboard").then((module) => ({
		default: module.Dashboard,
	})),
);
const Inbox = lazy(() =>
	import("@/pages/app/todo/inbox").then((module) => ({
		default: module.Inbox,
	})),
);
const Projects = lazy(() =>
	import("@/pages/app/todo/projects").then((module) => ({
		default: module.Projects,
	})),
);
const Today = lazy(() =>
	import("@/pages/app/todo/today").then((module) => ({
		default: module.Today,
	})),
);

export const todoRoutes: RouteObject = {
	path: "/",
	element: <TodoLayout />,
	children: [
		{
			path: ROUTES.TODO.DASHBOARD,
			element: <Dashboard />,
		},
		{
			path: ROUTES.TODO.INBOX,
			element: <Inbox />,
		},
		{
			path: ROUTES.TODO.TODAY,
			element: <Today />,
		},
		{
			path: ROUTES.TODO.PROJECTS,
			element: <Projects />,
		},
	],
};
