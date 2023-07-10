import styled from "styled-components";
import React, { useState, useEffect } from "react";
export const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${(props) => props.theme.stroke};
  outline: none;
  border-radius: 0.25rem;

  &:disabled {
    color: #fff7f7 !important;
    &::placeholder {
      color: #fff7f7 !important;
    }
  }
`;

export const Input2 = ({
  placeholders,
  interval,
}: {
  placeholders: string[];
  interval: number;
}) => {
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPlaceholderIndex((prevIndex) =>
        prevIndex === placeholders.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [placeholders, interval]);

  return <Input placeholder={placeholders[currentPlaceholderIndex]} />;
};
