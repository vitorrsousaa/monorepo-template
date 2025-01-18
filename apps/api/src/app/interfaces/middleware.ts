import type { IRequest } from "./http";

export interface IMiddleware {
	handle(request: IRequest): Promise<Record<string, string>>;
}
