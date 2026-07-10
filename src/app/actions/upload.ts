"use server";

import { put } from "@vercel/blob";
import { isAdminAuthenticated } from "@/lib/auth";

export type UploadResult = { url: string } | { notConfigured: true } | { error: string };

export async function uploadItemImageAction(formData: FormData): Promise<UploadResult> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Not authorized" };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No file provided" };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { notConfigured: true };
  }

  try {
    const blob = await put(`items/${crypto.randomUUID()}.jpg`, file, {
      access: "public",
      contentType: "image/jpeg",
    });
    return { url: blob.url };
  } catch {
    return { error: "Upload failed" };
  }
}
