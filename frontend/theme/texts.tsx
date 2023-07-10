import React, { ReactNode } from "react";
import { Colors } from "./styled";
import styled from "styled-components";

const BaseTextStyle = styled.p<{
  color: keyof Colors;
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: string;
}>`
  color: ${({ color, theme }) => (theme as any)[color]};
  font-size: ${({ fontSize }) => fontSize ?? "1rem"};
  font-family: ${({ fontFamily }) => fontFamily ?? "inherit"};
  display: flex;
  gap: 0.25rem;
`;

// white : 20px , 16px , 14px
// 36px
// #E9E9E9: 28px

type TEXTProps = {
  children: ReactNode;
  size?: string;
};

export const TEXT = {
  LargeHeader({ children, size }: TEXTProps) {
    return (
      <BaseTextStyle
        fontFamily="var(--ff-title)"
        fontSize={size ?? "var(--fs-l)"}
        color={"primary"}
      >
        {children}
      </BaseTextStyle>
    );
  },
  ImpText({ children, size }: TEXTProps) {
    return (
      <BaseTextStyle
        fontFamily="var(--ff-imp)"
        fontSize={size ?? "var(--fs-r)"}
        color={"primary"}
      >
        {children}
      </BaseTextStyle>
    );
  },
  MediumHeader({ children, size }: TEXTProps) {
    return (
      <BaseTextStyle
        fontFamily="var(--ff-subtitle)"
        fontWeight={600}
        fontSize={size ?? "var(--fs-m)"}
        color={"primary"}
      >
        {children}
      </BaseTextStyle>
    );
  },

  SmallHeader({ children, size }: TEXTProps) {
    return (
      <BaseTextStyle
        fontFamily="var(--ff-subtitle)"
        fontWeight={600}
        fontSize={size ?? "var(--fs-r)"}
        color={"primary"}
      >
        {children}
      </BaseTextStyle>
    );
  },

  Body({ children, size }: TEXTProps) {
    return (
      <BaseTextStyle
        fontWeight={400}
        fontSize={size ?? "var(--fs-r)"}
        color={"primary"}
      >
        {children}
      </BaseTextStyle>
    );
  },
  SmallBody({ children, size }: TEXTProps) {
    return (
      <BaseTextStyle
        fontWeight={400}
        fontSize={size ?? "var(--fs-s)"}
        color={"primary"}
      >
        {children}
      </BaseTextStyle>
    );
  },

  Disabled({ children, size }: TEXTProps) {
    return (
      <BaseTextStyle
        fontWeight={500}
        color={"secondary"}
        fontSize={size ?? "inherit"}
      >
        {children}
      </BaseTextStyle>
    );
  },
};
