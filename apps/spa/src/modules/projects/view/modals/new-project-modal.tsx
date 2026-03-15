import { useState } from "react";

import { Button } from "@repo/ui/button";
import { Dialog, DialogContent } from "@repo/ui/dialog";
import { useCreateProject } from "../../app/hooks/use-create-project";
import { ProjectForm } from "../forms/project";
import type { TProjectFormSchema } from "../forms/project/project-form.schema";

interface NewProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
	const { createProject } = useCreateProject();

	const [accentColor, setAccentColor] = useState("#7F77DD");
	const [solidColor, setSolidColor] = useState("#534AB7");
	const [colorLabel, setColorLabel] = useState("Professional");

	const colorOptions = [
		{
			id: "work",
			mid: "#7F77DD",
			solid: "#534AB7",
			label: "Professional",
		},
		{
			id: "home",
			mid: "#1D9E75",
			solid: "#0F6E56",
			label: "Home / Personal",
		},
		{
			id: "study",
			mid: "#378ADD",
			solid: "#185FA5",
			label: "Studies",
		},
		{
			id: "health",
			mid: "#F0952A",
			solid: "#A05C00",
			label: "Health / Habits",
		},
		{
			id: "personal",
			mid: "#A86CC8",
			solid: "#7A3FA0",
			label: "Personal",
		},
		{
			id: "pink",
			mid: "#D4537E",
			solid: "#993556",
			label: "Creative",
		},
		{
			id: "teal",
			mid: "#1B9E99",
			solid: "#0D6E6A",
			label: "Technical",
		},
		{
			id: "red",
			mid: "#D94848",
			solid: "#A02020",
			label: "Urgent",
		},
		{
			id: "gray",
			mid: "#888780",
			solid: "#5F5E5A",
			label: "General",
		},
	] as const;

	const handleSubmit = async (data: TProjectFormSchema) => {
		createProject({
			name: data.name,
			description: data.description,
		});
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px] overflow-hidden border-border bg-card p-0">
				<div className="h-1 w-full" style={{ backgroundColor: accentColor }} />

				<div className="space-y-6 px-7 pb-6 pt-5">
					<div className="flex items-start justify-between gap-4">
						<div>
							<h2 className="text-[17px] font-semibold tracking-tight text-foreground">
								Create New Project
							</h2>
							<p className="mt-1 text-xs text-muted-foreground">
								Add a new project to organize your tasks
							</p>
						</div>
					</div>

					<ProjectForm onSubmit={handleSubmit} formId="new-project-form" />

					<div className="space-y-3">
						<div className="text-xs font-semibold text-muted-foreground">
							Project Color
						</div>

						<div className="flex flex-wrap gap-2.5">
							{colorOptions.map((option) => {
								const isActive = option.label === colorLabel;

								return (
									<button
										type="button"
										key={option.id}
										onClick={() => {
											setAccentColor(option.mid);
											setSolidColor(option.solid);
											setColorLabel(option.label);
										}}
										className="relative flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
										style={{ backgroundColor: option.mid }}
										aria-label={option.label}
									>
										<span
											className="absolute inset-[-3px] rounded-full border-2 border-transparent transition-colors"
											style={
												isActive ? { borderColor: option.solid } : undefined
											}
										/>
										{isActive && (
											<span className="relative inline-block h-2 w-2 rounded-full bg-white" />
										)}
									</button>
								);
							})}
						</div>

						<div className="flex items-center gap-2 pt-1">
							<span
								className="h-2 w-2 rounded-full"
								style={{ backgroundColor: accentColor }}
							/>
							<p className="text-[11px] text-muted-foreground">
								Selected color:{" "}
								<span className="font-medium text-foreground">
									{colorLabel}
								</span>
							</p>
						</div>
					</div>

					<div className="mt-4 flex justify-end gap-2 border-t border-border/60 pt-4">
						<Button
							type="button"
							variant="outline"
							className="h-9 rounded-lg px-4 text-xs font-medium"
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="h-9 rounded-lg px-5 text-xs font-medium text-white hover:opacity-90"
							style={{ backgroundColor: solidColor }}
							form="new-project-form"
						>
							Create Project
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
