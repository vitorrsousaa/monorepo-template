import { ROUTES } from "@/config/routes";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const GoalsDashboard = lazy(() =>
	import("@/pages/app/goals/dashboard").then((module) => ({
		default: module.GoalsDashboard,
	})),
);

export const goalsRoutes: RouteObject[] = [
	{
		path: ROUTES.GOALS_DASHBOARD,
		element: <GoalsDashboard />,
	},
];
