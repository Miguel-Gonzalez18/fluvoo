import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/server";
import { OnboardingPage } from "@/modules/onboarding/OnboardingPage";

export const metadata: Metadata = {
  title: "Completa tu perfil | Fluvoo",
  description: "Personaliza tu experiencia financiera con Fluvoo.",
};

interface OnboardingRouteProps {
  searchParams: Promise<{ gmail?: string; message?: string; resume?: string }>;
}

export default async function OnboardingRoute({ searchParams }: OnboardingRouteProps) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const params = await searchParams;

  const { data: userData } = await supabase
    .from("users")
    .select("onboarding_completed, onboarding_step")
    .eq("id", user.id)
    .single();

  if (userData?.onboarding_completed && params.resume !== "profile") {
    redirect("/dashboard");
  }

  const initialStep = Math.min(Math.max(userData?.onboarding_step ?? 1, 1), 3);
  const gmailErrorMessage =
    params.gmail === "error" ? params.message ?? "No se pudo conectar Gmail" : undefined;

  return (
    <OnboardingPage initialStep={initialStep} gmailErrorMessage={gmailErrorMessage} />
  );
}
