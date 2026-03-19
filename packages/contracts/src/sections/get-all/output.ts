import type { Section } from "../entities";

export interface GetAllSectionsResponse {
	sections: Section[];
	total: number;
}
