import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  FLUVOO_LOGO_DISPLAY_HEIGHT,
  FLUVOO_LOGO_DISPLAY_WIDTH,
} from "@/modules/shared/config/logo";

interface FluvooLogoProps {
  variant?: "default" | "white";
  className?: string;
}

export function FluvooLogo({ variant = "default", className }: FluvooLogoProps) {
  return (
    <Image
      src={variant === "white" ? "/logo-White.svg" : "/logo.svg"}
      alt="Fluvoo"
      width={FLUVOO_LOGO_DISPLAY_WIDTH}
      height={FLUVOO_LOGO_DISPLAY_HEIGHT}
      className={cn("object-contain", className)}
    />
  );
}
