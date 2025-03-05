"use server";

import { UTApi } from "uploadthing/server";
const utapi = new UTApi();

export const uploadFile = async (file: File) => {
  try {
    const response = await utapi.uploadFiles(file);

    return response.data;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const deleteFiles = async (key: string | string[]) => {
  try {
    const response = await utapi.deleteFiles(key);

    return response.success;
  } catch (error) {
    console.log("Delete failed:", error);
    throw error;
  }
};
