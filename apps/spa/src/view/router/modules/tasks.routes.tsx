import { ROUTES } from "@/config/routes";
import { TasksLayout } from "@/layouts/app/tasks-layout";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Dashboard = lazy(() =>
	import("@/pages/app/tasks/dashboard").then((module) => ({
		default: module.Dashboard,
	})),
);
const Inbox = lazy(() =>
	import("@/pages/app/tasks/inbox").then((module) => ({
		default: module.Inbox,
	})),
);
const Today = lazy(() =>
	import("@/pages/app/todo/today").then((module) => ({
		default: module.Today,
	})),
);
const Upcoming = lazy(() =>
	import("@/pages/app/todo/upcoming").then((module) => ({
		default: module.Upcoming,
	})),
);

export const tasksRoutes: RouteObject = {
	path: "/",
	element: <TasksLayout />,
	children: [
		{
			path: ROUTES.TASKS.DASHBOARD,
			element: <Dashboard />,
		},
		{
			path: ROUTES.TASKS.INBOX,
			element: <Inbox />,
		},
		{
			path: ROUTES.TASKS.TODAY,
			element: <Today />,
		},
		{
			path: ROUTES.TODO.UPCOMING,
			element: <Upcoming />,
		},
	],
};
