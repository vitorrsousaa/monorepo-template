import { UserLayout } from "@/layouts/app/user-layout";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Profile = lazy(() =>
	import("@/pages/app/user/profile").then((module) => ({
		default: module.Profile,
	})),
);

const Settings = lazy(() =>
	import("@/pages/app/settings").then((module) => ({
		default: module.Settings,
	})),
);

const Support = lazy(() =>
	import("@/pages/app/support").then((module) => ({
		default: module.Support,
	})),
);

export const userRoutes: RouteObject = {
	path: "user",
	element: <UserLayout />,
	children: [
		{
			index: true,
			element: <Profile />,
		},
		{
			path: "settings",
			element: <Settings />,
		},
		{
			path: "support",
			element: <Support />,
		},
	],
};
