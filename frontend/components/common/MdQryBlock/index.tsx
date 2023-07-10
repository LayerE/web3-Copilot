import styled from "styled-components";

export const HideExtraSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

export const ShowSmallOnly = styled.span`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: block;
  `};
`;

export const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;
export const ShowSmall = styled.span`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`;

export const HideMedium = styled.span`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`;
export const ShowMedium = styled.span`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
  `};
`;

export const HideLarge = styled.div`
  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: none;
  `};
`;
export const ShowLarge = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToLarge`
      display: block;
  `};
`;

export const HideExtraLarge = styled.div`
  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    display: none;
  `};
`;
export const ShowExtraLarge = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
      display: block;
  `};
`;
