import { ROUTES } from "@/config/routes";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

const AuthLayout = lazy(() =>
	import("@/layouts/auth/auth-layout").then((module) => ({
		default: module.AuthLayout,
	})),
);

const Signin = lazy(() =>
	import("@/pages/auth/signin").then((module) => ({ default: module.Signin })),
);
const Signup = lazy(() =>
	import("@/pages/auth/signup").then((module) => ({ default: module.Signup })),
);

export const authRoutes: RouteObject = {
	element: <AuthLayout />,
	children: [
		{
			index: true,
			element: <Navigate to={ROUTES.SIGNIN} replace />,
		},
		{
			path: ROUTES.SIGNIN,
			element: <Signin />,
		},
		{
			path: ROUTES.SIGNUP,
			element: <Signup />,
		},
	],
};
