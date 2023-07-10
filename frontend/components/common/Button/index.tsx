import styled from "styled-components";
import { colors } from "@/theme/colors";

const Button = styled.button<{
  size?: string;
  color?: string;
  bg?: string;
  radius?: string;
  padding?: string;
  border?: string;
  hoverColor?: string;
}>`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  border-radius: ${(props) => props.radius ?? ".5rem"};
  padding: 0.5rem 1rem;
  border: ${(props) => props?.border ?? "none"};
  background: ${(props) => props?.bg ?? props.theme.btnPrimary};
  color: ${(props) => props?.color ?? props.theme.primary};
  cursor: pointer;
  transition: 0.2s;
  &:disabled {
    opacity: 0.7;
    cursor: no-drop;
  }
  :hover {
    opacity: 0.8;
  }
  > * {
    user-select: none;
  }
`;

export const AppBtn = styled(Button)`
  --borderWidth: 3px;
  border: 1px solid ${({ theme }) => theme.secondary};
  transition: all 0.35s ease;
  background: rgba(37, 37, 37, 0.8);
  box-shadow: 0px 3px 0px #535357;
  position: relative;
  overflow: hidden;
  z-index: 1;
  &::after {
    content: "";
    position: absolute;
    top: calc(-1 * var(--borderWidth));
    left: calc(-1 * var(--borderWidth));
    height: calc(100% + var(--borderWidth) * 2);
    width: calc(100% + var(--borderWidth) * 2);
    border-radius: calc(2 * var(--borderWidth));
    z-index: -1;
  }
  &:hover:after {
    background: ${({ theme }) => theme.btnActive};
    animation: animatedgradient 3s infinite linear;
    background-size: 300% 300%;
  }
  @keyframes animatedgradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;
export const ModalBtn = styled(Button)`
  padding: 0.75rem 1rem;
  border-radius: 2rem;
`;
export const GlowBtn = ({
  children,
  onClick,
  disabled,
  width,
  bg,
  ...props
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: any;
  width?: string;
  bg?: string;
}) => {
  return (
    <GlowBtnWrapper
      className="sparkle-button"
      _width={width ?? "intial"}
      _bg={bg}
    >
      <button disabled={disabled} onClick={onClick}>
        <span className="spark"></span>
        <span className="spark"></span>
        <span className="backdrop"></span>
        <span className="text">{children}</span>
      </button>
    </GlowBtnWrapper>
  );
};
const GlowBtnWrapper = styled.div<{ _width: string; _bg?: string }>`
  --transition: 0.25s;
  --spark: 1.8s;
  --cut: 0.1em;
  --active: 0;
  --bg: radial-gradient(
      40% 50% at center 100%,
      hsl(270 calc(var(--active) * 97%) 72% / var(--active)),
      transparent
    ),
    radial-gradient(
      80% 100% at center 120%,
      hsl(260 calc(var(--active) * 97%) 70% / var(--active)),
      transparent
    ),
    hsl(260 calc(var(--active) * 97%) calc((var(--active) * 44%) + 12%));
  z-index: 1;
  button {
    background: ${(props) => props?._bg ?? "#5c2da7"};
    border: 0;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25em;
    white-space: nowrap;
    border-radius: 0.5rem;
    position: relative;
    width: ${(props) => props._width ?? "initial"};
    transition: box-shadow var(--transition), scale var(--transition),
      background var(--transition);
    scale: calc(1 + (var(--active) * 0.009));
    display: flex;
    align-items: center;
    justify-content: center;
  }
  button:disabled {
    pointer-events: none;
    cursor: not-allowed;
  }
  button:active {
    scale: 1;
    background: ${({ theme }) => theme.primaryGradient};
  }

  svg {
    overflow: visible !important;
  }

  /* button:hover {
    background: ${({ theme }) => theme.primaryGradient};
    animation: animatedgradient 3s infinite linear;
    background-size: 200% 200%;
  }
  @keyframes animatedgradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  } */
  button:is(:hover, :focus-visible) path {
    animation-name: bounce;
  }

  @keyframes bounce {
    35%,
    65% {
      scale: var(--scale);
    }
  }

  button:before {
    content: "";
    position: absolute;
    inset: -0.25em;
    z-index: -1;
    border-radius: 0.5rem;
    opacity: var(--active, 0);
    transition: opacity var(--transition);
  }

  .spark {
    position: absolute;
    inset: 0;
    border-radius: 0.5rem;
    rotate: 0deg;
    overflow: hidden;
    mask: linear-gradient(white, transparent 50%);
    animation: flip calc(var(--spark) * 2) infinite steps(2, end);
  }

  @keyframes flip {
    to {
      rotate: 360deg;
    }
  }

  .spark:before {
    content: "";
    position: absolute;
    width: 200%;
    aspect-ratio: 1;
    top: 0%;
    left: 50%;
    z-index: -1;
    translate: -50% -15%;
    rotate: 0;
    transform: rotate(-90deg);
    opacity: calc((var(--active)) + 0.4);
    background: conic-gradient(from 0deg, transparent 0 340deg, white 360deg);
    transition: opacity var(--transition);
    animation: rotate var(--spark) linear infinite both;
  }

  .spark:after {
    content: "";
    position: absolute;
    inset: var(--cut);
    border-radius: 0.5rem;
  }

  .backdrop {
    position: absolute;
    inset: var(--cut);
    background: rgb(22, 22, 22);
    border-radius: 0.5rem;
    transition: background var(--transition);
  }

  @keyframes rotate {
    to {
      transform: rotate(90deg);
    }
  }

  @supports (selector(:has(:is(+ *)))) {
    body:has(button:is(:hover, :focus-visible)) {
      --active: 1;
      --play-state: running;
    }
    .bodydrop {
      display: none;
    }
  }

  button:is(:hover, :focus-visible) ~ :is(.bodydrop, .particle-pen) {
    --active: 1;
    --play-state: runnin;
  }

  button:is(:hover, :focus-visible) {
    --active: 1;
    --play-state: running;
  }

  @keyframes float-out {
    to {
      rotate: 360deg;
    }
  }

  .text {
    translate: 2% -6%;
    letter-spacing: 0.01ch;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: linear-gradient(
      90deg,
      hsl(0 0% calc((var(--active) * 100%) + 65%)),
      hsl(0 0% calc((var(--active) * 100%) + 26%))
    );
    -webkit-background-clip: text;
    color: transparent;
    transition: background var(--transition);
  }
`;
export default Button;
