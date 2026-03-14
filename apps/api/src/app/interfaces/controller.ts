import { missingFields } from "@application/utils/missing-fields";
import z from "zod";
import type { IRequest, IResponse } from "./http";

export abstract class Controller {
	
	protected schema?: z.ZodSchema<Record<string, unknown>>;
	protected abstract handle(request: IRequest): Promise<IResponse>;
	
	public execute(request: IRequest): Promise<IResponse> {
		const parsedBody = this.validateBody(request?.body || {});
		
		return this.handle({...request, body: parsedBody});
	}
	
	private validateBody(body: IRequest["body"]): IRequest["body"] {
		if(!this.schema) return body;
		
		
		const parsedBody = missingFields(this.schema, body);

		return parsedBody;
	}
}