"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/homePage/components/ui/button";
import { ProgressBar } from "./components/ProgressBar";
import { Step1ProfileSelection } from "./components/Step1ProfileSelection";
import { Step2FinancialInfo } from "./components/Step2FinancialInfo";
import { Step3GmailConnect } from "./components/Step3GmailConnect";
import { OnboardingData, INITIAL_ONBOARDING_DATA, ProfileType } from "./types/onboarding";
import { completeOnboarding as completeOnboardingAction, connectGmail } from "./actions/onboarding-actions";

export function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_ONBOARDING_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 3;

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - complete onboarding
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProfileSelect = (profile: ProfileType) => {
    setData((prev) => ({ ...prev, profileType: profile }));
  };

  const handleDataUpdate = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      // Call server action to save onboarding data
      const result = await completeOnboardingAction(data);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to complete onboarding");
      }
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // TODO: Show error toast using sileo toaster
      // toast.error("No se pudo completar el onboarding. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGmailConnect = async () => {
    try {
      // Initiate Gmail OAuth flow via server action
      const result = await connectGmail();
      
      if (result.authUrl) {
        // Redirect to Google OAuth
        window.location.href = result.authUrl;
        return;
      }
      
      // If no authUrl, just mark as connected and complete
      setData((prev) => ({ ...prev, gmailConnected: true }));
      await completeOnboarding();
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      // TODO: Show error toast
    }
  };

  const handleGmailSkip = async () => {
    // Skip Gmail connection but still complete onboarding
    await completeOnboarding();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.profileType !== null;
      case 2:
        // Require at least income info based on profile type
        if (data.profileType === 'employee') {
          return data.monthlySalary && data.monthlySalary > 0;
        } else if (data.profileType === 'freelancer') {
          return data.averageMonthlyIncome && data.averageMonthlyIncome > 0;
        } else if (data.profileType === 'business_owner') {
          return data.businessMonthlyRevenue && data.businessMonthlyRevenue > 0;
        }
        return false;
      case 3:
        return true; // Can always proceed from step 3
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="font-heading text-xl font-semibold">Fluvoo</span>
            <span className="text-sm text-muted-foreground">
              Paso {currentStep} de {totalSteps}
            </span>
          </div>
          <div className="mt-4">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {currentStep === 1 && (
          <Step1ProfileSelection
            selectedProfile={data.profileType}
            onSelect={handleProfileSelect}
          />
        )}

        {currentStep === 2 && data.profileType && (
          <Step2FinancialInfo
            profileType={data.profileType}
            data={data}
            onUpdate={handleDataUpdate}
          />
        )}

        {currentStep === 3 && (
          <Step3GmailConnect
            onConnect={handleGmailConnect}
            onSkip={handleGmailSkip}
          />
        )}
      </main>

      {/* Footer Navigation */}
      {currentStep < 3 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-background border-t">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1 || isLoading}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="gap-2 bg-foreground hover:bg-foreground/90"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </footer>
      )}

      {/* Spacer for fixed footer */}
      {currentStep < 3 && <div className="h-20" />}
    </div>
  );
}
