/**
 * Mocks para a página Em breve (Upcoming) enquanto a API não está integrada.
 * Tarefas com datas futuras nos próximos 7 dias.
 */
import { addDays } from "@/utils/date-utils";
import type { DashboardTask } from "../../tasks/dashboard/dashboard.mocks";
import { MOCK_USER_ID } from "../../tasks/dashboard/dashboard.mocks";

function dateIso(d: Date): string {
	return d.toISOString().split("T")[0];
}

/** Retorna tarefas mock para os próximos 7 dias (excluindo hoje). */
export function getUpcomingTasksMock(): DashboardTask[] {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return [
		// Amanhã
		{
			id: "u1",
			title: "Ler capítulo 3 do livro",
			description: "Clean Code - cap. 3",
			status: "pendente",
			dueDate: dateIso(addDays(today, 1)),
			projectId: "3",
			userId: MOCK_USER_ID,
		},
		{
			id: "u2",
			title: "Reunião com equipe de design",
			status: "pendente",
			dueDate: dateIso(addDays(today, 1)),
			projectId: "1",
			userId: MOCK_USER_ID,
		},
		// Daqui 2 dias
		{
			id: "u3",
			title: "Implementar endpoint de usuários",
			description: "API REST - CRUD completo",
			status: "pendente",
			dueDate: dateIso(addDays(today, 2)),
			projectId: "1",
			userId: MOCK_USER_ID,
		},
		// Daqui 3 dias
		{
			id: "u4",
			title: "Configurar variáveis de ambiente",
			status: "pendente",
			dueDate: dateIso(addDays(today, 3)),
			projectId: "1",
			userId: MOCK_USER_ID,
		},
		{
			id: "u5",
			title: "Comprar presente aniversário",
			description: "Mãe - 15/03",
			status: "pendente",
			dueDate: dateIso(addDays(today, 3)),
			projectId: "2",
			userId: MOCK_USER_ID,
		},
		// Daqui 5 dias
		{
			id: "u6",
			title: "Pagar fatura do cartão",
			status: "pendente",
			dueDate: dateIso(addDays(today, 5)),
			projectId: "4",
			userId: MOCK_USER_ID,
		},
		// Daqui 7 dias
		{
			id: "u7",
			title: "Assistir vídeo do Cesar",
			description: "Curso de inglês - módulo 4",
			status: "pendente",
			dueDate: dateIso(addDays(today, 7)),
			projectId: "3",
			userId: MOCK_USER_ID,
		},
	];
}
