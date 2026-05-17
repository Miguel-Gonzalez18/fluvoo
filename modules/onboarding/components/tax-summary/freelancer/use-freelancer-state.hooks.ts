"use client";

import { useState, useCallback } from "react";
import { FreelancerState } from "./freelancer-tax.types";

interface UseFreelancerStateReturn extends FreelancerState {
  toggleTSS: () => void;
  toggleRegistradoDGII: () => void;
  toggleClientesRetienen: () => void;
  setTssVoluntaria: (value: boolean) => void;
  setRegistradoDGII: (value: boolean) => void;
  setClientesRetienen: (value: boolean) => void;
}

export function useFreelancerState(): UseFreelancerStateReturn {
  const [tssVoluntaria, setTssVoluntaria] = useState(false);
  const [registradoDGII, setRegistradoDGII] = useState(false);
  const [clientesRetienen, setClientesRetienen] = useState(false);

  const toggleTSS = useCallback(() => setTssVoluntaria((prev) => !prev), []);
  const toggleRegistradoDGII = useCallback(() => setRegistradoDGII((prev) => !prev), []);
  const toggleClientesRetienen = useCallback(() => setClientesRetienen((prev) => !prev), []);

  return {
    tssVoluntaria,
    registradoDGII,
    clientesRetienen,
    toggleTSS,
    toggleRegistradoDGII,
    toggleClientesRetienen,
    setTssVoluntaria,
    setRegistradoDGII,
    setClientesRetienen,
  };
}
