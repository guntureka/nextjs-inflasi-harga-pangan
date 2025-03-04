"use server";

import { UTApi } from "uploadthing/server";
import { FileEsque } from "uploadthing/types";

const utapi = new UTApi();

export async function uploadFile(file: FileEsque) {
  try {
    const res = await utapi.uploadFiles(file);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteFiles(keys: string | string[]) {
  try {
    const res = await utapi.deleteFiles(keys);

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
