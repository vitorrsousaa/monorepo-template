import { DashboardLayout } from "@/layouts/app/dashboard-layout";
import { NotFound } from "@/pages/not-found";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthRoutes, GoalsRoutes, SettingsRoutes, TodoRoutes } from "./modules";

export function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<AuthRoutes />
				<Route path="/" element={<DashboardLayout />}>
					<TodoRoutes />
					<SettingsRoutes />
					<GoalsRoutes />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
