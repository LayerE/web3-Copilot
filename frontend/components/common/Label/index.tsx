import React from "react";
import { ReactElement } from "react-markdown/lib/react-markdown";
import styled from "styled-components";
import Row from "../Row";
import { TEXT } from "@/theme/texts";

const Label = ({ children }: { children: React.ReactNode }) => {
  return <LabelWrapper>{children}</LabelWrapper>;
};
const LabelWrapper = styled(Row)`
  gap: 0.25rem;
  background: ${({ theme }) => theme.secondary};
  border-radius: 0.25rem;
  width: fit-content;
  padding: 0.5rem 1rem;
`;
export const DisabledLabel = styled.p`
  font-size: clamp(0.8rem, 1vw, 0.9rem);
  color: #67666e;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export default Label;
