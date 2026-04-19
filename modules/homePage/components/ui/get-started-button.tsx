import * as React from "react";
import { Button, buttonVariants } from "@/modules/homePage/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";

interface GetStartedButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  label?: string;
  icon?: React.ReactNode;
  id?: string;
}

export function GetStartedButton({
  label = "Comenzar",
  icon = <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />,
  variant,
  size = "lg",
  className,
  id,
  ...props
}: GetStartedButtonProps) {
  return (
    <Button
      id={id}
      variant={variant}
      size={size}
      className={`group relative overflow-hidden cursor-pointer${className ? ` ${className}` : ""}`}
      {...props}
    >
      <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">
        {label}
      </span>
      <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-primary-foreground">
        {icon}
      </i>
    </Button>
  );
}
