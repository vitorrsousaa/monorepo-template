"use client";

import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/select";
import { Separator } from "@repo/ui/separator";
import { Textarea } from "@repo/ui/textarea";
import { cn } from "@repo/ui/utils";
import {
	AlertCircle,
	BookOpen,
	Bug,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	Clock,
	ExternalLink,
	Lightbulb,
	Mail,
	MessageSquare,
	Search,
	Send,
	Star,
	Zap,
} from "lucide-react";
import { useState } from "react";

// ---------- Tipos ----------
interface FaqItem {
	question: string;
	answer: string;
}

interface FaqCategory {
	label: string;
	icon: React.ElementType;
	items: FaqItem[];
}

interface Ticket {
	id: string;
	subject: string;
	status: "aberto" | "em-andamento" | "resolvido";
	category: string;
	createdAt: string;
	lastUpdate: string;
}

// ---------- Dados ----------
const faqCategories: FaqCategory[] = [
	{
		label: "Primeiros passos",
		icon: Zap,
		items: [
			{
				question: "Como crio meu primeiro projeto?",
				answer:
					'Clique no botão "+" ao lado de "Projetos" na barra lateral esquerda. Defina um nome, emoji e cor para o projeto e confirme. Em seguida, você pode adicionar tarefas e seções ao projeto recém-criado.',
			},
			{
				question: "Como adiciono uma tarefa a um projeto?",
				answer:
					'Abra o projeto desejado na sidebar. Clique em "Nova tarefa" dentro da seção onde deseja adicioná-la, ou use o atalho "N" em qualquer tela para abrir o modal de nova tarefa e selecionar o projeto.',
			},
			{
				question: "Qual a diferença entre Inbox e Hoje?",
				answer:
					"O Inbox é onde ficam tarefas sem data definida ou recém-capturadas. O Hoje mostra todas as tarefas com vencimento no dia atual, organizadas em kanban por projeto — é o seu ponto de partida diário.",
			},
		],
	},
	{
		label: "Tarefas e projetos",
		icon: BookOpen,
		items: [
			{
				question: "Como defino a prioridade de uma tarefa?",
				answer:
					"Ao criar ou editar uma tarefa, utilize o campo Prioridade para selecionar entre Alta, Média e Baixa. Tarefas de alta prioridade aparecem com destaque vermelho nas listagens.",
			},
			{
				question: "Posso mover uma tarefa entre projetos?",
				answer:
					"Sim. Abra a tarefa, clique no nome do projeto associado e selecione outro projeto no menu suspenso. A tarefa será movida instantaneamente sem perder nenhuma informação.",
			},
			{
				question: "Como arquivo um projeto concluído?",
				answer:
					"Acesse a página do projeto, clique nos três pontos no canto superior direito e selecione Arquivar. Projetos arquivados ficam ocultos na sidebar mas podem ser acessados em Configurações > Projetos arquivados.",
			},
		],
	},
	{
		label: "Metas e progresso",
		icon: Star,
		items: [
			{
				question: "Como funciona o acompanhamento de metas?",
				answer:
					"Na seção Metas, você define um valor alvo e uma unidade de medida (km, R$, aulas etc.). Atualize o progresso clicando em Atualizar progresso e o gráfico circular é recalculado automaticamente.",
			},
			{
				question: "Posso vincular tarefas a uma meta?",
				answer:
					"Sim. Ao criar ou editar uma tarefa, selecione o projeto que está associado à meta. Concluir essas tarefas contribui para o indicador de produtividade semanal visível no Dashboard.",
			},
		],
	},
	{
		label: "Conta e cobrança",
		icon: Mail,
		items: [
			{
				question: "Como cancelo minha assinatura?",
				answer:
					"Vá em Configurações > Assinatura e clique em Cancelar plano. O acesso Pro permanece ativo até o fim do período pago. Seus dados não são deletados ao cancelar.",
			},
			{
				question: "Como solicito reembolso?",
				answer:
					"Reembolsos são aceitos em até 7 dias após a cobrança. Abra um chamado abaixo com o assunto Solicitação de reembolso e inclua o e-mail da conta e a data da cobrança.",
			},
		],
	},
];

