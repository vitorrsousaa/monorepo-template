import { Button } from "@repo/ui/button";
import { DatePicker } from "@repo/ui/date-picker";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@repo/ui/form";
import { Icon } from "@repo/ui/icon";
import { Input } from "@repo/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/select";
import { Textarea } from "@repo/ui/textarea";
import { useTodoFormHook } from "./todo-form.hook";

export interface TodoFormProps {
	onCancel?: () => void;
}

export function TodoForm(props: TodoFormProps) {
	const { onCancel } = props;

	const {
		methods,
		projects,
		sections,
		isFetchingSections,
		isProjectSelected,
		handleSubmit,
	} = useTodoFormHook();

	return (
		<Form {...methods}>
			<form onSubmit={handleSubmit}>
				<div className="flex">
					<div className="flex-[2] p-6 space-y-4">
						<div className="flex items-start gap-3">
							<div className="flex-1 space-y-2">
								<FormField
									control={methods.control}
									name="title"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormControl>
												<Input
													placeholder="Todo Title"
													type="text"
													required
													className="text-lg font-medium w-full"
													autoFocus
													// disabled={isSubmitting}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={methods.control}
									name="description"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormControl>
												<Textarea
													placeholder="Add a description for this task..."
													rows={3}
													className="bg-background resize-none min-h-[60px] h-24 resize-none"
													// disabled={isSubmitting}
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<div className="flex justify-end gap-2 pt-4">
							<Button type="button" variant="outline" onClick={onCancel}>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-primary text-primary-foreground hover:bg-primary/90"
							>
								Create Task
							</Button>
						</div>
					</div>

					{/* Right Side - Metadata */}
					<div className="w-64 border-l border-border p-6 space-y-4">
						<div className="space-y-3">
							<FormField
								control={methods.control}
								name="project"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Project</span>
										</div>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger className="h-8">
													<SelectValue placeholder="Select project" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="inbox">
													<div className="flex items-center gap-2">
														<Icon name="inbox" className="w-3 h-3" />
														<span>Inbox</span>
													</div>
												</SelectItem>
												{projects.map((project) => (
													<SelectItem key={project.id} value={project.id}>
														<div className="flex items-center gap-2">
															<Icon name="folder" className="w-3 h-3" />
															<span>{project.name}</span>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="space-y-3">
							<FormField
								control={methods.control}
								name="section"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Section</span>
										</div>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											disabled={!isProjectSelected || isFetchingSections}
										>
											<FormControl>
												<SelectTrigger className="h-8">
													<SelectValue
														placeholder={
															!isProjectSelected
																? "Select a project first"
																: isFetchingSections
																	? "Loading sections..."
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
						</div>

						<div className="space-y-3">
							<FormField
								control={methods.control}
								name="dueDate"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Date</span>
										</div>
										<FormControl>
											<DatePicker
												value={field.value}
												onChange={field.onChange}
												placeholder="No due date"
												className="h-8"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="space-y-3">
							<FormField
								control={methods.control}
								name="priority"
								render={({ field }) => (
									<FormItem>
										<div className="flex items-center justify-between text-sm">
											<span className="text-muted-foreground">Priority</span>
										</div>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger className="h-8">
													<SelectValue placeholder="Select priority" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="none">
													<div className="flex items-center gap-2">
														<Icon name="flag" className="w-3 h-3" />
														<span>No priority</span>
													</div>
												</SelectItem>
												<SelectItem value="low">
													<div className="flex items-center gap-2">
														<Icon name="flag" className="w-3 h-3" />
														<span>P4 - Low</span>
													</div>
												</SelectItem>
												<SelectItem value="medium">
													<div className="flex items-center gap-2">
														<Icon name="flag" className="w-3 h-3" />
														<span>P3 - Medium</span>
													</div>
												</SelectItem>
												<SelectItem value="high">
													<div className="flex items-center gap-2">
														<Icon name="flag" className="w-3 h-3" />
														<span>P2 - High</span>
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Labels</span>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="h-6 w-6"
								>
									<Icon name="tag" className="w-3 h-3" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
