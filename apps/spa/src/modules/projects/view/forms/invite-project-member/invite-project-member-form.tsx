import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
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
import { cn } from "@repo/ui/utils";
import { useInviteProjectMemberFormHook } from "./invite-project-member-form.hook";
import type { InviteProjectMemberFormValues } from "./invite-project-member-form.schema";

export interface InviteProjectMemberFormProps {
	formId?: string;
	isSubmitting?: boolean;
	onSubmit: (data: InviteProjectMemberFormValues) => Promise<void>;
}

const inputClassName =
	"mt-1 h-9 w-full rounded-[10px] border border-border bg-muted/60 px-3 text-[13px] shadow-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0";

const selectTriggerClassName = cn(
	inputClassName,
	"flex items-center justify-between text-left focus:ring-0 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
);

const ROLE_LABEL: Record<InviteProjectMemberFormValues["role"], string> = {
	editor: "Can edit — add and edit tasks, reorder boards",
	viewer: "Can view — read-only access",
};

export function InviteProjectMemberForm(props: InviteProjectMemberFormProps) {
	const { formId, isSubmitting } = props;
	const { handleSubmit, methods } = useInviteProjectMemberFormHook(props);

	return (
		<Form {...methods}>
			<form
				onSubmit={handleSubmit}
				id={formId ?? "invite-project-member-form"}
				className="mt-1 space-y-5"
			>
				<FormField
					control={methods.control}
					name="email"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel className="text-xs font-semibold text-muted-foreground">
								Email address
							</FormLabel>
							<FormControl>
								<Input
									type="email"
									autoComplete="email"
									placeholder="colleague@email.com"
									disabled={isSubmitting}
									{...field}
									className={inputClassName}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={methods.control}
					name="role"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel className="text-xs font-semibold text-muted-foreground">
								Permission
							</FormLabel>
							<Select
								value={field.value}
								onValueChange={field.onChange}
								disabled={isSubmitting}
							>
								<FormControl>
									<SelectTrigger className={selectTriggerClassName}>
										<SelectValue placeholder="Select permission" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="editor">{ROLE_LABEL.editor}</SelectItem>
									<SelectItem value="viewer">{ROLE_LABEL.viewer}</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
