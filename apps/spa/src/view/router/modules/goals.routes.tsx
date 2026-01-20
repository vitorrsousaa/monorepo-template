import { ROUTES } from "@/config/routes";
import { GoalsDashboard } from "@/pages/app/goals/dashboard";
import { Route } from "react-router-dom";

export function GoalsRoutes() {
	return <Route path={ROUTES.GOALS_DASHBOARD} element={<GoalsDashboard />} />;
}
