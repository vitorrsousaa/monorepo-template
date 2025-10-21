import { ROUTES } from "@/config/routes";
import { Dashboard } from "@/pages/app/dashboard";
import { Signin } from "@/pages/auth/signin";
import { NotFound } from "@/pages/not-found";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Navigate to={ROUTES.SIGNIN} replace />} />
				<Route path={ROUTES.SIGNIN} element={<Signin />} />
				<Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
}
