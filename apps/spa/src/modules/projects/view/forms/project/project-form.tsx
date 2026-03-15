import {
	Form,
	FormControl,
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
				className="mt-1 space-y-5"
			>
				<FormField
					control={methods.control}
					name="name"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel className="text-xs font-semibold text-muted-foreground">
								Project Name
							</FormLabel>
							<FormControl>
								<Input
									placeholder="e.g., Work, Personal, Health..."
									type="text"
									required
									disabled={isSubmitting}
									{...field}
									className="mt-1 h-9 w-full rounded-[10px] border border-border bg-muted/60 px-3 text-[13px] shadow-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0"
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
							<div className="flex items-baseline gap-1">
								<FormLabel className="text-xs font-semibold text-muted-foreground">
									Description
								</FormLabel>
								<span className="text-[11px] font-normal text-muted-foreground/60">
									(optional)
								</span>
							</div>
							<FormControl>
								<Textarea
									placeholder="Add a description for this project..."
									rows={3}
									className="mt-1 h-24 resize-none rounded-[10px] border border-border bg-muted/60 px-3 py-2 text-[13px] leading-relaxed shadow-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0"
									disabled={isSubmitting}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
