import { ROUTES } from "@/config/routes";
import { ProjectsLayout } from "@/layouts/app/projects-layout";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const Projects = lazy(() =>
	import("@/pages/app/projects/project").then((module) => ({
		default: module.Projects,
	})),
);

const AllProjects = lazy(() =>
	import("@/pages/app/projects/all-projects/all-projects").then((module) => ({
		default: module.AllProjects,
	})),
);

export const projectsRoutes: RouteObject = {
	path: "/",
	element: <ProjectsLayout />,
	children: [
		{
			path: ROUTES.PROJECTS.LIST,
			element: <AllProjects />,
		},
		{
			path: ROUTES.PROJECTS.PROJECT_DETAILS,
			element: <Projects />,
		},
	],
};
