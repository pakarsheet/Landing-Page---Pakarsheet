import Link from "next/link";
import type { ReactNode, MouseEventHandler } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon | null;
  className?: string;
};

type LinkButtonProps = BaseProps & {
  href: string;
  onClick?: never;
  type?: never;
};

type ActionButtonProps = BaseProps & {
  href?: never;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
};

type ButtonProps = LinkButtonProps | ActionButtonProps;

const variantClass = {
  primary:   "bg-ink text-white shadow-soft hover:-translate-y-0.5 hover:bg-cobalt",
  secondary: "border border-line bg-white text-ink hover:-translate-y-0.5 hover:border-ink",
  ghost:     "text-ink hover:text-cobalt",
};

const sizeClass = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-base",
};

const innerClass =
  "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300";

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon = ArrowRight,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = `${innerClass} ${variantClass[variant]} ${sizeClass[size]} ${className}`;

  const content = (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition duration-300 group-hover:-translate-y-full">{children}</span>
        <span className="absolute left-0 top-full block transition duration-300 group-hover:-translate-y-full">
          {children}
        </span>
      </span>
      {Icon && (
        <Icon className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  if ("href" in rest && rest.href) {
    return (
      <Link href={rest.href} className={classes}>
        {content}
      </Link>
    );
  }

  const { onClick, type = "button" } = rest as ActionButtonProps;
  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
