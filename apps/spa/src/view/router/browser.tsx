import { ROUTES } from "@/config/routes";
import { DashboardLayout } from "@/layouts/app/dashboard-layout";
import { GoalsDashboard } from "@/pages/app/goals/dashboard";
import { Dashboard } from "@/pages/app/todo/dashboard";
import { Inbox } from "@/pages/app/todo/inbox";
import { Projects } from "@/pages/app/todo/projects";
import { Today } from "@/pages/app/todo/today";
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
					<Route path={ROUTES.TODO.INBOX} element={<Inbox />} />
					<Route path={ROUTES.TODO.TODAY} element={<Today />} />
					<Route path={ROUTES.TODO.PROJECTS} element={<Projects />} />


					<Route path={ROUTES.GOALS_DASHBOARD} element={<GoalsDashboard />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
