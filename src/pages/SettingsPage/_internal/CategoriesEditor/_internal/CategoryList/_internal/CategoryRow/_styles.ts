import styled from "styled-components";

import { STextInput } from "@/components/TextInput";

export const SRow = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SNameInput = styled(STextInput)`
  flex: 1;
  min-width: 0;
`;
