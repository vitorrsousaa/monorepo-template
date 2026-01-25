import { GlobalAddTaskButton } from "@/modules/todo/view/components/global-add-task-button";
import { Outlet } from "react-router-dom";

export function TodoLayout() {
	return (
		<>
			<Outlet />
			<GlobalAddTaskButton />
		</>
	);
}
