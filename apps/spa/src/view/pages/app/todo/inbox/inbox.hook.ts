import type { Todo } from "@/modules/todo/app/entities/todo";
import { useGetInboxTodos } from "@/modules/todo/app/hooks/use-get-inbox-todos";
import { useMemo } from "react";

const now = new Date();

const inboxTodos: Todo[] = [
	{
		id: "1",
		title: "Lists and Dictionaries",
		description: "Python Study Plan - data structures",
		project: "Python Study Plan",
		priority: "medium",
		completed: false,
		createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
		updatedAt: now,
	},
	{
		id: "2",
		title: "Error Handling",
		description: "Try/except and custom exceptions",
		project: "Python Study Plan",
		priority: "high",
		completed: false,
		createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
		updatedAt: now,
	},
	{
		id: "3",
		title: "Test Coverage",
		description: "Garantir cobertura de pelo menos 80%",
		project: "Study Plan - Automated Tests",
		priority: "medium",
		completed: false,
		createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
		updatedAt: now,
	},
	{
		id: "4",
		title: "CI/CD Integration",
		description: "Pipeline and deployment",
		project: "Study Plan - Automated Tests",
		priority: "high",
		completed: false,
		createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
		updatedAt: now,
	},
	{
		id: "5",
		title: "Review Python documentation",
		description: "Official docs and tutorials",
		project: null,
		priority: "low",
		completed: false,
		createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
		updatedAt: now,
	},
	{
		id: "6",
		title: "Set up development environment",
		description: "IDE, linter, formatter",
		project: null,
		priority: "high",
		completed: false,
		createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
		updatedAt: now,
	},
	{
		id: "7",
		title: "Research best practices for testing",
		description: "Unit, integration, e2e",
		project: null,
		priority: "medium",
		completed: false,
		createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
		updatedAt: now,
	},
];

export function useInboxHook() {
	const { todos, isErrorInboxTodos, isFetchingTodos, refetchTodos } =
		useGetInboxTodos();

	const shouldRenderInboxTodos = useMemo(
		() => Boolean(!isFetchingTodos && !isErrorInboxTodos),
		[isFetchingTodos, isErrorInboxTodos],
	);

	return {
		shouldRenderInboxTodos,
		inboxTodos: todos ?? [],
		isFetchingTodos,
		isErrorInboxTodos,
		refetchInboxTodos: refetchTodos,
	};
}
