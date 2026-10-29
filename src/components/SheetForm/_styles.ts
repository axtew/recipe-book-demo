import styled from "styled-components";

import { SButtonRow } from "@/components/Button";

/**
 * A form in a bottom sheet: fields in a column, padding at the bottom for the iOS system gesture
 * bar.
 */
export const SSheetForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: env(safe-area-inset-bottom);
`;

/** A label and a field; `as="div"` when there are several controls inside. */
export const SSheetField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

/** Buttons at the bottom of the sheet. */
export const SSheetActions = styled(SButtonRow)`
  margin-top: 8px;
`;
