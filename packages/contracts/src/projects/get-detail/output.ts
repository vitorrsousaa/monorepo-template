import { SectionsWithTasks } from "../../sections/entities";
import { Project } from "../entities";

interface GetProjectDetailResponse {
  project: Project;
  sections: SectionsWithTasks[];
}

export type { GetProjectDetailResponse };
