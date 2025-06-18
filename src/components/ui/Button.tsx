import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import type { ButtonProps } from "../../types";

const buttonVariants = {
  primary:
    "bg-bodega-brick text-storyteller-cream hover:bg-community-teal hover:scale-105 hover:shadow-lg active:scale-95 transform transition-all duration-200 ease-in-out",
  secondary:
    "bg-community-teal text-storyteller-cream hover:bg-bodega-brick hover:scale-105 hover:shadow-lg active:scale-95 transform transition-all duration-200 ease-in-out",
  outline:
    "border-2 border-bodega-brick text-bodega-brick hover:bg-bodega-brick hover:text-storyteller-cream hover:scale-105 hover:shadow-md active:scale-95 transform transition-all duration-200 ease-in-out",
  ghost:
    "text-bodega-brick hover:bg-bodega-brick hover:bg-opacity-10 hover:scale-105 active:scale-95 transform transition-all duration-200 ease-in-out",
};

const buttonSizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

interface ExtendedButtonProps extends ButtonProps {
  href?: string;
  external?: boolean;
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ExtendedButtonProps
>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      onClick,
      disabled = false,
      loading = false,
      type = "button",
      className = "",
      href,
      external = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-accent font-medium rounded-lg transition-all duration-200 shadow focus:outline-none focus:ring-2 focus:ring-bodega-brick focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = buttonVariants[variant];
    const sizeClasses = buttonSizes[size];

    const combinedClasses =
      `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

    const content = (
      <>
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </>
    );

    if (href) {
      if (external) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={combinedClasses}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {content}
          </a>
        );
      }

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={href}
          className={combinedClasses}
          {...props}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={combinedClasses}
        onClick={onClick}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
