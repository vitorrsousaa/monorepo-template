import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { useProjectFormHook } from "./project-form.hook";
import type { TProjectFormSchema } from "./project-form.schema";

export interface ProjectFormProps {
	formId?: string;
	isSubmitting?: boolean;
	onSubmit: (data: TProjectFormSchema) => Promise<void>;
}

export function ProjectForm(props: ProjectFormProps) {
	const { formId, isSubmitting } = props;

	const { handleSubmit, methods } = useProjectFormHook(props);

	return (
		<Form {...methods}>
			<form
				onSubmit={handleSubmit}
				id={formId || "project-form"}
				className="space-y-6 mt-4"
			>
				{/* Project Name */}
				<FormField
					control={methods.control}
					name="name"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Project Name</FormLabel>
							<FormControl>
								<Input
									placeholder="e.g., Work, Personal, Health..."
									type="text"
									required
									disabled={isSubmitting}
									{...field}
									className="w-full"
								/>
							</FormControl>
							<FormDescription>Add a name for your project.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={methods.control}
					name="description"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Add a description for this project..."
									rows={3}
									className="bg-background resize-none"
									disabled={isSubmitting}
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Add a description for your project.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
