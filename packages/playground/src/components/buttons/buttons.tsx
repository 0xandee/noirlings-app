import React, { FormEvent, ReactNode, CSSProperties } from "react";

export const Button = ({
  type = "button",
  className,
  disabled,
  $primary,
  onClick,
  children,
  style,
  ...props
}: {
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  $primary?: boolean;
  onClick?: (e: FormEvent) => void;
  children?: React.ReactNode;
  style?: CSSProperties;
}) => {
  const buttonClasses = `${className} px-6 px-3 ${$primary ? "bg-[#00810d]" : "bg-black"
    } max-h-10 text-right text-base font-medium leading-none flex p-5 justify-center items-center ${disabled ? "opacity-50" : "opacity-100"
    } text-gray-7`;

  return (
    <button
      onClick={onClick}
      type={type}
      className={buttonClasses}
      tabIndex={-1}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export const BackButton = ({
  children,
  $primary,
  onClick,
  style,
}: {
  children?: ReactNode;
  $primary?: boolean;
  onClick?: (e: FormEvent) => void;
  style?: CSSProperties;
}) => (
  <Button onClick={onClick} $primary={$primary} className="bg-[#b31312]" style={style}>
    {children}
  </Button>
);
