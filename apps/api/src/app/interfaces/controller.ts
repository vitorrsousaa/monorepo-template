import { missingFields } from "@application/utils/missing-fields";
import type z from "zod";

export type TControllerType = "public" | "private";

export abstract class Controller<TType extends TControllerType = "private", TBody = undefined> {
	protected schema?: z.ZodSchema<Record<string, unknown>>;
	protected abstract handle(request: Controller.Request<TType>): Promise<Controller.Response<TBody>>;

	public execute(request: Controller.Request<TType>): Promise<Controller.Response<TBody>> {
		const parsedBody = this.validateBody(request?.body || {});

		return this.handle({ ...request, body: parsedBody });
	}

	private validateBody(body: Controller.Request<TType>["body"]): Controller.Request<TType>["body"] {
		if (!this.schema) return body;

		const parsedBody = missingFields(this.schema, body);

		return parsedBody;
	}
}

export namespace Controller {
	type BaseRequest<
		TBody extends Record<string, unknown> = Record<string, unknown>,
		TParams extends Record<string, unknown> = Record<string, unknown>,
		TQueryParams extends Record<string, string | undefined> = Record<string, string | undefined>,
	> = {
		body: TBody;
		params: TParams;
		headers: Record<string, string | undefined>;
		queryParams: TQueryParams;
		userId: string | null;
	};

	type PublicRequest<
		TBody extends Record<string, unknown> = Record<string, unknown>,
		TParams extends Record<string, unknown> = Record<string, unknown>,
		TQueryParams extends Record<string, string | undefined> = Record<string, string | undefined>,
	> = BaseRequest<TBody, TParams, TQueryParams> & { userId: null };

	type PrivateRequest<
		TBody extends Record<string, unknown> = Record<string, unknown>,
		TParams extends Record<string, unknown> = Record<string, unknown>,
		TQueryParams extends Record<string, string | undefined> = Record<string, string | undefined>,
	> = BaseRequest<TBody, TParams, TQueryParams> & { userId: string };

	export type Request<
		TType extends TControllerType,
		TBody extends Record<string, unknown> = Record<string, unknown>,
		TParams extends Record<string, unknown> = Record<string, unknown>,
		TQueryParams extends Record<string, string | undefined> = Record<string, string | undefined>,
	> = TType extends "public" ? PublicRequest<TBody, TParams, TQueryParams> : PrivateRequest<TBody, TParams, TQueryParams>;

	
	/** When TBody is undefined, body is unknown for backward compat with IResponse. */
	export type Response<TBody = undefined> = {
		statusCode: number;
		body: TBody extends undefined ? unknown : TBody;
	};
}
