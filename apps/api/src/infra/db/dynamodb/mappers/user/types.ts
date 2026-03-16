import { BaseDynamoDBEntity } from "../../contracts/entity";

export interface UserDynamoDBEntity extends BaseDynamoDBEntity {
	email: string;
	name: string;
}
