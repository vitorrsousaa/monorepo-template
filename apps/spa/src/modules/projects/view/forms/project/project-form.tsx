import { PROJECT_COLORS } from "@repo/contracts/projects/create";
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
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useProjectFormHook } from "./project-form.hook";
import type { TProjectFormSchema } from "./project-form.schema";

const COLOR_SOLID: Record<string, string> = {
	"#7F77DD": "#534AB7",
	"#1D9E75": "#0F6E56",
	"#378ADD": "#185FA5",
	"#F0952A": "#A05C00",
	"#A86CC8": "#7A3FA0",
	"#D4537E": "#993556",
	"#1B9E99": "#0D6E6A",
	"#D94848": "#A02020",
	"#888780": "#5F5E5A",
};

export interface ProjectFormProps {
	formId?: string;
	isSubmitting?: boolean;
	onSubmit: (data: TProjectFormSchema) => Promise<void>;
	onColorChange?: (color: string) => void;
}

export function ProjectForm(props: ProjectFormProps) {
	const { formId, isSubmitting, onColorChange } = props;
	const { t } = useTranslation();

	const { handleSubmit, methods } = useProjectFormHook(props);

	const watchedColor = methods.watch("color");

	useEffect(() => {
		onColorChange?.(watchedColor);
	}, [watchedColor, onColorChange]);

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
								{t("projects.form.nameLabel")}
							</FormLabel>
							<FormControl>
								<Input
									placeholder={t("projects.form.namePlaceholder")}
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
									{t("projects.form.descriptionLabel")}
								</FormLabel>
								<span className="text-[11px] font-normal text-muted-foreground/60">
									{t("projects.form.descriptionOptional")}
								</span>
							</div>
							<FormControl>
								<Textarea
									placeholder={t("projects.form.descriptionPlaceholder")}
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

				<FormField
					control={methods.control}
					name="color"
					render={({ field }) => {
						const solid = COLOR_SOLID[field.value];
						return (
							<FormItem className="w-full">
								<FormLabel className="text-xs font-semibold text-muted-foreground">
									{t("projects.form.colorLabel")}
								</FormLabel>

								<FormControl>
									<div className="space-y-3">
										<div className="flex flex-wrap gap-2.5">
											{PROJECT_COLORS.map((hex) => {
												const isActive = field.value === hex;
												const colorSolid = COLOR_SOLID[hex];
												return (
													<button
														type="button"
														key={hex}
														onClick={() => field.onChange(hex)}
														className="relative flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
														style={{ backgroundColor: hex }}
														aria-label={t("projects.form.colors." + hex)}
													>
														<span
															className="absolute inset-[-3px] rounded-full border-2 border-transparent transition-colors"
															style={
																isActive
																	? { borderColor: colorSolid }
																	: undefined
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
												style={{ backgroundColor: field.value }}
											/>
											<p className="text-[11px] text-muted-foreground">
												{t("projects.form.selectedColor")}{" "}
												<span className="font-medium text-foreground">
													{t("projects.form.colors." + field.value)}
												</span>
											</p>
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
			</form>
		</Form>
	);
}
