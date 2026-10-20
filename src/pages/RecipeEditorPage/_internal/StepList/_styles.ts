import styled from "styled-components";

export const SStepBody = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;

  & > textarea {
    flex: 1;
    min-width: 0;
    min-height: 56px;
    overflow: hidden;
  }
`;

export const SNumber = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-height: 44px;
`;
