import { httpClient } from "@/services/http-client";
import type { GetTodayTasksResponse } from "@repo/contracts/tasks/today";

export async function getTodayTasks() {
	const { data } = await httpClient.get<GetTodayTasksResponse>("/tasks/today");

	return data;
}
