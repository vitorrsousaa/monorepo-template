import type { DashboardAnalytics } from "@core/domain/task/dashboard/dashboard-analytics";
import { z } from "zod";

export const GetDashboardAnalyticsInputDTO = z.object({
  userId: z.string().uuid(),
});

export type GetDashboardAnalyticsInput = z.infer<typeof GetDashboardAnalyticsInputDTO>;

export type GetDashboardAnalyticsOutput = DashboardAnalytics
