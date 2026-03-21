/**
 * Mocks para o Dashboard enquanto a API não está integrada.
 * Alinhado com MOCK_USER_ID da API.
 */
export const MOCK_USER_ID = "aaaaaaaa-bbbb-4ccc-d000-000000000000" as const;

function todayIso() {
	return new Date().toISOString().split("T")[0];
}

export type DashboardTask = {
	id: string;
	title: string;
	description?: string;
	status: "concluida" | "pendente";
	dueDate: string;
	projectId: string;
	userId: string;
};

export type DashboardProject = {
	id: string;
	name: string;
	emoji: string;
	description?: string;
	status: "ativo" | "concluido" | "arquivado";
	isGoal?: boolean;
	targetValue?: number;
	currentValue?: number;
	unit?: string;
	userId: string;
};

export const TASKS_MOCK: DashboardTask[] = [
	// Tarefas para hoje
	{
		id: "t1",
		title: "Revisar PR do João",
		description: "Clean Architecture - camada de domínio",
		status: "pendente",
		dueDate: todayIso(),
		projectId: "1",
		userId: MOCK_USER_ID,
	},
	{
		id: "t2",
		title: "Daily standup",
		status: "concluida",
		dueDate: todayIso(),
		projectId: "1",
		userId: MOCK_USER_ID,
	},
	{
		id: "t3",
		title: "Comprar ração do Bob",
		description: "10 semanas",
		status: "pendente",
		dueDate: todayIso(),
		projectId: "2",
		userId: MOCK_USER_ID,
	},
	{
		id: "t4",
		title: "Practice speak in english",
		description: "Gliglish · 15 min",
		status: "pendente",
		dueDate: todayIso(),
		projectId: "3",
		userId: MOCK_USER_ID,
	},
	{
		id: "t5",
		title: "Meditação",
		description: "10 minutos",
		status: "concluida",
		dueDate: todayIso(),
		projectId: "3",
		userId: MOCK_USER_ID,
	},
	// Tarefas de outros dias
	{
		id: "t6",
		title: "Ler capítulo 3 do livro",
		status: "pendente",
		dueDate: "2026-03-10",
		projectId: "3",
		userId: MOCK_USER_ID,
	},
	{
		id: "t7",
		title: "Pagar fatura do cartão",
		status: "pendente",
		dueDate: "2026-03-15",
		projectId: "4",
		userId: MOCK_USER_ID,
	},
	{
		id: "t8",
		title: "Implementar endpoint de usuários",
		status: "pendente",
		dueDate: "2026-03-12",
		projectId: "1",
		userId: MOCK_USER_ID,
	},
	{
		id: "t9",
		title: "Configurar variáveis de ambiente",
		status: "concluida",
		dueDate: "2026-03-05",
		projectId: "1",
		userId: MOCK_USER_ID,
	},
	{
		id: "t10",
		title: "Assistir vídeo do Cesar",
		status: "pendente",
		dueDate: "2026-03-20",
		projectId: "3",
		userId: MOCK_USER_ID,
	},
];

export const PROJECTS_MOCK: DashboardProject[] = [
	{
		id: "1",
		name: "Profissional",
		emoji: "💼",
		description: "Tarefas do trabalho e desenvolvimento",
		status: "ativo",
		isGoal: false,
		userId: MOCK_USER_ID,
	},
	{
		id: "2",
		name: "Casa",
		emoji: "🏠",
		description: "Tarefas domésticas e compras",
		status: "ativo",
		isGoal: false,
		userId: MOCK_USER_ID,
	},
	{
		id: "3",
		name: "Estudos",
		emoji: "🎓",
		description: "Inglês e aprendizado contínuo",
		status: "ativo",
		isGoal: true,
		targetValue: 12,
		currentValue: 4,
		unit: "livros",
		userId: MOCK_USER_ID,
	},
	{
		id: "4",
		name: "Pessoal",
		emoji: "😊",
		description: "Saúde, hábitos e finanças",
		status: "ativo",
		isGoal: true,
		targetValue: 20000,
		currentValue: 8500,
		unit: "R$",
		userId: MOCK_USER_ID,
	},
];
