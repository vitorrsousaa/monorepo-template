import { LoadingScreen } from "@/components/loading-screen";
import { DashboardLayout } from "@/layouts/app/dashboard-layout";
import { NotFound } from "@/pages/not-found";
import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthGuard } from "./auth-guard";
import {
	authRoutes,
	goalsRoutes,
	projectsRoutes,
	todoRoutes,
	userRoutes,
} from "./modules";

const router = createBrowserRouter([
	{
		element: <AuthGuard isPrivate={false} />,
		children: authRoutes,
	},
	{
		path: "/",
		element: <AuthGuard isPrivate={true} />,
		children: [
			{
				element: <DashboardLayout />,
				children: [todoRoutes, userRoutes, goalsRoutes, projectsRoutes],
			},
		],
	},
	{
		path: "*",
		element: <NotFound />,
	},
]);

export function Router() {
	return (
		<Suspense fallback={<LoadingScreen />}>
			<RouterProvider router={router} />
		</Suspense>
	);
}
