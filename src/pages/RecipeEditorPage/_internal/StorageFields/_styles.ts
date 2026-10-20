import styled from "styled-components";

export const SSwitchLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
`;

/** Переключатель на нативном чекбоксе: доступность и состояние от браузера, вид — свой. */
export const SSwitch = styled.input`
  appearance: none;
  position: relative;
  flex: none;
  width: 48px;
  height: 28px;
  margin: 0;
  border-radius: 999px;
  background: ${({ theme }) => theme.palette.border};
  cursor: pointer;
  transition: background 0.15s;

  &::before {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.surface};
    transition: transform 0.15s;
  }

  &:checked {
    background: ${({ theme }) => theme.palette.primary};
  }

  &:checked::before {
    transform: translateX(20px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.palette.primary};
    outline-offset: 2px;
  }
`;
