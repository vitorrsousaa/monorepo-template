import { ROUTES } from "@/config/routes";
import { UserLayout } from "@/layouts/app/user-layout";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Settings = lazy(() =>
	import("@/pages/app/settings").then((module) => ({
		default: module.Settings,
	})),
);

export const userRoutes: RouteObject = {
	element: <UserLayout />,
	children: [
		{
			path: ROUTES.SETTINGS.SETTINGS,
			element: <Settings />,
		},
	],
};
