import { GetDashboardAnalyticsInputDTO } from "@application/modules/tasks/services/get-dashboard-analytics/dto";
import type z from "zod";

export const getDashboardAnalyticsSchema = GetDashboardAnalyticsInputDTO;
export type GetDashboardAnalyticsSchema = z.infer<
	typeof getDashboardAnalyticsSchema
>;
