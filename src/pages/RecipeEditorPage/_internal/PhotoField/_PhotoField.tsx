import { FileInput } from "@mantine/core";
import { useState } from "react";

import { Button } from "@/components/Button";
import { Caption2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { compressRecipePhoto, readAsDataUrl } from "@/utils/image";

import { SSection } from "../../_styles";
import { SActions, SPlaceholder, SPreview } from "./_styles";

interface IProps {
  /** Адрес уже сохранённой обложки; null, если её нет или она убрана. */
  savedUrl: string | null;
  /** Новое фото, выбранное в этой сессии и ещё не загруженное. */
  photoFile: File | null;
  onPick: (file: File) => void;
  onRemove: () => void;
}

/**
 * Обложка рецепта: выбор, сжатие, превью с заменой и удалением.
 *
 * Выбранный файл сжимается сразу (до 1200 px, WebP) и только затем попадает в
 * состояние: на сохранении в Storage уходит уже лёгкий файл. Само сохранение
 * фото — шаг отправки рецепта, не этого поля.
 */
export function PhotoField({ savedUrl, photoFile, onPick, onRemove }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeEditor.photo);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const previewUrl = (photoFile === null ? null : filePreviewUrl) ?? savedUrl;

  async function handleChange(file: File | null) {
    if (file === null) return;

    setHasError(false);
    setIsProcessing(true);

    try {
      const compressed = await compressRecipePhoto(file);

      setFilePreviewUrl(await readAsDataUrl(compressed));
      onPick(compressed);
    } catch (error) {
      console.error(error);
      setHasError(true);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <SSection>
      <H3>{l.title}</H3>

      {previewUrl === null ? (
        <SPlaceholder>
          <Caption2 color="textMuted">{l.empty}</Caption2>
        </SPlaceholder>
      ) : (
        <SPreview src={previewUrl} alt={l.alt} />
      )}

      <SActions>
        <FileInput
          size="md"
          accept="image/*"
          value={null}
          placeholder={previewUrl === null ? l.choose : l.replace}
          aria-label={previewUrl === null ? l.choose : l.replace}
          disabled={isProcessing}
          onChange={handleChange}
        />
        {previewUrl !== null && (
          <Button
            variant="dangerOutline"
            type="button"
            onClick={() => {
              setFilePreviewUrl(null);
              onRemove();
            }}
          >
            {l.remove}
          </Button>
        )}
      </SActions>

      {isProcessing && <Caption2 color="textMuted">{l.processing}</Caption2>}
      {hasError && <Caption2 color="danger">{l.error}</Caption2>}
    </SSection>
  );
}
