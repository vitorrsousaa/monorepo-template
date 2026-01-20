import { ROUTES } from "@/config/routes";
import { Settings } from "@/pages/app/settings";
import { Route } from "react-router-dom";

export function SettingsRoutes() {
	return <Route path={ROUTES.SETTINGS} element={<Settings />} />;
}
