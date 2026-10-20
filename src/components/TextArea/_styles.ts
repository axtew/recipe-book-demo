import styled from "styled-components";

import { textFieldStyles } from "@/components/TextInput";

/** Многострочное текстовое поле: вид общий с `STextInput`, отличаются отступы и ресайз. */
export const STextArea = styled.textarea`
  ${textFieldStyles}
  min-height: 88px;
  padding: 10px 12px;
  font-family: inherit;
  resize: vertical;
`;
