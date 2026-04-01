export type NotificationType =
	| "task_due"
	| "task_overdue"
	| "task_completed"
	| "goal_progress"
	| "comment"
	| "shared_task"
	| "shared_expense"
	| "invite"
	| "finance_budget"
	| "system";

export type NotificationStatus = "read" | "unread";

export type InviteResolution = "pending" | "accepted" | "declined";

export interface NotificationMetadata {
	taskName?: string;
	projectName?: string;
	userName?: string;
	userAvatar?: string;
	tag?: { label: string; color: string };
	actionUrl?: string;
	daysOverdue?: number;
	goalPercent?: number;
	inviteData?: {
		groupName: string;
		memberCount: number;
	};
}

export interface Notification {
	id: string;
	type: NotificationType;
	status: NotificationStatus;
	timestamp: Date;
	title: string;
	metadata?: NotificationMetadata;
	inviteResolution?: InviteResolution;
}

const now = new Date();
const today = (offsetMinutes = 0) =>
	new Date(now.getTime() - offsetMinutes * 60_000);
const yesterday = (offsetHours = 0) =>
	new Date(now.getTime() - (24 + offsetHours) * 3_600_000);

export const NOTIFICATIONS_MOCK: Notification[] = [
	// Pending invites
	{
		id: "inv-1",
		type: "invite",
		status: "unread",
		timestamp: today(30),
		title: "invited you to",
		inviteResolution: "pending",
		metadata: {
			userName: "Ana Lima",
			inviteData: {
				groupName: "Planejamento Q2 2026",
				memberCount: 4,
			},
		},
	},
	{
		id: "inv-2",
		type: "invite",
		status: "unread",
		timestamp: today(90),
		title: "invited you to",
		inviteResolution: "pending",
		metadata: {
			userName: "Carlos Mendes",
			inviteData: {
				groupName: "App LifeOS – Sprint 4",
				memberCount: 6,
			},
		},
	},
	// Today
	{
		id: "today-1",
		type: "task_due",
		status: "unread",
		timestamp: today(15),
		title: "Revisar PR do João",
		metadata: {
			projectName: "Trabalho",
			tag: { label: "Hoje", color: "bg-amber-500/15 text-amber-600" },
		},
	},
	{
		id: "today-2",
		type: "task_overdue",
		status: "unread",
		timestamp: today(60),
		title: "Pagar fatura do cartão",
		metadata: {
			projectName: "Finanças",
			daysOverdue: 2,
			tag: { label: "Atrasada", color: "bg-red-500/15 text-red-600" },
		},
	},
	{
		id: "today-3",
		type: "goal_progress",
		status: "unread",
		timestamp: today(120),
		title: "Juntar R$ 20.000",
		metadata: {
			goalPercent: 75,
			tag: { label: "Meta", color: "bg-emerald-500/15 text-emerald-600" },
		},
	},
	{
		id: "today-4",
		type: "comment",
		status: "unread",
		timestamp: today(180),
		title: "Criar componente de header",
		metadata: {
			userName: "Beatriz Costa",
			projectName: "Dev – App LifeOS",
		},
	},
	{
		id: "today-5",
		type: "task_completed",
		status: "read",
		timestamp: today(240),
		title: "Configurar autenticação JWT",
		metadata: {
			projectName: "Dev – App LifeOS",
		},
	},
	{
		id: "today-6",
		type: "shared_task",
		status: "read",
		timestamp: today(300),
		title: "Marcar consulta com dentista",
		metadata: {
			userName: "Fernanda Oliveira",
		},
	},
	// Yesterday
	{
		id: "yest-1",
		type: "finance_budget",
		status: "read",
		timestamp: yesterday(2),
		title: "Orçamento de Alimentação",
		metadata: {
			tag: { label: "85% usado", color: "bg-orange-500/15 text-orange-600" },
		},
	},
	{
		id: "yest-2",
		type: "shared_expense",
		status: "read",
		timestamp: yesterday(5),
		title: "Jantar com amigos",
		metadata: {
			userName: "Pedro Alves",
			tag: { label: "R$ 47,50", color: "bg-blue-500/15 text-blue-600" },
		},
	},
	{
		id: "yest-3",
		type: "system",
		status: "read",
		timestamp: yesterday(8),
		title: "Backup automático realizado",
		metadata: {
			tag: { label: "Sistema", color: "bg-muted text-muted-foreground" },
		},
	},
];

export const TASK_NOTIFICATION_TYPES: NotificationType[] = [
	"task_due",
	"task_overdue",
	"task_completed",
	"goal_progress",
	"comment",
	"shared_task",
	"finance_budget",
	"system",
];
