import imageCompression from "browser-image-compression";

/** Long side of a recipe cover, pixels: on a 600px screen column it is plenty, even for retina. */
const COVER_MAX_SIDE_PX = 1200;

/** Ceiling of the cover size after compression, megabytes. */
const COVER_MAX_SIZE_MB = 0.6;

/**
 * Compresses a photo before upload: scales it down to `COVER_MAX_SIDE_PX` on the long
 * side and re-encodes to WebP.
 *
 * A phone photo weighs several megabytes — it goes to the bucket, and even more so over mobile
 * internet with an unstable connection, already compressed.
 */
export function compressRecipePhoto(file: File): Promise<File> {
  return imageCompression(file, {
    maxWidthOrHeight: COVER_MAX_SIDE_PX,
    maxSizeMB: COVER_MAX_SIZE_MB,
    fileType: "image/webp",
    useWebWorker: true,
  });
}

/** File contents as a data URL — for a preview that does not need to be released manually. */
export function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
