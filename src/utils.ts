import axios from "axios";
import { readdir, readFile, stat } from "fs/promises";
import { join } from "path";

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

export const uploadFile = async (filePath: string, uploadUrl: string) => {
  try {
    const fileContent = await readFile(filePath);
    const response = await axios.put(uploadUrl, fileContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": fileContent.length,
      },
    });
    return response;
  } catch (error) {
    console.error("Error uploading PDF to S3:", error);
  }
};
