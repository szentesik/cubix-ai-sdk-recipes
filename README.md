# AI SDK demo project using Jeff Thompson's recipe collection

## Prerequisites
* Node.js 20.12.0 or later installed.
* Operating systems: macOS, Windows (including WSL), or Linux.
* PostgreSQL database with pgvector extension
* Docker (optional, to run pgvector locally)

For development and test purposes, Docker Compose file is bundled to run pgvector locally. Execute
```shell
docker compose up -d
```
in the directory *docker-compose-yml* resides to start database system in the background

To stop database, execute
```shell
docker compose stop
```

## Configuration
Set the following environment variables in the system or in *.env* file. 
* **DATABASE_URL**: Database url, in *postgres://{username}:{password}@{hostname}:{port}/{dbname}* format
* **OPENAI_API_KEY**: valid OpenAI API key. Organization should be verified to use application (can be checked in https://platform.openai.com/settings/organization/general)

## Installation

To initialize the database, execute

```shell
npm run db:migrate
```
in the application root directory before using the application the first time.

## Usage

Execute 
```shell
npm run dev
```
to start application in developer mode. By default, application will be accessible at http://localhost:3000 address.

### Upload 
POST ` /api/upload `

- Accepts a single recipe document in JSON format and stores it in the database. The content is embedded and saved into the `embeddings` table for semantic search.

Request body (JSON):
```json
{
  "id": 123,
  "category": "Document",
  "recipe_name": "Chocolate Cake",
  "section_type": "full",
  "ingredients_count": 10,
  "steps_count": 7,
  "prep_time": "About 45 minutes",
  "difficulty": "medium",
  "source_file": "chocolate_cake.md",
  "text": "Full plain-text content to index...",
  "chunking_method": "section based"
}
```

Field description:
- **id** (number, required): Unique identifier of the recipe document.
- **category** (string, optional): 
- **recipe_name** (string, required): 
- **section_type** (enum, optional): one of `info`, `ingredients`, `steps`, `notes`, `based on`, `full`.
- **ingredients_count** (number, optional)
- **steps_count** (number, optional)
- **prep_time** (string, optional)
- **difficulty** (enum, optional): one of `easy`, `medium`, `hard`.
- **source_file** (string, required): Path or name of the original source file.
- **text** (string, required): The document content that will be embedded and stored.
- **chunking_method** (string, optional)

Example:
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -d '{
    "id": 123,
    "category": "Document",
    "recipe_name": "Chocolate Cake",
    "section_type": "full",
    "ingredients_count": 10,
    "steps_count": 7,
    "prep_time": "About 45 minutes",
    "difficulty": "medium",
    "source_file": "chocolate_cake.md",
    "text": "Full plain-text content to index...",
    "chunking_method": "section based"
  }'
```

Responses:
- 201 Created
  - Body: `{ "message": "document received" }`
- 400 Bad Request (malformed JSON)
  - Body: `{ "error": "Invalid JSON" }`
- 400 Bad Request (validation error)
  - Body: `{ "error": "Invalid parameters", "details": [ ...zod issues... ] }`
- 400 Bad Request (persistence error)
  - Body: `{ "error": "Error creating resource", "details": "..." }`

Separate python application is available for mass upload. Execute
```shell
cd upload_recipes
py main.py
```
to upload all recipes in *upload_recipes/data* directory.


### Search

Open *http://localhost:3000* to access AI assistant and ask 
questions about cooking suggestions and recipes.
