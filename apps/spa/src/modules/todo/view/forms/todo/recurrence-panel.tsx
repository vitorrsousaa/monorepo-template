import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
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
import { ChevronDown } from "lucide-react";
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

interface RecurrencePanelProps {
	control: Control<TTodoFormSchema>;
}

export function RecurrencePanel({ control }: RecurrencePanelProps) {
	return (
		<div className="space-y-2">
			<FormField
				control={control}
				name="recurrence.enabled"
				render={({ field: enabledField }) => (
					<FormItem>
						<Collapsible
							open={enabledField.value}
							onOpenChange={enabledField.onChange}
						>
							<div className="flex items-center justify-between">
								<CollapsibleTrigger asChild>
									<button
										type="button"
										className="flex items-center gap-2 text-sm font-medium hover:opacity-80"
									>
										<span>Repeat</span>
										<ChevronDown
											className={cn(
												"h-4 w-4 transition-transform",
												enabledField.value && "rotate-180",
											)}
										/>
									</button>
								</CollapsibleTrigger>
								<FormControl>
									<Switch
										checked={enabledField.value}
										onCheckedChange={enabledField.onChange}
									/>
								</FormControl>
							</div>

						<CollapsibleContent>
							<div className="mt-4 space-y-4 pt-2">
								{/* Frequency */}
								<FormField
									control={control}
									name="recurrence.frequency"
									render={({ field: freqField }) => (
										<FormItem>
											<Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
												Frequency
											</Label>
											<div className="flex flex-wrap gap-1.5 pt-1">
												{FREQUENCIES.map((f) => (
													<button
														key={f.value}
														type="button"
														onClick={() => freqField.onChange(f.value)}
														className={cn(
															"rounded-md border px-2.5 py-1 text-xs transition-colors",
															freqField.value === f.value
																? "border-primary bg-primary/10 text-primary"
																: "border-border bg-muted/30 hover:bg-muted/50",
														)}
													>
														{f.label}
													</button>
												))}
											</div>
										</FormItem>
									)}
								/>

								{/* Weekly days - only when frequency is weekly */}
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
														<Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
															On days
														</Label>
														<div className="flex flex-wrap gap-1.5 pt-1">
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
																			"h-7 w-7 rounded-md border text-xs font-medium transition-colors",
																			checked
																				? "border-primary bg-primary/10 text-primary"
																				: "border-border bg-muted/30 hover:bg-muted/50",
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

								{/* Ends */}
								<FormField
									control={control}
									name="recurrence.endType"
									render={({ field: endTypeField }) => (
										<FormItem>
											<Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
												Ends
											</Label>
											<FormControl>
												<RadioGroup
													value={endTypeField.value ?? "never"}
													onValueChange={(v) =>
														endTypeField.onChange(v as "never" | "on_date" | "after_count")
													}
													className="flex flex-col gap-2 pt-1"
												>
													<div className="flex items-center gap-2">
														<RadioGroupItem value="never" id="end-never" />
														<Label htmlFor="end-never" className="font-normal text-sm">
															Never
														</Label>
													</div>
													<div className="flex items-center gap-2">
														<RadioGroupItem value="on_date" id="end-on-date" />
														<Label htmlFor="end-on-date" className="font-normal text-sm">
															On date
														</Label>
													</div>
													{endTypeField.value === "on_date" && (
														<FormField
															control={control}
															name="recurrence.endDate"
															render={({ field: dateField }) => (
																<FormItem className="ml-6">
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
													<div className="flex items-center gap-2">
														<RadioGroupItem value="after_count" id="end-after" />
														<Label htmlFor="end-after" className="font-normal text-sm">
															After
														</Label>
													</div>
													{endTypeField.value === "after_count" && (
														<FormField
															control={control}
															name="recurrence.endCount"
															render={({ field: countField }) => (
																<FormItem className="ml-6">
																	<FormControl>
																		<Input
																			type="number"
																			min={1}
																			placeholder="Times"
																			className="h-8 w-24"
																			value={countField.value ?? ""}
																			onChange={(e) => {
																				const v = e.target.value;
																				countField.onChange(v === "" ? undefined : Number.parseInt(v, 10));
																			}}
																		/>
																	</FormControl>
																</FormItem>
															)}
														/>
													)}
												</RadioGroup>
											</FormControl>
										</FormItem>
									)}
								/>

								{/* Preview pill */}
								<FormField
									control={control}
									name="recurrence"
									render={({ field }) => {
										const preview = formatRecurrencePreview(field.value);
										if (!preview) return null;
										return (
											<div className="rounded-md bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground">
												{preview}
											</div>
										);
									}}
								/>
							</div>
						</CollapsibleContent>
						</Collapsible>
					</FormItem>
				)}
			/>
		</div>
	);
}
