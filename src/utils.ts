import { join } from "path";
import { createReadStream } from "fs";
import { readdir, stat } from "fs/promises";
import FormData from "form-data";

export const filesToIgnore = [".DS_Store"];

export const logMessage = (message?: any): void => {
  console.log(message);
};

export const listFiles = async (directory: string): Promise<string[]> => {
  try {
    const files = await readdir(directory);
    const fileList: string[] = [];

    for (let file of files) {
      const filePath = join(directory, file);
      if ((await stat(filePath)).isFile() && !filesToIgnore.includes(file)) {
        fileList.push(filePath);
      }
    }

    return fileList;
  } catch (error) {
    console.error("Error accessing directory:", error);
    return [];
  }
};

export const listFolders = async (directory: string): Promise<string[]> => {
  try {
    const files = await readdir(directory);
    const folders: string[] = [];

    for (let file of files) {
      const filePath = join(directory, file);
      if ((await stat(filePath)).isDirectory()) {
        folders.push(file);
      }
    }

    return folders;
  } catch (error) {
    console.error("Error accessing directory:", error);
    return [];
  }
};

export const uploadFile = async ({
  fields,
  filePath,
  uploadUrl,
}: {
  fields: Record<string, any>;
  filePath: string;
  uploadUrl: string;
}) =>
  new Promise((resolve, reject) => {
    const form = new FormData();

    Object.entries(fields).forEach(([field, value]) => {
      form.append(field, value);
    });
    form.append("file", createReadStream(filePath));

    form.submit(uploadUrl, (error, response) => {
      if (error) {
        reject(error);
      }

      resolve(response);
    });
  });
