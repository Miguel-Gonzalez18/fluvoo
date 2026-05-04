"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/modules/homePage/components/ui/button";
import { ProgressBar } from "./components/ProgressBar";
import { Step1ProfileSelection } from "./components/Step1ProfileSelection";
import { Step2FinancialInfo } from "./components/Step2FinancialInfo";
import { Step3GmailConnect } from "./components/Step3GmailConnect";
import { useOnboarding, TOTAL_STEPS } from "./hooks/useOnboarding";

export function OnboardingPage() {
  const {
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
  } = useOnboarding();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Image src="/logo.svg" alt="Fluvoo" width={100} height={100} className="w-[100px] h-auto object-contain" />
            <span className="text-sm text-muted-foreground">
              Paso {currentStep} de {TOTAL_STEPS}
            </span>
          </div>
          <div className="mt-4">
            <ProgressBar progress={progress} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {currentStep === 1 && (
          <Step1ProfileSelection
            selectedProfile={data.profileType}
            onSelect={selectProfile}
          />
        )}

        {currentStep === 2 && data.profileType && (
          <Step2FinancialInfo
            profileType={data.profileType}
            data={data}
            onUpdate={updateData}
            onAddLoan={addLoan}
            onUpdateLoan={updateLoan}
            onRemoveLoan={removeLoan}
            onAddInsurance={addInsurance}
            onUpdateInsurance={updateInsurance}
            onRemoveInsurance={removeInsurance}
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
                onClick={goToPrevious}
                disabled={currentStep === 1 || isLoading}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </Button>
              <Button
                onClick={goToNext}
                disabled={!canProceed || isLoading}
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
