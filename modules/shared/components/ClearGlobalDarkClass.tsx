"use client";

import { useLayoutEffect } from "react";

export function ClearGlobalDarkClass() {
  useLayoutEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return null;
}
