import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { useTheme } from "@repo/ui/providers";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/select";
import { Separator } from "@repo/ui/separator";
import { Switch } from "@repo/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { cn } from "@repo/ui/utils";
import { AlertTriangle, Monitor, Moon, Sun } from "lucide-react";
import { useState } from "react";

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h3 className="text-base font-semibold text-foreground mb-4">{children}</h3>
	);
}

function SettingRow({
	label,
	description,
	children,
}: {
	label: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-3">
			<div className="flex-1">
				<p className="text-sm font-medium text-foreground">{label}</p>
				{description && (
					<p className="text-xs text-muted-foreground mt-0.5">{description}</p>
				)}
			</div>
			<div className="shrink-0">{children}</div>
		</div>
	);
}

export function Settings() {
	const { theme, setTheme } = useTheme();
	const [notifs, setNotifs] = useState({
		email: true,
		push: false,
		tarefas: true,
		metas: true,
		resumo: false,
	});

	const toggleNotif = (key: keyof typeof notifs) =>
		setNotifs((n) => ({ ...n, [key]: !n[key] }));

	return (
		<div className="flex-1 p-6 max-w-4xl mx-auto space-y-6 w-full">
			<div>
				<h2 className="text-xl font-bold text-foreground">Configurações</h2>
				<p className="text-sm text-muted-foreground mt-0.5">
					Notificações, segurança, assinatura e preferências
				</p>
			</div>

			<Tabs defaultValue="notificacoes" className="space-y-6 w-full">
				<TabsList className="flex h-auto gap-1 w-full">
					<TabsTrigger value="notificacoes" className="flex-1">
						Notificações
					</TabsTrigger>
					<TabsTrigger value="seguranca" className="flex-1">
						Segurança
					</TabsTrigger>
					<TabsTrigger value="assinatura" className="flex-1">
						Assinatura
					</TabsTrigger>
					<TabsTrigger value="preferencias" className="flex-1">
						Preferências
					</TabsTrigger>
				</TabsList>

				{/* Notificações */}
				<TabsContent value="notificacoes" className="space-y-4">
					<div className="bg-card border border-border rounded-xl p-6 space-y-1 divide-y divide-border">
						<SectionTitle>Canais</SectionTitle>
						<SettingRow
							label="Notificações por email"
							description="Receba atualizações no seu email"
						>
							<Switch
								checked={notifs.email}
								onCheckedChange={() => toggleNotif("email")}
							/>
						</SettingRow>
						<SettingRow
							label="Notificações push"
							description="Notificações no navegador"
						>
							<Switch
								checked={notifs.push}
								onCheckedChange={() => toggleNotif("push")}
							/>
						</SettingRow>

						<div className="pt-4">
							<SectionTitle>Eventos</SectionTitle>
						</div>
						<SettingRow
							label="Vencimento de tarefas"
							description="Alertas quando uma tarefa está prestes a vencer"
						>
							<Switch
								checked={notifs.tarefas}
								onCheckedChange={() => toggleNotif("tarefas")}
							/>
						</SettingRow>
						<SettingRow
							label="Atualização de metas"
							description="Acompanhamento do progresso de metas"
						>
							<Switch
								checked={notifs.metas}
								onCheckedChange={() => toggleNotif("metas")}
							/>
						</SettingRow>
						<SettingRow
							label="Resumo semanal"
							description="Resumo de produtividade toda segunda-feira"
						>
							<Switch
								checked={notifs.resumo}
								onCheckedChange={() => toggleNotif("resumo")}
							/>
						</SettingRow>
					</div>
				</TabsContent>

				{/* Segurança */}
				<TabsContent value="seguranca" className="space-y-4">
					<div className="bg-card border border-border rounded-xl p-6 space-y-4">
						<SectionTitle>Alterar senha</SectionTitle>
						<div className="space-y-3">
							<div className="space-y-1.5">
								<Label htmlFor="current-pw">Senha atual</Label>
								<Input id="current-pw" type="password" />
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="new-pw">Nova senha</Label>
								<Input id="new-pw" type="password" />
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="confirm-pw">Confirmar nova senha</Label>
								<Input id="confirm-pw" type="password" />
							</div>
							<div className="flex justify-end pt-1">
								<Button>Atualizar senha</Button>
							</div>
						</div>
					</div>

					<div className="bg-card border border-border rounded-xl p-6 divide-y divide-border space-y-1">
						<SectionTitle>Segurança adicional</SectionTitle>
						<SettingRow
							label="Autenticação em dois fatores"
							description="Adicione uma camada extra de segurança"
						>
							<Button variant="outline" size="sm">
								Ativar 2FA
							</Button>
						</SettingRow>
						<SettingRow
							label="Sessões ativas"
							description="1 dispositivo logado"
						>
							<Button variant="outline" size="sm">
								Gerenciar
							</Button>
						</SettingRow>
					</div>
				</TabsContent>

				{/* Assinatura */}
				<TabsContent value="assinatura" className="space-y-4">
					<div className="bg-card border border-border rounded-xl p-6 space-y-4">
						<SectionTitle>Plano atual</SectionTitle>
						<div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-lg">
							<div>
								<p className="font-semibold text-foreground">Plano Free</p>
								<p className="text-sm text-muted-foreground">
									Projetos ilimitados, até 5 metas
								</p>
							</div>
							<Button size="sm">Fazer upgrade</Button>
						</div>

						<Separator />
						<div className="space-y-2">
							<h4 className="text-sm font-semibold text-foreground">
								Planos disponíveis
							</h4>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{[
									{
										name: "Pro",
										price: "R$ 19/mês",
										features: [
											"Metas ilimitadas",
											"Integrações",
											"Suporte prioritário",
										],
									},
									{
										name: "Família",
										price: "R$ 39/mês",
										features: [
											"5 usuários",
											"Agenda compartilhada",
											"Tudo do Pro",
										],
									},
								].map((plan) => (
									<div
										key={plan.name}
										className="border border-border rounded-lg p-4 space-y-2"
									>
										<div className="flex items-center justify-between">
											<span className="font-semibold text-foreground">
												{plan.name}
											</span>
											<span className="text-sm text-primary font-medium">
												{plan.price}
											</span>
										</div>
										<ul className="space-y-1">
											{plan.features.map((f) => (
												<li
													key={f}
													className="text-xs text-muted-foreground flex items-center gap-1.5"
												>
													<span className="w-1 h-1 rounded-full bg-primary inline-block" />
													{f}
												</li>
											))}
										</ul>
										<Button variant="outline" size="sm" className="w-full">
											Assinar
										</Button>
									</div>
								))}
							</div>
						</div>
					</div>
				</TabsContent>

				{/* Preferências */}
				<TabsContent value="preferencias" className="space-y-4">
					<div className="bg-card border border-border rounded-xl p-6 space-y-5">
						<SectionTitle>Tema</SectionTitle>
						<div className="grid grid-cols-3 gap-3">
							{[
								{ id: "light", label: "Claro", icon: Sun },
								{ id: "dark", label: "Escuro", icon: Moon },
								{ id: "system", label: "Sistema", icon: Monitor },
							].map(({ id, label, icon: Icon }) => (
								<button
									key={id}
									type="button"
									onClick={() => setTheme(id as "light" | "dark" | "system")}
									className={cn(
										"flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
										theme === id
											? "border-primary bg-primary/5"
											: "border-border hover:border-primary/40",
									)}
								>
									<Icon
										className={cn(
											"w-5 h-5",
											theme === id ? "text-primary" : "text-muted-foreground",
										)}
									/>
									<span
										className={cn(
											"text-sm font-medium",
											theme === id ? "text-primary" : "text-muted-foreground",
										)}
									>
										{label}
									</span>
								</button>
							))}
						</div>

						<Separator />
						<div className="space-y-1.5">
							<Label htmlFor="lang">Idioma</Label>
							<Select defaultValue="pt-BR">
								<SelectTrigger className="w-48">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="pt-BR">Português (Brasil)</SelectItem>
									<SelectItem value="en">English</SelectItem>
									<SelectItem value="es">Español</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Separator />
						<div className="space-y-3 divide-y divide-border">
							<SectionTitle>Privacidade</SectionTitle>
							<SettingRow
								label="Análises de uso"
								description="Ajude a melhorar o LifeOS compartilhando dados anônimos"
							>
								<Switch defaultChecked />
							</SettingRow>
						</div>

						<Separator />
						<div className="space-y-3">
							<h3 className="text-base font-semibold text-destructive">
								Zona de perigo
							</h3>
							<div className="p-4 border border-destructive/30 rounded-lg bg-destructive/5">
								<div className="flex items-start gap-3">
									<AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
									<div className="flex-1">
										<p className="text-sm font-medium text-foreground">
											Excluir conta
										</p>
										<p className="text-xs text-muted-foreground mt-0.5">
											Esta ação é permanente e não pode ser desfeita. Todos os
											seus dados serão removidos.
										</p>
									</div>
									<Button variant="destructive" size="sm">
										Excluir conta
									</Button>
								</div>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
