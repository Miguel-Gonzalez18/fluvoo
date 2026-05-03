"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex shrink-0 overflow-hidden rounded-full size-10",
      className
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("aspect-square size-full", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center rounded-full bg-neutral-100",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

const AvatarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center -space-x-3", className)}
    {...props}
  />
));
AvatarGroup.displayName = "AvatarGroup";

const AvatarGroupCount = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex size-10 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-600",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
AvatarGroupCount.displayName = "AvatarGroupCount";

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount };
