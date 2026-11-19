const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

/** Same limit the sign-up form uses. */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

/** Uploads a file to imgbb and returns the hosted image URL. */
export async function uploadToImgbb(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Pick a PNG or JPG image.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large. Use a file of 2MB or smaller.");
  }

  if (!IMGBB_KEY) {
    throw new Error("Image upload is not configured.");
  }

  const body = new FormData();
  body.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
    { method: "POST", body },
  );

  const result = await response.json();

  if (!response.ok || !result?.success || !result?.data?.url) {
    throw new Error(result?.error?.message ?? "Upload failed. Please try again.");
  }

  return result.data.url as string;
}
