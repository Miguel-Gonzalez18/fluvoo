import { useMemo } from "react";
import type { PasswordStrength, PasswordStrengthResult } from "../types/registerTypes";

export function usePasswordStrength(password: string): PasswordStrengthResult {
  return useMemo(() => {
    if (!password) {
      return {
        strength: "weak",
        score: 0,
        feedback: "",
      };
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    Object.values(checks).forEach((check) => {
      if (check) score++;
    });

    let strength: PasswordStrength;
    let feedback: string;

    if (score <= 2) {
      strength = "weak";
      feedback = "Débil";
    } else if (score <= 4) {
      strength = "medium";
      feedback = "Media";
    } else {
      strength = "strong";
      feedback = "Fuerte";
    }

    return {
      strength,
      score,
      feedback,
    };
  }, [password]);
}
