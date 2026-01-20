import { ROUTES } from "@/config/routes";
import { TodoLayout } from "@/layouts/app/todo-layout";
import { Dashboard } from "@/pages/app/todo/dashboard";
import { Inbox } from "@/pages/app/todo/inbox";
import { Projects } from "@/pages/app/todo/projects";
import { Today } from "@/pages/app/todo/today";
import { Route } from "react-router-dom";

export function TodoRoutes() {
	return (
		<Route path="/" element={<TodoLayout />}>
			<Route path={ROUTES.TODO.DASHBOARD} element={<Dashboard />} />
			<Route path={ROUTES.TODO.INBOX} element={<Inbox />} />
			<Route path={ROUTES.TODO.TODAY} element={<Today />} />
			<Route path={ROUTES.TODO.PROJECTS} element={<Projects />} />
		</Route>
	);
}
