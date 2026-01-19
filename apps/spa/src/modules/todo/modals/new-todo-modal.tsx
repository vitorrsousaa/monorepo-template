import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { Dialog, DialogContent } from "@repo/ui/dialog";
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
import type React from "react";
import { useState } from "react";

interface NewTodoModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: string | null;
}

export function NewTodoModal({
	isOpen,
	onClose,
	projectId,
}: NewTodoModalProps) {
	const [todoData, setTodoData] = useState({
		title: "",
		description: "",
		project: projectId || "inbox",
		section: "",
		priority: "medium",
		dueDate: "",
		completed: false,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("[v0] Creating todo:", todoData);
		onClose();
		setTodoData({
			title: "",
			description: "",
			project: projectId || "inbox",
			section: "",
			priority: "medium",
			dueDate: "",
			completed: false,
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-5xl p-0 gap-0">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-border">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Icon name="inbox" className="w-4 h-4" />
						<span>New Task</span>
					</div>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="flex">
						{/* Left Side - Main Content */}
						<div className="flex-[2] p-6 space-y-4">
							<div className="flex items-start gap-3">
								<Checkbox
									checked={todoData.completed}
									onCheckedChange={(checked) =>
										setTodoData({ ...todoData, completed: !!checked })
									}
									className="mt-1"
								/>
								<div className="flex-1 space-y-2">
									<Input
										value={todoData.title}
										onChange={(e) =>
											setTodoData({ ...todoData, title: e.target.value })
										}
										className="text-lg font-medium"
										placeholder="Task name"
										required
										autoFocus
									/>
									<Textarea
										value={todoData.description}
										onChange={(e) =>
											setTodoData({ ...todoData, description: e.target.value })
										}
										className="min-h-[60px] h-24 resize-none"
										placeholder="Description"
									/>
								</div>
							</div>

							<div className="flex justify-end gap-2 pt-4">
								<Button type="button" variant="outline" onClick={onClose}>
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
										<SelectItem value="1">Python Study Plan</SelectItem>
										<SelectItem value="2">
											Study Plan - Automated Tests
										</SelectItem>
										<SelectItem value="3">Web Development Mastery</SelectItem>
										<SelectItem value="4">
											Database Design Fundamentals
										</SelectItem>
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

							<div className="space-y-3">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Reminders</span>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-6 w-6"
									>
										<Icon name="bell" className="w-3 h-3" />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
