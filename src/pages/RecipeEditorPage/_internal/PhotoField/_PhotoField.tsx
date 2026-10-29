import { FileInput } from "@mantine/core";
import { useState } from "react";

import { Button } from "@/components/Button";
import { Caption2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { env } from "@/utils/env";
import { compressRecipePhoto, readAsDataUrl } from "@/utils/image";

import { SSection } from "../../_styles";
import { SActions, SPlaceholder, SPreview } from "./_styles";

interface IProps {
  /** Address of the already saved cover; null if there is none or it was removed. */
  savedUrl: string | null;
  /** A new photo chosen in this session and not yet uploaded. */
  photoFile: File | null;
  onPick: (file: File) => void;
  onRemove: () => void;
}

/**
 * Recipe cover: choosing, compression, a preview with replace and remove.
 *
 * The chosen file is compressed right away (up to 1200 px, WebP) and only then goes into the state:
 * on save an already light file goes to Storage. Saving the photo itself is a step of submitting
 * the recipe, not of this field.
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

      {/* In the demo uploading is closed: a saved photo is shown but cannot be changed. */}
      {!env.isDemo && (
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
      )}

      {isProcessing && <Caption2 color="textMuted">{l.processing}</Caption2>}
      {hasError && <Caption2 color="danger">{l.error}</Caption2>}
    </SSection>
  );
}
