import { Controller } from "@application/interfaces/controller";
import type { ISigninService } from "@application/modules/auth/services/signin";
import type { SigninResponse } from "@repo/contracts/auth/signin";
import { signinSchema, type SigninSchema } from "./schema";

export class SigninController extends Controller<"public", SigninResponse> {
	protected override schema = signinSchema;

	constructor(private readonly signinService: ISigninService) {
		super();
	}

	protected override async handle(
		request: Controller.Request<"public", SigninSchema>,
	): Promise<Controller.Response<SigninResponse>> {
		const result = await this.signinService.execute({
			email: request.body.email,
			password: request.body.password,
		});
		return {
			statusCode: 200,
			body: result,
		};
	}
}
