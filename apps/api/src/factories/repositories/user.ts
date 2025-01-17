import { UserRepository } from "@application/database/repositories/user";
import { makeDatabaseClient } from "./db";

export function makeUserRepository() {
	return new UserRepository(makeDatabaseClient());
}
