import { ZodError } from "@application/errors/zod";
import type * as z from "zod";

type IReturnErrorMissingFieldOutputUnion<S extends z.ZodType> =
	z.ZodSafeParseSuccess<z.output<S>>["data"];

export function missingFields<S extends z.ZodType>(
	schema: S,
	request: unknown,
): IReturnErrorMissingFieldOutputUnion<S> {
	const result = schema.safeParse(request);

	if (!result.success) {
		throw new ZodError(result.error);
	}

	return result.data;
}
