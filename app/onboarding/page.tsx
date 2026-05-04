import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/server";
import { OnboardingPage } from "@/modules/onboarding/OnboardingPage";

export const metadata: Metadata = {
  title: "Completa tu perfil | Fluvoo",
  description: "Personaliza tu experiencia financiera con Fluvoo.",
};

export default async function OnboardingRoute() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login");

  const { data: userData } = await supabase
    .from('users')
    .select('onboarding_completed')
    .eq('id', user!.id)
    .single();

  if (userData?.onboarding_completed) redirect('/dashboard');

  return <OnboardingPage />;
}
