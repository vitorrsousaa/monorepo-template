# API

## Serverless Configuration

### 1 Step - Define the name of project

In the `serverless.yml`, you should define the name of project. By default, the name is `ProjectName`.

### 2 Step - Define the TableName

In the `serverless.yml`, you should define the name of dynamo table. By default, the name is `ProjectNameTable`.

After that, you must be access the `src/app/database/table.ts`, and change the method `TABLE_NAME` with correct tableName.

### 3 Step - Add environment variables

In the `serverless.yml`, you can add other environment variables to share in the project in the `environment` section. By default, the only environment is `STAGE`. But you can add others.

After that, you must be access the `src/app/config/environment.ts`, and update the `schema` to validation and `Class` to exported, with all environment variables.

### Environment variables

After that, add a `.env` file to the root folder, according to the `env.example` of this repository.

For publish lambda functions, is necessary to set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in your `.env` file. These two keys can be obtained in your personal account.

You must create a unique `.env` file for each stage. For example, for the `dev` stage, you should create a `.env.dev` file and put all dev environemnt variables.

## Payment Provider

We use stripe by default, but the payment provider is agnostic, so, you can change the stripe and all aplication is working correctly.

## Deployment

We can deploy in two stages.

```bash
# Deploy stage dev
$ yarn deploy:dev

# Deploy stage prod
$ yarn deploy:prod
```

After deploying, you should see output similar to:

```bash
Deploying aws-node-http-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-http-api-project-dev (152s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  hello: aws-node-http-api-project-dev-hello (1.9 kB)
```

After to create routes, test routes, and implements solution, you can remove all resources that was deployed by using:

```bash
serverless remove
```

## Database

We used a `DynamoDB single-table` pattern.

### Table Design: Primary Key, Sort Key and Global Index Structure

| **Entity**  | **Primary Key (PK)** | **Sort Key (SK)**  | **gsi1pk**  | **gsi1sk** | **Additional Notes**                      |
|-------------|----------------------|--------------------|-------------|------------|-------------------------------------------|
| **User**    | `USER#<userId>`      | `PROFILE`          | `EMAIL`     | `SORT`     | Stores basic profile info for the user.   |

### Access Patterns and Queries

#### 1. Retrieve specific user
- **Query:**
  ```sql
  PK = USER#<userId> AND begins_with(SK, 'PROFILE')
