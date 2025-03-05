import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const OurFileRouter = {
  image: f(["image"]).onUploadComplete(async ({ file }) => {
    return {
      fileId: file.key,
      accessUrl: file.ufsUrl,
      processedAt: new Date().toISOString(),
    };
  }),
} satisfies FileRouter;

export type UploadRouter = typeof OurFileRouter;
