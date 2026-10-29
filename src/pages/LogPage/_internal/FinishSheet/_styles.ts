import styled from "styled-components";

/**
 * Calendar at the sheet width. A month of 44px cells takes about 312px, while a sheet on a screen
 * 320px wide has 288px left inside the paddings, so the calendar extends into the sheet margins.
 */
export const SPicker = styled.div`
  display: flex;
  justify-content: center;
  margin-inline: -12px;
`;
