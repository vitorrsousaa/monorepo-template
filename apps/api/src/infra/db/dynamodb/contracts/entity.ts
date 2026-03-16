export interface BaseDynamoDBEntity {
  id: string; // UUID
  PK: string;
  SK: string;
  entity_type: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}