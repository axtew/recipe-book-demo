import styled from "styled-components";

import { SButtonRow } from "@/components/Button";

/** Форма в нижнем листе: поля колонкой, внизу отступ под системную полосу жестов iOS. */
export const SSheetForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: env(safe-area-inset-bottom);
`;

/** Подпись и поле; `as="div"`, когда внутри несколько элементов управления. */
export const SSheetField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

/** Кнопки внизу листа. */
export const SSheetActions = styled(SButtonRow)`
  margin-top: 8px;
`;
