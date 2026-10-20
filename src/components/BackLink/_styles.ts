import { createLink } from "@tanstack/react-router";
import styled from "styled-components";

const SBackAnchor = styled.a`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  min-height: 44px;
  color: ${({ theme }) => theme.palette.primary};
  text-decoration: none;
`;

/**
 * Ссылка «назад» с тап-целью 44px.
 *
 * Собрана через `createLink`: обёртка `styled(Link)` стирает дженерики роутера,
 * и `params` перестают проверяться типами.
 */
export const BackLink = createLink(SBackAnchor);
