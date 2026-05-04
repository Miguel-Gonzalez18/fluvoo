// modules/auth/actions/authActions.ts
'use server'

import { createClient } from '@/src/lib/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
    // Sin emailRedirectTo porque la confirmación no es requerida
  })
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  redirect('/dashboard') // Entra directo, sin esperar email
}

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  redirect('/login')
}