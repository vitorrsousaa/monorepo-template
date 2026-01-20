import { ROUTES } from "@/config/routes";
import { Signin } from "@/pages/auth/signin";
import { Signup } from "@/pages/auth/signup";
import { Navigate, Route } from "react-router-dom";

export function AuthRoutes() {
	return (
		<>
			<Route index element={<Navigate to={ROUTES.SIGNIN} replace />} />
			<Route path={ROUTES.SIGNIN} element={<Signin />} />
			<Route path={ROUTES.SIGNUP} element={<Signup />} />
		</>
	);
}
