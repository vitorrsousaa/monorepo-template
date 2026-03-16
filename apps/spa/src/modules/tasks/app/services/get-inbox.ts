import { httpClient } from "@/services/http-client";
import type { GetInboxTasksResponse } from "@repo/contracts/tasks/inbox";

export async function getInboxTasks() {
	const { data } = await httpClient.get<GetInboxTasksResponse>("/tasks/inbox");

	return data;
}
