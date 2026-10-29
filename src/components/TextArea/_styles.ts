import styled from "styled-components";

import { textFieldStyles } from "@/components/TextInput";

/** Multi-line text field: looks the same as `STextInput`, only the padding and resize differ. */
export const STextArea = styled.textarea`
  ${textFieldStyles}
  min-height: 88px;
  padding: 10px 12px;
  font-family: inherit;
  resize: vertical;
`;
