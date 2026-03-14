import {
	Collapsible,
	CollapsibleContent,
} from "@repo/ui/collapsible";
import {
	FormControl,
	FormField,
	FormItem,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import { Switch } from "@repo/ui/switch";
import { DatePicker } from "@repo/ui/date-picker";
import { Repeat } from "lucide-react";
import type { Control } from "react-hook-form";
import { cn } from "@repo/ui/utils";
import type { TTodoFormSchema } from "./todo-form.schema";
import { formatRecurrencePreview } from "./format-recurrence-preview";

const FREQUENCIES = [
	{ value: "daily", label: "Daily" },
	{ value: "weekly", label: "Weekly" },
	{ value: "monthly", label: "Monthly" },
	{ value: "yearly", label: "Yearly" },
] as const;

const DAYS = [
	{ value: 0, label: "Su" },
	{ value: 1, label: "Mo" },
	{ value: 2, label: "Tu" },
	{ value: 3, label: "We" },
	{ value: 4, label: "Th" },
	{ value: 5, label: "Fr" },
	{ value: 6, label: "Sa" },
] as const;

const sectionLabelClass =
	"text-[10px] font-semibold uppercase tracking-wide text-muted-foreground";

interface RecurrencePanelProps {
	control: Control<TTodoFormSchema>;
}

export function RecurrencePanel({ control }: RecurrencePanelProps) {
	return (
		<div className="space-y-3">
			<FormField
				control={control}
				name="recurrence.enabled"
				render={({ field: enabledField }) => (
					<FormItem>
						{/* Toggle row: label "Repeat" when off, "Repeating task" when on; whole row clickable except Switch */}
						<div
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									enabledField.onChange(!enabledField.value);
								}
							}}
							onClick={() => enabledField.onChange(!enabledField.value)}
							className={cn(
								"flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-2 px-2.5 transition-colors hover:bg-muted/50",
								enabledField.value
									? "border-primary/30 bg-primary/5"
									: "border-border bg-muted/30",
							)}
						>
							<div className="flex min-w-0 flex-1 items-start gap-3">
								<div
									className={cn(
										"flex h-6 w-6 shrink-0 items-center justify-center rounded border",
										enabledField.value
											? "border-primary/50 bg-primary/20 text-primary"
											: "border-border bg-muted text-muted-foreground",
									)}
								>
									<Repeat className="h-4 w-4" />
								</div>
								<div className="min-w-0 flex-1 space-y-0.5">
									<p
										className={cn(
											"text-sm font-semibold",
											enabledField.value ? "text-primary" : "text-foreground",
										)}
									>
										{enabledField.value ? "Repeating task" : "Repeat"}
									</p>
									<p className="text-xs text-muted-foreground">
										{enabledField.value ? (
											<FormField
												control={control}
												name="recurrence"
												render={({ field }) => (
													<>
														{formatRecurrencePreview(field.value) ||
															"Choose frequency and options below"}
													</>
												)}
											/>
										) : (
											"This task doesn't repeat"
										)}
									</p>
								</div>
							</div>
							<div onClick={(e) => e.stopPropagation()}>
								<FormControl>
									<Switch
										checked={enabledField.value}
										onCheckedChange={enabledField.onChange}
										className="shrink-0"
									/>
								</FormControl>
							</div>
						</div>

						<Collapsible
							open={enabledField.value}
							onOpenChange={enabledField.onChange}
						>
							<CollapsibleContent className="flex flex-col gap-3 pt-3 pb-1">
								{/* FREQUENCY — pill chips */}
								<FormField
									control={control}
									name="recurrence.frequency"
									render={({ field: freqField }) => (
										<FormItem>
											<Label className={sectionLabelClass}>Frequency</Label>
											<div className="flex flex-wrap gap-2 pt-1.5">
												{FREQUENCIES.map((f) => (
													<button
														key={f.value}
														type="button"
														onClick={() => freqField.onChange(f.value)}
														className={cn(
															"rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
															freqField.value === f.value
																? "border-primary bg-primary/15 text-primary"
																: "border-border bg-background hover:bg-muted/50",
														)}
													>
														{f.label}
													</button>
												))}
											</div>
										</FormItem>
									)}
								/>

								{/* ON DAYS — 30×30 circular buttons, only when weekly */}
								<FormField
									control={control}
									name="recurrence.frequency"
									render={({ field: freqField }) =>
										freqField.value === "weekly" ? (
											<FormField
												control={control}
												name="recurrence.weeklyDays"
												render={({ field: daysField }) => (
													<FormItem>
														<Label className={sectionLabelClass}>On days</Label>
														<div className="flex flex-wrap gap-2 pt-1.5">
															{DAYS.map((d) => {
																const arr = daysField.value ?? [];
																const checked = arr.includes(d.value);
																return (
																	<button
																		key={d.value}
																		type="button"
																		onClick={() => {
																			if (checked) {
																				daysField.onChange(arr.filter((x) => x !== d.value));
																			} else {
																				daysField.onChange([...arr, d.value].sort((a, b) => a - b));
																			}
																		}}
																		className={cn(
																			"flex h-[30px] w-[30px] items-center justify-center rounded-full border text-xs font-medium transition-colors",
																			checked
																				? "border-primary bg-primary/15 text-primary"
																				: "border-border bg-background hover:bg-muted/50",
																		)}
																	>
																		{d.label}
																	</button>
																);
															})}
														</div>
													</FormItem>
												)}
											/>
										) : null
									}
								/>

								{/* ENDS — inline options + "occurrences" for After */}
								<FormField
									control={control}
									name="recurrence.endType"
									render={({ field: endTypeField }) => (
										<FormItem>
											<Label className={sectionLabelClass}>Ends</Label>
											<FormControl>
												<RadioGroup
													value={endTypeField.value ?? "never"}
													onValueChange={(v) =>
														endTypeField.onChange(v as "never" | "on_date" | "after_count")
													}
													className="flex flex-wrap gap-4 pt-1.5"
												>
													<div className="flex items-center gap-2">
														<RadioGroupItem value="never" id="end-never" />
														<Label htmlFor="end-never" className="cursor-pointer font-normal text-sm">
															Never
														</Label>
													</div>
													<div className="flex items-center gap-2">
														<RadioGroupItem value="on_date" id="end-on-date" />
														<Label htmlFor="end-on-date" className="cursor-pointer font-normal text-sm">
															On date
														</Label>
													</div>
													<div className="flex items-center gap-2">
														<RadioGroupItem value="after_count" id="end-after" />
														<Label htmlFor="end-after" className="cursor-pointer font-normal text-sm">
															After
														</Label>
													</div>
												</RadioGroup>
											</FormControl>
											{endTypeField.value === "on_date" && (
												<FormField
													control={control}
													name="recurrence.endDate"
													render={({ field: dateField }) => (
														<FormItem className="mt-1.5">
															<DatePicker
																value={dateField.value}
																onChange={dateField.onChange}
																placeholder="Pick end date"
																className="h-8"
															/>
														</FormItem>
													)}
												/>
											)}
											{endTypeField.value === "after_count" && (
												<FormField
													control={control}
													name="recurrence.endCount"
													render={({ field: countField }) => (
														<FormItem className="mt-1.5">
															<div className="flex items-center gap-2">
																<FormControl>
																	<Input
																		type="number"
																		min={1}
																		placeholder="Times"
																		className="h-8 w-24"
																		value={countField.value ?? ""}
																		onChange={(e) => {
																			const v = e.target.value;
																			countField.onChange(
																				v === "" ? undefined : Number.parseInt(v, 10),
																			);
																		}}
																	/>
																</FormControl>
																<span className="text-xs text-muted-foreground">
																	occurrences
																</span>
															</div>
														</FormItem>
													)}
												/>
											)}
										</FormItem>
									)}
								/>

								{/* Preview pill with Repeat icon */}
								<FormField
									control={control}
									name="recurrence"
									render={({ field }) => {
										const preview = formatRecurrencePreview(field.value);
										if (!preview) return null;
										return (
											<div className="flex items-start gap-1.5 rounded-full bg-primary/5 py-1.5 px-2 text-xs text-primary">
												<Repeat className="mt-0.5 h-3.5 w-3.5 shrink-0" />
												<span>{preview}</span>
											</div>
										);
									}}
								/>
							</CollapsibleContent>
						</Collapsible>
					</FormItem>
				)}
			/>
		</div>
	);
}
