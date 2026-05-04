import { redirect } from 'next/navigation'
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

  if (profile?.profile_type === 'employee') redirect('/employee/home')
  if (profile?.profile_type === 'freelancer') redirect('/freelancer/home')
  if (profile?.profile_type === 'business_owner') redirect('/business/home')

  redirect('/onboarding')
}
