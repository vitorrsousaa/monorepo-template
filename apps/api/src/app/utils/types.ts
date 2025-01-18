export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
