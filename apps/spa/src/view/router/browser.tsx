import { ROUTES } from "@/config/routes";
import { DashboardLayout } from "@/layouts/app/dashboard-layout";
import { GoalsDashboard } from "@/pages/app/goals/dashboard";
import { Dashboard } from "@/pages/app/todo/dashboard";
import { Inbox } from "@/pages/app/todo/inbox";
import { Signin } from "@/pages/auth/signin";
import { NotFound } from "@/pages/not-found";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Navigate to={ROUTES.SIGNIN} replace />} />
				<Route path={ROUTES.SIGNIN} element={<Signin />} />
				<Route path='/' element={<DashboardLayout />} >
					<Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
					<Route path={ROUTES.TODO_INBOX} element={<Inbox />} />
					<Route path={ROUTES.GOALS_DASHBOARD} element={<GoalsDashboard />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
