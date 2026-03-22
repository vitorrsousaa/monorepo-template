import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { DatePicker } from "@repo/ui/date-picker";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/select";
import { Textarea } from "@repo/ui/textarea";
import { cn } from "@repo/ui/utils";
import { useTranslation } from "react-i18next";
import { RecurrencePanel } from "./recurrence-panel";
import { useTaskFormHook } from "./task-form.hook";
import type { TTaskFormSchema } from "./task-form.schema";

export interface TaskFormProps {
	onCancel?: () => void;
	onDelete?: () => void;
	onDuplicate?: () => void;
	onSubmit?: (data: TTaskFormSchema) => Promise<void>;
	initialValues?: Partial<TTaskFormSchema>;
	mode: "create" | "edit";
	metadata?: {
		createdAt?: string;
		updatedAt?: string;
	};
}

const sidebarLabelClass =
	"text-[10px] font-semibold uppercase tracking-wide text-muted-foreground";

/**
 * Checks if a date is in the past (before today).
 * Used to disable past dates in the date picker.
 */
function isDateInPast(date: Date): boolean {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return date < today;
}

export function TaskForm(props: TaskFormProps) {
	const { onCancel, mode, metadata } = props;
	const { t } = useTranslation();

	const {
		methods,
		projects,
		goals,
		sections,
		isFetchingSections,
		isProjectSelected,
		handleProjectChange,
		handleSubmit,
	} = useTaskFormHook(props);

	return (
		<Form {...methods}>
			<form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
				<div className="flex flex-1 overflow-hidden min-h-0">
					{/* LEFT COLUMN */}
					<div className="flex-1 border-r border-border overflow-y-auto max-h-[82vh]">
						{/* Title area */}
						<div className="px-5 pt-5 pb-3 border-b border-border">
							<div className="flex items-center gap-2">
								<FormField
									control={methods.control}
									name="completed"
									render={({ field }) => (
										<FormItem className="mb-0 shrink-0">
											<FormControl>
												<Checkbox
													checked={field.value ?? false}
													onCheckedChange={field.onChange}
													disabled={mode === "create"}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={methods.control}
									name="title"
									render={({ field }) => (
										<FormItem className="w-full min-w-0 mb-0">
											<FormControl>
												<Input
													placeholder={t("tasks.form.titlePlaceholder")}
													type="text"
													required
													className="text-lg font-medium w-full border-0 shadow-none focus-visible:ring-0 px-0"
													autoFocus
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Description */}
						<div className="px-5 py-3 border-b border-border">
							{/* biome-ignore lint/a11y/noLabelWithoutControl: visual caption; Textarea is in FormField below */}
							<label className={sidebarLabelClass}>
								{t("tasks.form.description")}
							</label>
							<FormField
								control={methods.control}
								name="description"
								render={({ field }) => (
									<FormItem className="mt-1.5">
										<FormControl>
											<Textarea
												placeholder={t("tasks.form.descriptionPlaceholder")}
												rows={3}
												className="min-h-[60px] border-0 shadow-none focus-visible:ring-0 resize-none bg-transparent px-0"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Recurrence */}
						<div className="px-5 py-3 border-b border-border">
							<RecurrencePanel control={methods.control} />
						</div>

						{/* Comments placeholder */}
						<div className="px-5 py-4 flex-1">
							{/* biome-ignore lint/a11y/noLabelWithoutControl: visual caption; disabled Textarea below */}
							<label className={sidebarLabelClass}>
								{t("tasks.form.comments")}
							</label>
							<Textarea
								disabled
								placeholder={t("tasks.form.commentsSoon")}
								className="mt-1.5 min-h-[60px] bg-muted/30"
							/>
						</div>
					</div>

					{/* RIGHT SIDEBAR */}
					<div className="w-48 p-4 space-y-4 overflow-y-auto max-h-[82vh] shrink-0">
						{/* Project */}
						<FormField
							control={methods.control}
							name="project"
							render={({ field }) => (
								<FormItem>
									{/* biome-ignore lint/a11y/noLabelWithoutControl: visual caption; Radix Select trigger is sibling */}
									<label className={sidebarLabelClass}>
										{t("tasks.form.project")}
									</label>
									<Select
										value={field.value}
										onValueChange={handleProjectChange}
									>
										<FormControl>
											<SelectTrigger variant="compact" className="mt-1">
												<SelectValue
													placeholder={t("tasks.form.selectProject")}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="inbox">
												<span className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
													{t("tasks.form.inbox")}
												</span>
											</SelectItem>
											{projects.map((project) => (
												<SelectItem key={project.id} value={project.id}>
													<span className="flex items-center gap-2">
														<span
															className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
															style={
																"color" in project && project.color
																	? { backgroundColor: project.color as string }
																	: undefined
															}
														/>
														{project.name}
													</span>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Section */}
						<FormField
							control={methods.control}
							name="section"
							render={({ field }) => (
								<FormItem>
									{/* biome-ignore lint/a11y/noLabelWithoutControl: visual caption; Radix Select trigger is sibling */}
									<label className={sidebarLabelClass}>
										{t("tasks.form.section")}
									</label>
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={!isProjectSelected || isFetchingSections}
									>
										<FormControl>
											<SelectTrigger
												variant="compact"
												className="mt-1"
												loading={isFetchingSections}
											>
												<SelectValue
													placeholder={
														!isProjectSelected
															? t("tasks.form.selectProjectFirst")
															: isFetchingSections
																? t("tasks.form.loading")
																: t("tasks.form.noSection")
													}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="none">
												{t("tasks.form.noSection")}
											</SelectItem>
											{sections.map((section) => (
												<SelectItem key={section.id} value={section.id}>
													{section.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Due date */}
						<FormField
							control={methods.control}
							name="dueDate"
							render={({ field }) => (
								<FormItem>
									{/* biome-ignore lint/a11y/noLabelWithoutControl: visual caption; DatePicker control is sibling */}
									<label className={sidebarLabelClass}>
										{t("tasks.form.dueDate")}
									</label>
									<FormControl>
										<DatePicker
											value={field.value}
											onChange={field.onChange}
											placeholder={t("tasks.form.noDueDate")}
											className="h-[30px] text-[11px] mt-1"
											disabledDates={isDateInPast}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Priority */}
						<FormField
							control={methods.control}
							name="priority"
							render={({ field }) => (
								<FormItem>
									{/* biome-ignore lint/a11y/noLabelWithoutControl: visual caption; Radix Select trigger is sibling */}
									<label className={sidebarLabelClass}>
										{t("tasks.form.priority")}
									</label>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger variant="compact" className="mt-1">
												<SelectValue placeholder={t("tasks.form.priority")} />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="none">
												{t("tasks.form.noPriority")}
											</SelectItem>
											<SelectItem value="low">
												<span className={cn("text-blue-500")}>
													{t("tasks.form.low")}
												</span>
											</SelectItem>
											<SelectItem value="medium">
												<span className={cn("text-amber-500")}>
													{t("tasks.form.medium")}
												</span>
											</SelectItem>
											<SelectItem value="high">
												<span className={cn("text-red-500")}>
													{t("tasks.form.high")}
												</span>
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Goal */}
						<FormField
							control={methods.control}
							name="goal"
							render={({ field }) => (
								<FormItem>
									{/* biome-ignore lint/a11y/noLabelWithoutControl: visual caption; Radix Select trigger is sibling */}
									<label className={sidebarLabelClass}>
										{t("tasks.form.goal")}
									</label>
									<Select
										value={field.value ?? "none"}
										onValueChange={(v) =>
											field.onChange(v === "none" ? undefined : v)
										}
									>
										<FormControl>
											<SelectTrigger variant="compact" className="mt-1">
												<SelectValue placeholder={t("tasks.form.noGoal")} />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="none">
												<span className="text-muted-foreground">
													{t("tasks.form.noGoal")}
												</span>
											</SelectItem>
											{goals.map((goal) => (
												<SelectItem key={goal.id} value={goal.id}>
													<span className="flex items-center gap-1.5">
														<span>{goal.emoji}</span>
														{goal.name}
													</span>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Metadata (edit mode only) */}
						{mode === "edit" &&
							(metadata?.createdAt || metadata?.updatedAt) && (
								<div className="pt-4 border-t border-border space-y-0.5">
									{metadata.createdAt && (
										<p className="text-[11px] text-muted-foreground">
											{t("tasks.form.created")}{" "}
											{new Date(metadata.createdAt).toLocaleDateString(
												"en-US",
												{
													month: "short",
													day: "numeric",
													year: "numeric",
												},
											)}
										</p>
									)}
									{metadata.updatedAt && (
										<p className="text-[11px] text-muted-foreground">
											{t("tasks.form.updated")}{" "}
											{new Date(metadata.updatedAt).toLocaleDateString(
												"en-US",
												{
													month: "short",
													day: "numeric",
													year: "numeric",
												},
											)}
										</p>
									)}
								</div>
							)}
					</div>
				</div>

				{/* FOOTER */}
				<div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0">
					<span className="text-xs text-muted-foreground">
						{mode === "edit"
							? t("tasks.form.editingTask")
							: t("tasks.form.newTask")}
					</span>
					<div className="flex gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onCancel}
						>
							{t("tasks.form.discard")}
						</Button>
						<Button type="submit" size="sm">
							{mode === "edit"
								? t("tasks.form.saveChanges")
								: t("tasks.form.createTask")}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
