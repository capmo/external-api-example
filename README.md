# Capmo External API Example

A practical example on how to use Capmo's external API.

## Installation

```sh
# Install dependencies
npm i

# Generate the client, check the docs for the latest version
npx api install "@capmoapi/v1.0#dqpb2mplw4ritj5"
```

## Authentication

You'll need an authentication token in order to use our external API. You can
create one within your account's settings when you use our web app.

## What it does

This example uses TypeScript to implement the following flow of events in Capmo:

1. Create new projects based on the name of existing folders in a given known
   local directory [`PROJECTS_PATH`]
2. Ensure that a Contact Book Person exists for the API user's organisation
   based on their email [`PERSON_TO_INVITE_EMAIL`]
3. For the first created project, add the Organisation Contact Book Person as
   a Project Contact Book Person
4. Invite that Project Contact Book Person to the project as an `ADMIN`
5. Upload the first document to the same project that is found in a known local
   directory [`DOCUMENTS_PATH`]

These variables should be set in the `.env` file which you can copy from
`.env.example` and fill in.
