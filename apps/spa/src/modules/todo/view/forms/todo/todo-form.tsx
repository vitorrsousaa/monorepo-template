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
import { useTodoFormHook } from "./todo-form.hook";
import type { TTodoFormSchema } from "./todo-form.schema";
import { RecurrencePanel } from "./recurrence-panel";

export interface TodoFormProps {
	onCancel?: () => void;
	onDelete?: () => void;
	onDuplicate?: () => void;
	initialValues?: Partial<TTodoFormSchema>;
	mode: "create" | "edit";
	metadata?: {
		createdAt?: string;
		updatedAt?: string;
	};
}

const sidebarLabelClass =
	"text-[10px] font-semibold uppercase tracking-wide text-muted-foreground";

export function TodoForm(props: TodoFormProps) {
	const { onCancel, mode, metadata } = props;

	const {
		methods,
		projects,
		goals,
		sections,
		isFetchingSections,
		isProjectSelected,
		handleProjectChange,
		handleSubmit,
	} = useTodoFormHook(props);

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
													placeholder="Task title"
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
							<label className={sidebarLabelClass}>Description</label>
							<FormField
								control={methods.control}
								name="description"
								render={({ field }) => (
									<FormItem className="mt-1.5">
										<FormControl>
											<Textarea
												placeholder="Add a description..."
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
							<label className={sidebarLabelClass}>Comments</label>
							<Textarea
								disabled
								placeholder="Comments coming soon..."
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
									<label className={sidebarLabelClass}>Project</label>
									<Select
										value={field.value}
										onValueChange={handleProjectChange}
									>
										<FormControl>
											<SelectTrigger variant="compact" className="mt-1">
												<SelectValue placeholder="Select project" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="inbox">
												<span className="flex items-center gap-2">
													<span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
													Inbox
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
									<label className={sidebarLabelClass}>Section</label>
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
															? "Select project first"
															: isFetchingSections
																? "Loading..."
																: "No section"
													}
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="none">No section</SelectItem>
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
									<label className={sidebarLabelClass}>Due date</label>
									<FormControl>
										<DatePicker
											value={field.value}
											onChange={field.onChange}
											placeholder="No due date"
											className="h-[30px] text-[11px] mt-1"
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
									<label className={sidebarLabelClass}>Priority</label>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger variant="compact" className="mt-1">
												<SelectValue placeholder="Priority" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="none">No priority</SelectItem>
											<SelectItem value="low">
												<span className={cn("text-blue-500")}>Low</span>
											</SelectItem>
											<SelectItem value="medium">
												<span className={cn("text-amber-500")}>Medium</span>
											</SelectItem>
											<SelectItem value="high">
												<span className={cn("text-red-500")}>High</span>
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
									<label className={sidebarLabelClass}>Goal</label>
									<Select
										value={field.value ?? "none"}
										onValueChange={(v) =>
											field.onChange(v === "none" ? undefined : v)
										}
									>
										<FormControl>
											<SelectTrigger variant="compact" className="mt-1">
												<SelectValue placeholder="No goal" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="none">
												<span className="text-muted-foreground">No goal</span>
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
											Created{" "}
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
											Updated{" "}
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
						{mode === "edit" ? "Editing task" : "New task"}
					</span>
					<div className="flex gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onCancel}
						>
							Discard
						</Button>
						<Button type="submit" size="sm">
							{mode === "edit" ? "Save changes" : "Create task"}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
