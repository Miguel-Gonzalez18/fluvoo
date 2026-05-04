"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  OnboardingData,
  INITIAL_ONBOARDING_DATA,
  ProfileType,
  Loan,
  HealthInsurance,
} from "../types/onboarding";
import { completeOnboarding, connectGmail } from "../actions/onboarding-actions";

export const TOTAL_STEPS = 3;

export interface UseOnboardingReturn {
  // State
  currentStep: number;
  data: OnboardingData;
  isLoading: boolean;

  // Computed
  canProceed: boolean;
  progress: number;

  // Navigation
  goToNext: () => Promise<void>;
  goToPrevious: () => void;

  // Data updates
  selectProfile: (profile: ProfileType) => void;
  updateData: (updates: Partial<OnboardingData>) => void;

  // Entity management
  addLoan: (loan: Loan) => void;
  updateLoan: (loan: Loan) => void;
  removeLoan: (id: string) => void;
  addInsurance: (insurance: HealthInsurance) => void;
  updateInsurance: (insurance: HealthInsurance) => void;
  removeInsurance: (id: string) => void;

  // Gmail
  handleGmailConnect: () => Promise<void>;
  handleGmailSkip: () => Promise<void>;
}

export function useOnboarding(): UseOnboardingReturn {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_ONBOARDING_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate progress percentage
  const progress = useMemo(
    () => (currentStep / TOTAL_STEPS) * 100,
    [currentStep]
  );

  // Check if user can proceed to next step
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return data.profileType !== null;
      case 2:
        if (data.profileType === "employee") {
          return (data.monthlySalary ?? 0) > 0;
        } else if (data.profileType === "freelancer") {
          return (data.averageMonthlyIncome ?? 0) > 0;
        } else if (data.profileType === "business_owner") {
          return (data.businessMonthlyRevenue ?? 0) > 0;
        }
        return false;
      case 3:
        return true;
      default:
        return false;
    }
  }, [currentStep, data]);

  // Complete onboarding - defined early for use in other callbacks
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
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  }, [data, router]);

  // Navigate to next step or complete
  const goToNext = useCallback(async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await finishOnboarding();
    }
  }, [currentStep, finishOnboarding]);

  // Navigate to previous step
  const goToPrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Select profile type
  const selectProfile = useCallback((profile: ProfileType) => {
    setData((prev) => ({ ...prev, profileType: profile }));
  }, []);

  // Update onboarding data
  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Loan management
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

  // Insurance management
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

  // Gmail connection
  const handleGmailConnect = useCallback(async () => {
    try {
      const result = await connectGmail();
      if (result.authUrl) {
        window.location.href = result.authUrl;
        return;
      }
      setData((prev) => ({ ...prev, gmailConnected: true }));
      await finishOnboarding();
    } catch (error) {
      console.error("Error connecting Gmail:", error);
      // TODO: Show error toast
    }
  }, [finishOnboarding]);

  // Skip Gmail
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
    addInsurance,
    updateInsurance,
    removeInsurance,
    handleGmailConnect,
    handleGmailSkip,
  };
}
