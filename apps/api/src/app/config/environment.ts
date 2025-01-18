import dotenv from "dotenv";
import * as z from "zod";

export const envSchema = z.object({
	STAGE: z.literal("dev").or(z.literal("prod")),
	AUTH_GOOGLE_CLIENT_ID: z.string(),
	AUTH_GOOGLE_CLIENT_SECRET: z.string(),
	AUTH_GOOGLE_REDIRECT_URI: z.string(),
	STRIPE_PUBLISHABLE_KEY: z.string(),
	STRIPE_SECRET_KEY: z.string(),
	STRIPE_PRO_PRICE_ID: z.string(),
	STRIPE_FREE_PRICE_ID: z.string(),
	STRIPE_WEBHOOK_SECRET: z.string(),
	STRIPE_FREE_QUOTA: z.string().refine((data) => !Number.isNaN(data)),
	STRIPE_PRO_QUOTA: z.string().refine((data) => !Number.isNaN(data)),
	STRIPE_REDIRECT_URL: z.string(),
	STRIPE_PRICE_ID: z.string(),
});

dotenv.config();

try {
	envSchema.parse(process.env);
} catch (error) {
	if (error instanceof z.ZodError) {
		console.error("Error on environment variables:", error.errors);
		process.exit(1);
	}
}

export interface IConfig {
	STAGE: string;
	AUTH_GOOGLE_CLIENT_ID: string;
	AUTH_GOOGLE_CLIENT_SECRET: string;
	AUTH_GOOGLE_REDIRECT_URI: string;
	ACCESS_TOKEN_EXPIRATION: number;
	AUTH_SECRET: string;
	STRIPE_SECRET_KEY: string;
	STRIPE_FREE_PRICE_ID: string;
	STRIPE_PUBLISHABLE_KEY: string;
	STRIPE_WEBHOOK_SECRET: string;
	STRIPE_PRO_PRICE_ID: string;
	STRIPE_FREE_QUOTA: number;
	STRIPE_PRO_QUOTA: number;
	STRIPE_REDIRECT_URL: string;
	STRIPE_PRICE_ID: string;
}

export class Config implements IConfig {
	public STAGE = process.env.STAGE as string;
	public AUTH_GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_CLIENT_ID as string;
	public AUTH_GOOGLE_CLIENT_SECRET = process.env
		.AUTH_GOOGLE_CLIENT_SECRET as string;
	public AUTH_GOOGLE_REDIRECT_URI = process.env
		.AUTH_GOOGLE_REDIRECT_URI as string;
	public ACCESS_TOKEN_EXPIRATION = 60 * 60 * 60 * 60 * 60; // 15hrs
	public AUTH_SECRET = process.env.AUTH_SECRET as string;
	public STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY as string;
	public STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
	public STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID as string;
	public STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;
	public STRIPE_FREE_PRICE_ID = process.env.STRIPE_FREE_PRICE_ID as string;
	public STRIPE_FREE_QUOTA = Number.parseInt(
		process.env.STRIPE_FREE_QUOTA as string,
	);
	public STRIPE_PRO_QUOTA = Number.parseInt(
		process.env.STRIPE_PRO_QUOTA as string,
	);
	public STRIPE_REDIRECT_URL = process.env.STRIPE_REDIRECT_URL as string;
	public STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID as string;
}
