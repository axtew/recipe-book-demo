import styled from "styled-components";

/**
 * Календарь по ширине листа. Месяц из ячеек по 44px занимает около 312px, а у листа на экране
 * шириной 320px внутри отступов остаётся 288px, поэтому календарь выходит в поля листа.
 */
export const SPicker = styled.div`
  display: flex;
  justify-content: center;
  margin-inline: -12px;
`;
