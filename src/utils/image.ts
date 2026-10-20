import imageCompression from "browser-image-compression";

/** Длинная сторона обложки рецепта, пиксели: на экране 600px колонки хватает с запасом для ретины. */
const COVER_MAX_SIDE_PX = 1200;

/** Потолок размера обложки после сжатия, мегабайты. */
const COVER_MAX_SIZE_MB = 0.6;

/**
 * Сжимает фото перед загрузкой: уменьшает до `COVER_MAX_SIDE_PX` по длинной
 * стороне и перекодирует в WebP.
 *
 * Фото с телефона весит несколько мегабайт — в бакет и тем более в мобильный
 * интернет с нестабильной связью оно уходит уже сжатым.
 */
export function compressRecipePhoto(file: File): Promise<File> {
  return imageCompression(file, {
    maxWidthOrHeight: COVER_MAX_SIDE_PX,
    maxSizeMB: COVER_MAX_SIZE_MB,
    fileType: "image/webp",
    useWebWorker: true,
  });
}

/** Содержимое файла как data URL — для превью, которое не нужно освобождать вручную. */
export function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
