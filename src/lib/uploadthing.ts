import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<typeof OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<typeof OurFileRouter>();
