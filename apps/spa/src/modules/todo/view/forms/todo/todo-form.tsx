import { Button } from "@repo/ui/button";
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
import { useState } from "react";
import { useTodoFormHook } from "./todo-form.hook";

export interface TodoFormProps {
	onCancel?: () => void;
}

export function TodoForm(props: TodoFormProps) {
	const { onCancel } = props;

	const { methods, projects, handleSubmit } = useTodoFormHook();

	const [todoData, setTodoData] = useState({
		title: "",
		description: "",
		project: "inbox",
		section: "",
		priority: "medium",
		dueDate: "",
		completed: false,
	});

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
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Project</span>
							</div>
							<Select
								value={todoData.project}
								onValueChange={(value) =>
									setTodoData({ ...todoData, project: value })
								}
							>
								<SelectTrigger className="h-8">
									<SelectValue />
								</SelectTrigger>
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
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Section</span>
							</div>
							<Select
								value={todoData.section}
								onValueChange={(value) =>
									setTodoData({ ...todoData, section: value })
								}
							>
								<SelectTrigger className="h-8">
									<SelectValue placeholder="No section" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">No section</SelectItem>
									<SelectItem value="backlog">Backlog</SelectItem>
									<SelectItem value="in-progress">In Progress</SelectItem>
									<SelectItem value="review">Review</SelectItem>
									<SelectItem value="done">Done</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Date</span>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="h-6 w-6"
								>
									<Icon name="calendar" className="w-3 h-3" />
								</Button>
							</div>
							<Input
								type="date"
								value={todoData.dueDate}
								onChange={(e) =>
									setTodoData({ ...todoData, dueDate: e.target.value })
								}
								className="h-8"
							/>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Priority</span>
							</div>
							<Select
								value={todoData.priority}
								onValueChange={(value) =>
									setTodoData({ ...todoData, priority: value })
								}
							>
								<SelectTrigger className="h-8">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
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
