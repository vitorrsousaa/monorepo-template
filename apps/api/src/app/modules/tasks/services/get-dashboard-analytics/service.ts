import type { IService } from "@application/interfaces/service";
import type {
	GetDashboardAnalyticsInput,
	GetDashboardAnalyticsOutput,
} from "./dto";

export interface IGetDashboardAnalyticsService
	extends IService<GetDashboardAnalyticsInput, GetDashboardAnalyticsOutput> {}

export class GetDashboardAnalyticsService
	implements IGetDashboardAnalyticsService
{
	async execute(
		_input: GetDashboardAnalyticsInput,
	): Promise<GetDashboardAnalyticsOutput> {
		// Implement calcs to get efficiency
		// tasksConcluídasHoje / tasksConcluídasHoje + tasksPendentesHoje
		const efficiency = 40;

		const output: GetDashboardAnalyticsOutput = {
			efficiency,
		};

		return output;
	}
}
