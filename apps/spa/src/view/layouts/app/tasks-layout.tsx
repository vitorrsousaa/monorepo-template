import { GlobalAddTaskButton } from "@/modules/tasks/view/components/global-add-task-button";
import { Outlet } from "react-router-dom";

export function TasksLayout() {
	return (
		<>
			<Outlet />
			<GlobalAddTaskButton />
		</>
	);
}
