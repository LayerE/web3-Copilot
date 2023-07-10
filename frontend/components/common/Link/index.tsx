import Link from "next/link";
import { ReactNode } from "react";

export const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => {
  return (
    <Link
      style={{
        textDecoration: "none",
        color: "inherit",
        font: "inherit",
        cursor: "pointer",
      }}
      href={href}
    >
      {children}
    </Link>
  );
};
