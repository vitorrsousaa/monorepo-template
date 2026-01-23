import { LoadingScreen } from "@/components/loading-screen";
import { DashboardLayout } from "@/layouts/app/dashboard-layout";
import { NotFound } from "@/pages/not-found";
import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { authRoutes, goalsRoutes, userRoutes, todoRoutes } from "./modules";

const router = createBrowserRouter([
	...authRoutes,
	{
		path: "/",
		element: <DashboardLayout />,
		children: [todoRoutes, ...userRoutes, ...goalsRoutes],
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
