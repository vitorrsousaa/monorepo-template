/**
 * Mocks para o Goals Dashboard enquanto a API não está integrada.
 * Alinhado com o domínio: Project em modo objetivo = Goal.
 * Reutiliza MOCK_USER_ID do dashboard.
 */
import { MOCK_USER_ID } from "../../tasks/dashboard/dashboard.mocks";

function todayIso() {
	return new Date().toISOString().split("T")[0];
}

export type GoalsTask = {
	id: string;
	title: string;
	description?: string;
	status: "concluida" | "pendente";
	dueDate?: string;
	projectId: string;
	userId: string;
};

export type GoalsProject = {
	id: string;
	name: string;
	emoji: string;
	description?: string;
	color?: string;
	status: "ativo" | "concluido" | "arquivado";
	/** Project em modo objetivo: tem targetValue ou deadline */
	targetValue?: number;
	currentValue?: number;
	unit?: string;
	deadline?: string;
	userId: string;
};

/** Projects que são metas (modo objetivo) */
export const GOALS_PROJECTS_MOCK: GoalsProject[] = [
	{
		id: "g1",
		name: "Ler 12 livros em 2026",
		emoji: "📚",
		description: "Meta de leitura anual",
		color: "#7C3AED",
		status: "ativo",
		targetValue: 12,
		currentValue: 4,
		unit: "livros",
		deadline: "2026-12-31",
		userId: MOCK_USER_ID,
	},
	{
		id: "g2",
		name: "Juntar reserva de emergência",
		emoji: "💰",
		description: "R$ 20.000 para emergências",
		color: "#059669",
		status: "ativo",
		targetValue: 20000,
		currentValue: 8500,
		unit: "R$",
		deadline: "2026-06-30",
		userId: MOCK_USER_ID,
	},
	{
		id: "g3",
		name: "Correr 5km",
		emoji: "🏃",
		description: "Preparação para corrida",
		color: "#DC2626",
		status: "ativo",
		targetValue: 5,
		currentValue: 2,
		unit: "km",
		userId: MOCK_USER_ID,
	},
	{
		id: "g4",
		name: "Lançar App LifeOS",
		emoji: "🚀",
		description: "MVP e publicação",
		color: "#2563EB",
		status: "ativo",
		userId: MOCK_USER_ID,
	},
	{
		id: "g5",
		name: "Curso de TypeScript",
		emoji: "📖",
		description: "Concluir curso completo",
		status: "concluido",
		targetValue: 10,
		currentValue: 10,
		unit: "módulos",
		deadline: "2026-02-28",
		userId: MOCK_USER_ID,
	},
	{
		id: "g6",
		name: "Organizar escritório",
		emoji: "🪑",
		description: "Reorganização adiada",
		color: "#6B7280",
		status: "arquivado",
		targetValue: 1,
		currentValue: 0,
		unit: "projeto",
		userId: MOCK_USER_ID,
	},
];

export const GOALS_TASKS_MOCK: GoalsTask[] = [
	{
		id: "gt1",
		title: "Ler Sapiens",
		status: "concluida",
		dueDate: "2026-01-15",
		projectId: "g1",
		userId: MOCK_USER_ID,
	},
	{
		id: "gt2",
		title: "Ler Hábitos Atômicos",
		status: "concluida",
		dueDate: "2026-02-01",
		projectId: "g1",
		userId: MOCK_USER_ID,
	},
	{
		id: "gt3",
		title: "Ler Deep Work",
		status: "concluida",
		projectId: "g1",
		userId: MOCK_USER_ID,
	},
	{
		id: "gt4",
		title: "Ler O Poder do Hábito",
		status: "concluida",
		dueDate: "2026-03-01",
		projectId: "g1",
		userId: MOCK_USER_ID,
	},
	{
		id: "gt5",
		title: "Ler capítulo 3 do livro atual",
		status: "pendente",
		dueDate: "2026-03-10",
		projectId: "g1",
		userId: MOCK_USER_ID,
	},
	{
		id: "gt6",
		title: "Definir MVP",
		status: "concluida",
		projectId: "g4",
		userId: MOCK_USER_ID,
	},
	{
		id: "gt7",
		title: "Criar tela de inbox",
		status: "pendente",
		dueDate: "2026-03-15",
		projectId: "g4",
		userId: MOCK_USER_ID,
	},
	{
		id: "gt8",
		title: "Implementar API de projetos",
		status: "pendente",
		dueDate: "2026-03-20",
		projectId: "g4",
		userId: MOCK_USER_ID,
	},
	{
		id: "gt9",
		title: "Publicar na App Store",
		status: "pendente",
		dueDate: "2026-04-30",
		projectId: "g4",
		userId: MOCK_USER_ID,
	},
];
