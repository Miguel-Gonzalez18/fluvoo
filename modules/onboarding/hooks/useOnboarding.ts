"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  OnboardingData,
  INITIAL_ONBOARDING_DATA,
  ProfileType,
  Loan,
  HealthInsurance,
  FixedObligation,
  CreditCard,
} from "../types/onboarding";
import { completeOnboarding } from "../actions/onboarding-actions";
import { connectGmail } from "../actions/gmail-actions";
import { sileo } from "sileo";

export const TOTAL_STEPS = 3;

export interface UseOnboardingReturn {
  currentStep: number;
  data: OnboardingData;
  isLoading: boolean;
  canProceed: boolean;
  progress: number;
  goToNext: () => Promise<void>;
  goToPrevious: () => void;
  selectProfile: (profile: ProfileType) => void;
  updateData: (updates: Partial<OnboardingData>) => void;
  addLoan: (loan: Loan) => void;
  updateLoan: (loan: Loan) => void;
  removeLoan: (id: string) => void;
  addFixedObligation: (item: FixedObligation) => void;
  updateFixedObligation: (item: FixedObligation) => void;
  removeFixedObligation: (id: string) => void;
  addCreditCard: (item: CreditCard) => void;
  updateCreditCard: (item: CreditCard) => void;
  removeCreditCard: (id: string) => void;
  addInsurance: (insurance: HealthInsurance) => void;
  updateInsurance: (insurance: HealthInsurance) => void;
  removeInsurance: (id: string) => void;
  handleGmailConnect: () => Promise<void>;
  handleGmailSkip: () => Promise<void>;
}

interface UseOnboardingOptions {
  initialStep?: number;
  gmailErrorMessage?: string;
}

export function useOnboarding(
  options: UseOnboardingOptions = {}
): UseOnboardingReturn {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(options.initialStep ?? 1);
  const [data, setData] = useState<OnboardingData>(INITIAL_ONBOARDING_DATA);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (options.gmailErrorMessage) {
      sileo.error({ title: options.gmailErrorMessage });
    }
  }, [options.gmailErrorMessage]);

  const progress = useMemo(
    () => (currentStep / TOTAL_STEPS) * 100,
    [currentStep]
  );

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return data.profileType !== null;
      case 2:
        if (data.profileType === "employee") {
          return (data.monthlySalary ?? 0) > 0;
        }
        if (data.profileType === "freelancer") {
          return (data.averageMonthlyIncome ?? 0) > 0;
        }
        if (data.profileType === "business_owner") {
          return (data.businessMonthlyRevenue ?? 0) > 0;
        }
        return false;
      case 3:
        return true;
      default:
        return false;
    }
  }, [currentStep, data]);

  const finishOnboarding = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await completeOnboarding(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to complete onboarding");
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      sileo.error({ title: "No se pudo completar el onboarding" });
    } finally {
      setIsLoading(false);
    }
  }, [data, router]);

  const goToNext = useCallback(async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await finishOnboarding();
    }
  }, [currentStep, finishOnboarding]);

  const goToPrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const selectProfile = useCallback((profile: ProfileType) => {
    setData((prev) => ({ ...prev, profileType: profile }));
  }, []);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const addLoan = useCallback((loan: Loan) => {
    setData((prev) => ({ ...prev, loans: [...prev.loans, loan] }));
  }, []);

  const updateLoan = useCallback((loan: Loan) => {
    setData((prev) => ({
      ...prev,
      loans: prev.loans.map((l) => (l.id === loan.id ? loan : l)),
    }));
  }, []);

  const removeLoan = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      loans: prev.loans.filter((l) => l.id !== id),
    }));
  }, []);

  const addFixedObligation = useCallback((item: FixedObligation) => {
    setData((prev) => ({
      ...prev,
      fixedObligations: [...prev.fixedObligations, item],
    }));
  }, []);

  const updateFixedObligation = useCallback((item: FixedObligation) => {
    setData((prev) => ({
      ...prev,
      fixedObligations: prev.fixedObligations.map((o) =>
        o.id === item.id ? item : o
      ),
    }));
  }, []);

  const removeFixedObligation = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      fixedObligations: prev.fixedObligations.filter((o) => o.id !== id),
    }));
  }, []);

  const addCreditCard = useCallback((item: CreditCard) => {
    setData((prev) => ({
      ...prev,
      creditCards: [...prev.creditCards, item],
    }));
  }, []);

  const updateCreditCard = useCallback((item: CreditCard) => {
    setData((prev) => ({
      ...prev,
      creditCards: prev.creditCards.map((c) => (c.id === item.id ? item : c)),
    }));
  }, []);

  const removeCreditCard = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      creditCards: prev.creditCards.filter((c) => c.id !== id),
    }));
  }, []);

  const addInsurance = useCallback((insurance: HealthInsurance) => {
    setData((prev) => ({
      ...prev,
      healthInsurances: [...prev.healthInsurances, insurance],
    }));
  }, []);

  const updateInsurance = useCallback((insurance: HealthInsurance) => {
    setData((prev) => ({
      ...prev,
      healthInsurances: prev.healthInsurances.map((i) =>
        i.id === insurance.id ? insurance : i
      ),
    }));
  }, []);

  const removeInsurance = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      healthInsurances: prev.healthInsurances.filter((i) => i.id !== id),
    }));
  }, []);

  const handleGmailConnect = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await connectGmail(data);
      if (result.authUrl) {
        window.location.href = result.authUrl;
        return;
      }
      sileo.error({
        title: result.error || "No se pudo iniciar la conexión con Gmail",
      });
    } catch (error) {
      console.error("Error connecting Gmail:", error);
      sileo.error({ title: "Error al conectar Gmail" });
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const handleGmailSkip = useCallback(async () => {
    await finishOnboarding();
  }, [finishOnboarding]);

  return {
    currentStep,
    data,
    isLoading,
    canProceed,
    progress,
    goToNext,
    goToPrevious,
    selectProfile,
    updateData,
    addLoan,
    updateLoan,
    removeLoan,
    addFixedObligation,
    updateFixedObligation,
    removeFixedObligation,
    addCreditCard,
    updateCreditCard,
    removeCreditCard,
    addInsurance,
    updateInsurance,
    removeInsurance,
    handleGmailConnect,
    handleGmailSkip,
  };
}
