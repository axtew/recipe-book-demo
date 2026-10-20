import { B2, B3, Caption2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import {
  SField,
  SFieldRow,
  SForm,
  SInput,
  SNumberInput,
  SSection,
  SSubmit,
  STextarea,
} from "../../_styles";
import type { IRecipeFormProps } from "../../_types";
import { useRecipeEditor } from "../../_useRecipeEditor";
import { DishCategoryField } from "../DishCategoryField";
import { IngredientList } from "../IngredientList";
import { NutritionBar } from "../NutritionBar";
import { PhotoField } from "../PhotoField";
import { StepList } from "../StepList";
import { StorageFields } from "../StorageFields";
import { VideoLinks } from "../VideoLinks";

/**
 * Форма рецепта в порядке экрана из плана: название, категории, время, порции,
 * выход, фото, состав, шаги, хранение, видео, заметки. Липкая плашка КБЖУ — в конце.
 */
export function RecipeForm(props: IRecipeFormProps) {
  const l = useI18nSelector(({ l }) => ({
    ...l.recipeEditor.form,
    validation: l.recipeEditor.validation,
  }));
  const editor = useRecipeEditor(props);
  const { form, onChange, updateFieldValue, save } = editor;

  const errorMessage =
    save.error === null ? null : save.error === "submit" ? l.submitError : l.validation[save.error];

  return (
    <SForm onSubmit={save.handleSubmit}>
      <SField>
        <Caption2 color="textMuted">{l.nameLabel}</Caption2>
        <SInput type="text" name="name" value={form.name.value} onChange={onChange} />
      </SField>

      <DishCategoryField
        selectedIds={editor.dishCategoryIds}
        setSelectedIds={editor.setDishCategoryIds}
      />

      <SFieldRow>
        <SField>
          <Caption2 color="textMuted">{l.cookTimeLabel}</Caption2>
          <SNumberInput
            size="md"
            hideControls
            min={0}
            allowDecimal={false}
            value={form.cookTimeMin.value}
            onChange={(value) =>
              updateFieldValue("cookTimeMin", typeof value === "number" ? value : "")
            }
          />
        </SField>
        <SField>
          <Caption2 color="textMuted">{l.servingsLabel}</Caption2>
          <SNumberInput
            size="md"
            hideControls
            min={0}
            allowDecimal={false}
            value={form.servingsBase.value}
            onChange={(value) =>
              updateFieldValue("servingsBase", typeof value === "number" ? value : "")
            }
          />
        </SField>
        <SField>
          <Caption2 color="textMuted">{l.yieldLabel}</Caption2>
          <SNumberInput
            size="md"
            hideControls
            min={0}
            decimalScale={1}
            value={form.yieldGrams.value}
            onChange={(value) =>
              updateFieldValue("yieldGrams", typeof value === "number" ? value : "")
            }
          />
        </SField>
      </SFieldRow>
      <Caption2 color="textMuted">{l.yieldHint}</Caption2>

      <PhotoField
        photoPath={editor.photoPath}
        photoFile={editor.photoFile}
        onPick={editor.setPhotoFile}
        onRemove={() => {
          editor.setPhotoFile(null);
          editor.setPhotoPath(null);
        }}
      />

      <IngredientList
        ingredients={editor.ingredients.items}
        onAdd={editor.ingredients.add}
        onChange={editor.ingredients.update}
        onRemove={editor.ingredients.remove}
        onMove={editor.ingredients.move}
      />

      <StepList
        steps={editor.steps.items}
        onAdd={editor.steps.add}
        onChange={editor.steps.update}
        onRemove={editor.steps.remove}
        onMove={editor.steps.move}
      />

      <StorageFields
        freezable={form.freezable.value}
        freezerDays={form.freezerDays.value}
        fridgeDays={form.fridgeDays.value}
        onChange={updateFieldValue}
      />

      <VideoLinks urls={editor.videoUrls} onChange={editor.setVideoUrls} />

      <SSection>
        <H3>{l.notesLabel}</H3>
        <STextarea
          name="notes"
          value={form.notes.value}
          onChange={onChange}
          aria-label={l.notesLabel}
        />
      </SSection>

      {errorMessage !== null && <B3 color="danger">{errorMessage}</B3>}

      <SSubmit type="submit" disabled={save.isPending}>
        <B2 as="span">{save.isPending ? l.saving : l.saveButton}</B2>
      </SSubmit>

      <NutritionBar
        nutrition={editor.nutrition.nutrition}
        hasCountedIngredients={editor.nutrition.hasCountedIngredients}
        isServingsValid={editor.nutrition.isServingsValid}
      />
    </SForm>
  );
}
