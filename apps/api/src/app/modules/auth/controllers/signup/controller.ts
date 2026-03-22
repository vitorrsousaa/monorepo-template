import { Controller } from "@application/interfaces/controller";
import type { ISignupService } from "@application/modules/auth/services/signup";
import type { SignupResponse } from "@repo/contracts/auth/signup";
import { signupSchema, type SignupSchema } from "./schema";

export class SignupController extends Controller<"public", SignupResponse> {
	protected override schema = signupSchema;
	constructor(private readonly signupService: ISignupService) {
		super();
	}

	protected override async handle(
		request: Controller.Request<"public", SignupSchema>,
	): Promise<Controller.Response<SignupResponse>> {
		const result = await this.signupService.execute({
			firstName: request.body.firstName,
			lastName: request.body.lastName,
			email: request.body.email,
			password: request.body.password,
		});

		return {
			statusCode: 200,
			body: result,
		};
	}
}
