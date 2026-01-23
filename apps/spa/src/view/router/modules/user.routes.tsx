import { ROUTES } from "@/config/routes";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Settings = lazy(() =>
	import("@/pages/app/settings").then((module) => ({
		default: module.Settings,
	})),
);

export const userRoutes: RouteObject[] = [
	{
		path: ROUTES.USER,
		element: <Settings />,
	},
];
