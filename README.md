# Capmo External API Example

A practical example on how to use Capmo's external API.

## Installation

To get the latest version of the API client, check the [official documentation].
When you browse an endpoint and select `Node` as the language, you'll see a
snippet like the following:

```sh
# Install dependencies
npm i

# Install the Capmo API client, check the docs for the latest version
# and replace <version_hash> with the actual version hash
npx api install "@capmoapi/v1.0#<version_hash>"
```

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

## Authentication

1. Log in to your Capmo account at [app.capmo.de](https://app.capmo.de)
2. Navigate to Account Settings → API Keys
3. Create a new API Key
4. Copy the key and add it to your `.env` file

⚠️ Never commit your API key or share it with others.

## Configuration

Configure the following variables in your `.env` file:

- `PROJECTS_PATH`: Directory containing project folders
- `PERSON_TO_INVITE_EMAIL`: Email of the person to invite
- `DOCUMENTS_PATH`: Directory containing documents to upload

## Troubleshooting

Common issues and their solutions:

- **Authentication Errors**: Ensure your API token is valid and properly set in `.env`
- **Version Mismatch**: Make sure you're using the latest API client version
- **Permission Issues**: Verify your account has the necessary permissions

## Support

- For API-specific questions, visit our [official documentation]
- For bugs or feature requests, please open an issue
- For additional support, contact our support team

<!-- References -->

[official documentation]: https://capmoapi.readme.io/
