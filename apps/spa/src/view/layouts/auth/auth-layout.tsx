import { Outlet } from "react-router-dom";
import { AuthLayoutBrandPanel } from "./auth-layout-brand-panel";

export function AuthLayout() {
	return (
		<div className="grid min-h-svh grid-cols-1 md:grid-cols-2">
			<div className="sticky top-0 hidden h-svh md:block">
				<AuthLayoutBrandPanel />
			</div>
			{/* Same aesthetic as static HTML: --canvas #F7F6F4 */}
			<div className="form-panel flex min-h-svh flex-col items-center justify-center bg-[#F7F6F4] px-6 py-10 md:px-10 md:py-12">
				<Outlet />
			</div>
		</div>
	);
}
