import { redirect } from 'next/navigation'
import { createClient } from '@/src/lib/server'

const PROFILE_HOME: Record<string, string> = {
  employee: '/employee/home',
  freelancer: '/freelancer/home',
  business_owner: '/business/home',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('profile_type, onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) redirect('/onboarding')

  const homePath = profile.profile_type
    ? PROFILE_HOME[profile.profile_type]
    : undefined

  if (homePath) redirect(homePath)

  // Onboarding marked complete but profile_type missing — resume setup instead of looping
  redirect('/onboarding?resume=profile')
}
