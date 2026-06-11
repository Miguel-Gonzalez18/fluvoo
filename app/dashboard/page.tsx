import { redirect } from 'next/navigation'
import { getProfileHomePath } from '@/modules/dashboard/shared/profile-routes'
import { createClient } from '@/src/lib/server'

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

  const homePath = getProfileHomePath(profile.profile_type)

  if (homePath) redirect(homePath)

  // Onboarding marked complete but profile_type missing — resume setup instead of looping
  redirect('/onboarding?resume=profile')
}
