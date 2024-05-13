import { config } from "dotenv-safe";
import capmo from "@api/capmoapi";
import difference from "lodash/difference";
import { listFiles, listFolders, logMessage, uploadFile } from "./utils";
import type { Project } from "./types";

config();

// Load the auth token from the environment
const capmoAuthToken = process.env.CAPMO_AUTH_TOKEN!;
// Load the projects path
const projectsPath = process.env.PROJECTS_PATH!;
// Load the documents path
const documentsPath = process.env.DOCUMENTS_PATH!;
// Load the person to invite email
const personToInviteEmail = process.env.PERSON_TO_INVITE_EMAIL!;

// Set the auth token for the Capmo API
capmo.auth(`Capmo ${capmoAuthToken}`);

const main = async () => {
  // List existing projects
  const projectsResponse = await capmo.getProjects();
  logMessage(projectsResponse.data.message);

  if (!projectsResponse.data.data?.items) {
    throw new Error("An error occurred while fetching the projects.");
  }

  const projects = projectsResponse.data.data.items;
  const projectNames = projects.map((project) => project.name);

  const projectDirs = await listFolders(projectsPath);

  const projectsNotCreated = difference(projectDirs, projectNames);

  logMessage(
    `Local projects not yet created in Capmo: ${
      projectsNotCreated.length ? projectsNotCreated.join(", ") : "None"
    }`
  );

  // Create projects based on the local project directories
  const createdProjects: Project[] = [];
  for (let projectName of projectsNotCreated) {
    const projectResponse = await capmo.createProject({
      name: projectName,
      address: "Teststr. 888, 80339 München, Germany",
      project_volume: 1000000,
    });
    logMessage(projectResponse.data.message);

    if (projectResponse.data.data) {
      createdProjects.push(projectResponse.data.data);
    }
  }

  // Use the first created project
  const [newProject] = createdProjects;

  if (!newProject) {
    return;
  }

  // List existing contacts (people) in the organisation contact book
  const organisationContactBookPeopleResponse =
    await capmo.getOrganisationPeople();
  logMessage(organisationContactBookPeopleResponse.data.message);

  if (!organisationContactBookPeopleResponse.data.data?.items) {
    throw new Error(
      "An error occurred while fetching the organisation contact book people."
    );
  }

  // Find the person to invite in the organisation contact book
  const cbPeopleEmail =
    organisationContactBookPeopleResponse.data.data.items.map(
      (person) => person.email
    );
  if (!cbPeopleEmail.includes(personToInviteEmail)) {
    throw new Error(
      `The email ${personToInviteEmail} is not in the organisation contact book.`
    );
  }

  const orgPersonToInvite =
    organisationContactBookPeopleResponse.data.data.items.find(
      (person) => person.email === personToInviteEmail
    )!;

  logMessage(
    `Organisation Contact Book Person to invite to Project: ${orgPersonToInvite.email}`
  );

  // Add the organisation contact book person to the project contact book
  const projectAddResponse = await capmo.createProjectPersonFromOrganisation(
    {
      person_id: orgPersonToInvite.id,
    },
    {
      projectId: newProject.id,
    }
  );
  logMessage(projectAddResponse.data.message);

  if (!projectAddResponse.data.data) {
    throw new Error(
      "An error occurred while adding the organisation contact book person to the project."
    );
  }

  // Invite the project contact book person to the project
  const projectPerson = projectAddResponse.data.data;
  const projectInviteResponse = await capmo.inviteProjectPerson(
    {
      person_id: projectPerson.id,
      role: "ADMIN",
    },
    {
      projectId: newProject.id,
    }
  );
  logMessage(projectInviteResponse.data.message);

  // Add existing documents to the project
  const localProjectDocuments = await listFiles(documentsPath);
  logMessage(
    `Local project documents: ${
      localProjectDocuments.length
        ? localProjectDocuments.map((document) => document.name).join(", ")
        : "None"
    }`
  );

  // Use the first document in the local project documents
  const [newDocument] = localProjectDocuments;

  const projectAddDocumentResponse = await capmo.getDocumentUploadUrl(
    {
      mime_type: newDocument.mimeType,
    },
    {
      projectId: newProject.id,
    }
  );
  logMessage(projectAddDocumentResponse.data.message);

  if (!projectAddDocumentResponse.data.data) {
    throw new Error(
      "An error occurred while adding the document to the project."
    );
  }

  // Upload the document to the project's document upload URL
  const documentUploadData = projectAddDocumentResponse.data.data;

  await uploadFile({
    fields: documentUploadData.fields,
    filePath: newDocument.path,
    uploadUrl: documentUploadData.upload_url,
  });

  // Create a project document with the uploaded document
  const documentUploadResponse = await capmo.createProjectDocument(
    {
      name: newDocument.name,
      data_path: documentUploadData.data_path,
    },
    {
      projectId: newProject.id,
    }
  );
  logMessage(documentUploadResponse.data.message);
};

main();