const mockTickets: Ticket[] = [
	{
		id: "#1042",
		subject: "Notificações não estão chegando",
		status: "em-andamento",
		category: "Bug",
		createdAt: "02/03/2026",
		lastUpdate: "Hoje, 10:14",
	},
	{
		id: "#1038",
		subject: "Dúvida sobre limite do plano Free",
		status: "resolvido",
		category: "Planos",
		createdAt: "24/02/2026",
		lastUpdate: "28/02/2026",
	},
];

// ---------- Subcomponentes ----------
function FaqAccordion({ category }: { category: FaqCategory }) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const Icon = category.icon;

	return (
		<div className="space-y-1">
			<div className="flex items-center gap-2 mb-3">
				<div className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent">
					<Icon className="w-3.5 h-3.5 text-accent-foreground" />
				</div>
				<span className="text-sm font-semibold text-foreground">
					{category.label}
				</span>
			</div>

			<div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
				{category.items.map((item, i) => (
					<div key={i}>
						<button
							onClick={() => setOpenIndex(openIndex === i ? null : i)}
							className="flex items-center justify-between w-full px-4 py-3.5 text-left hover:bg-muted/50 transition-colors"
						>
							<span className="text-sm font-medium text-foreground pr-4">
								{item.question}
							</span>
							{openIndex === i ? (
								<ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
							) : (
								<ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
							)}
						</button>
						{openIndex === i && (
							<div className="px-4 pb-4 pt-1 bg-muted/30">
								<p className="text-sm text-muted-foreground leading-relaxed">
									{item.answer}
								</p>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

function StatusBadge({ status }: { status: Ticket["status"] }) {
	const map = {
		aberto: {
			label: "Aberto",
			icon: Clock,
			className:
				"bg-amber-500/15 text-amber-700 dark:text-amber-200 border-amber-500/30",
		},
		"em-andamento": {
			label: "Em andamento",
			icon: AlertCircle,
			className: "bg-primary/10 text-primary border-primary/20",
		},
		resolvido: {
			label: "Resolvido",
			icon: CheckCircle2,
			className:
				"bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 border-emerald-500/30",
		},
	};
	const { label, icon: Icon, className } = map[status];
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border",
				className,
			)}
		>
			<Icon className="w-3 h-3" />
			{label}
		</span>
	);
}

// ---------- Componente principal ----------
export function Support() {
	const [faqSearch, setFaqSearch] = useState("");
	const [activeSection, setActiveSection] = useState<
		"faq" | "contato" | "chamados"
	>("faq");
	const [formSent, setFormSent] = useState(false);
	const [formData, setFormData] = useState({
		subject: "",
		category: "",
		message: "",
	});

	const filteredCategories = faqSearch.trim()
		? faqCategories
				.map((cat) => ({
					...cat,
					items: cat.items.filter(
						(item) =>
							item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
							item.answer.toLowerCase().includes(faqSearch.toLowerCase()),
					),
				}))
				.filter((cat) => cat.items.length > 0)
		: faqCategories;

	const handleSend = () => {
		if (!formData.subject || !formData.category || !formData.message) return;
		setFormSent(true);
	};

	return (
		<div className="flex-1 p-6 max-w-3xl mx-auto space-y-6 w-full">
			{/* Header */}
			<div>
				<h2 className="text-xl font-bold text-foreground">Suporte</h2>
				<p className="text-sm text-muted-foreground mt-0.5">
					Central de ajuda e contato com nossa equipe
				</p>
			</div>

			{/* Cards de ação rápida */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				{[
					{
						id: "faq" as const,
						icon: BookOpen,
						label: "Base de conhecimento",
						desc: "Respostas às perguntas frequentes",
					},
					{
						id: "contato" as const,
						icon: MessageSquare,
						label: "Abrir chamado",
						desc: "Fale com nossa equipe de suporte",
					},
					{
						id: "chamados" as const,
						icon: Mail,
						label: "Meus chamados",
						desc: "Acompanhe suas solicitações",
					},
				].map(({ id, icon: Icon, label, desc }) => (
					<button
						key={id}
						type="button"
						onClick={() => setActiveSection(id)}
						className={cn(
							"flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all",
							activeSection === id
								? "border-primary bg-primary/5"
								: "border-border hover:border-primary/40 bg-card",
						)}
					>
						<div
							className={cn(
								"flex items-center justify-center w-8 h-8 rounded-lg",
								activeSection === id
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground",
							)}
						>
							<Icon className="w-4 h-4" />
						</div>
						<div>
							<p
								className={cn(
									"text-sm font-semibold",
									activeSection === id ? "text-primary" : "text-foreground",
								)}
							>
								{label}
							</p>
							<p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
						</div>
					</button>
				))}
			</div>

			{/* ---- FAQ ---- */}
			{activeSection === "faq" && (
				<div className="space-y-5">
					{/* Busca */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Buscar na base de conhecimento..."
							className="pl-9"
							value={faqSearch}
							onChange={(e) => setFaqSearch(e.target.value)}
						/>
					</div>

					{filteredCategories.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Lightbulb className="w-10 h-10 text-muted-foreground/40 mb-3" />
							<p className="text-sm font-medium text-foreground">
								Nenhum resultado encontrado
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								Tente outros termos ou abra um chamado
							</p>
							<Button
								size="sm"
								variant="outline"
								className="mt-4"
								onClick={() => setActiveSection("contato")}
							>
								Abrir chamado
							</Button>
						</div>
					) : (
						<div className="space-y-6">
							{filteredCategories.map((cat) => (
								<FaqAccordion key={cat.label} category={cat} />
							))}
						</div>
					)}

					<Separator />
				</div>
			)}

			{/* ---- Abrir chamado ---- */}
			{activeSection === "contato" && (
				<div className="bg-card border border-border rounded-xl p-6 space-y-5">
					{formSent ? (
						<div className="flex flex-col items-center justify-center py-10 text-center">
							<div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/15 mb-4">
								<CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
							</div>
							<h3 className="text-base font-semibold text-foreground">
								Chamado enviado!
							</h3>
							<p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
								Nossa equipe responderá em até 24 horas no email da sua conta.
							</p>
							<div className="flex gap-2 mt-5">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setActiveSection("chamados")}
								>
									Ver chamados
								</Button>
								<Button
									size="sm"
									onClick={() => {
										setFormSent(false);
										setFormData({ subject: "", category: "", message: "" });
									}}
								>
									Novo chamado
								</Button>
							</div>
						</div>
					) : (
						<>
							<div>
								<h3 className="text-base font-semibold text-foreground">
									Novo chamado
								</h3>
								<p className="text-sm text-muted-foreground mt-0.5">
									Descreva o seu problema ou dúvida com o máximo de detalhes
								</p>
							</div>

							<div className="space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-1.5">
										<Label htmlFor="ticket-subject">Assunto</Label>
										<Input
											id="ticket-subject"
											placeholder="Descreva brevemente o problema"
											value={formData.subject}
											onChange={(e) =>
												setFormData((f) => ({ ...f, subject: e.target.value }))
											}
										/>
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="ticket-category">Categoria</Label>
										<Select
											value={formData.category}
											onValueChange={(v) =>
												setFormData((f) => ({ ...f, category: v }))
											}
										>
											<SelectTrigger id="ticket-category">
												<SelectValue placeholder="Selecione..." />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="bug">
													<span className="flex items-center gap-2">
														<Bug className="w-3.5 h-3.5" /> Bug / Erro
													</span>
												</SelectItem>
												<SelectItem value="duvida">
													<span className="flex items-center gap-2">
														<Lightbulb className="w-3.5 h-3.5" /> Dúvida geral
													</span>
												</SelectItem>
												<SelectItem value="planos">
													<span className="flex items-center gap-2">
														<Star className="w-3.5 h-3.5" /> Planos e cobrança
													</span>
												</SelectItem>
												<SelectItem value="sugestao">
													<span className="flex items-center gap-2">
														<Zap className="w-3.5 h-3.5" /> Sugestão de melhoria
													</span>
												</SelectItem>
												<SelectItem value="outro">Outro</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="space-y-1.5">
									<Label htmlFor="ticket-message">Mensagem</Label>
									<Textarea
										id="ticket-message"
										placeholder="Descreva detalhadamente: o que aconteceu, em qual tela, quais passos realizou..."
										rows={5}
										value={formData.message}
										onChange={(e) =>
											setFormData((f) => ({ ...f, message: e.target.value }))
										}
									/>
									<p className="text-xs text-muted-foreground">
										{formData.message.length}/2000 caracteres
									</p>
								</div>

								<div className="flex items-center justify-between pt-1">
									<p className="text-xs text-muted-foreground">
										Tempo médio de resposta:{" "}
										<span className="font-medium text-foreground">
											2–4 horas
										</span>
									</p>
									<Button
										onClick={handleSend}
										disabled={
											!formData.subject ||
											!formData.category ||
											!formData.message
										}
										className="gap-2"
									>
										<Send className="w-3.5 h-3.5" />
										Enviar chamado
									</Button>
								</div>
							</div>
						</>
					)}
				</div>
			)}

			{/* ---- Meus chamados ---- */}
			{activeSection === "chamados" && (
				<div className="space-y-4">
					<div className="bg-card border border-border rounded-xl overflow-hidden">
						<div className="px-5 py-4 border-b border-border flex items-center justify-between">
							<h3 className="text-sm font-semibold text-foreground">
								Chamados recentes
							</h3>
							<Button
								size="sm"
								variant="outline"
								onClick={() => setActiveSection("contato")}
							>
								Novo chamado
							</Button>
						</div>

						{mockTickets.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-10 text-center px-4">
								<Mail className="w-8 h-8 text-muted-foreground/40 mb-3" />
								<p className="text-sm font-medium text-foreground">
									Nenhum chamado encontrado
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									Abra um chamado para falar com nosso suporte
								</p>
							</div>
						) : (
							<div className="divide-y divide-border">
								{mockTickets.map((ticket) => (
									<div
										key={ticket.id}
										className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
									>
										<div className="space-y-1 min-w-0">
											<div className="flex items-center gap-2 flex-wrap">
												<span className="text-xs font-mono text-muted-foreground">
													{ticket.id}
												</span>
												<Badge
													variant="outline"
													className="text-xs px-1.5 py-0 h-5"
												>
													{ticket.category}
												</Badge>
											</div>
											<p className="text-sm font-medium text-foreground truncate">
												{ticket.subject}
											</p>
											<p className="text-xs text-muted-foreground">
												Aberto em {ticket.createdAt} · Atualizado:{" "}
												{ticket.lastUpdate}
											</p>
										</div>
										<StatusBadge status={ticket.status} />
									</div>
								))}
							</div>
						)}
					</div>

					{/* Contato direto */}
					<div className="bg-accent/40 border border-border rounded-xl p-5 flex items-start gap-4">
						<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
							<Mail className="w-4 h-4 text-primary" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-semibold text-foreground">
								Contato direto por email
							</p>
							<p className="text-xs text-muted-foreground mt-0.5">
								Para assuntos urgentes ou de cobrança, envie um email para{" "}
								<span className="font-medium text-foreground">
									suporte@lifeos.app
								</span>
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							className="shrink-0 gap-1.5"
							asChild
						>
							<a href="mailto:suporte@lifeos.app">
								<ExternalLink className="w-3.5 h-3.5" />
								Enviar email
							</a>
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
