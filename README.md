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
to start application. By default, application will be run at http://localhost:3000 address.

### Upload 


### Search

  
