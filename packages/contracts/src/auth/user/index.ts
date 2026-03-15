/**
 * User entity — profile stored in DynamoDB (Cognito holds credentials).
 * PK: USER#<userId>, GSI9: lookup by email.
 * Dates are ISO strings in serialized format.
 */
export interface User {
	id: string;
	email: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}
