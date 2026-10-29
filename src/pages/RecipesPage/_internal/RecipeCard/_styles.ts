import { createLink } from "@tanstack/react-router";
import styled from "styled-components";

export const SItem = styled.li`
  display: flex;
`;

const SAnchor = styled.a`
  display: flex;
  flex: 1;
  gap: 12px;
  min-height: 44px;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.surface};
  color: inherit;
  text-decoration: none;
`;

/**
 * Link to the recipe card.
 *
 * Built with `createLink` rather than `styled(Link)`: the styled-components wrapper erases the
 * router generics, and the typed `params` stop being checked.
 */
export const SLink = createLink(SAnchor);

const THUMB_SIZE_PX = 72;

export const SPhoto = styled.img`
  flex: none;
  width: ${THUMB_SIZE_PX}px;
  height: ${THUMB_SIZE_PX}px;
  border-radius: 8px;
  object-fit: cover;
`;

export const SPhotoPlaceholder = styled.div`
  flex: none;
  width: ${THUMB_SIZE_PX}px;
  height: ${THUMB_SIZE_PX}px;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.primaryMuted};
`;

export const SBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const SName = styled.div`
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const SMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SSnowflake = styled.span`
  color: ${({ theme }) => theme.palette.primary};
`;

export const SNutrition = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 6px;
`;
