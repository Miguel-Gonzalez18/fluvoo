// modules/auth/actions/authActions.ts
'use server'

import { createClient } from '@/src/lib/server'
import { revalidatePath } from 'next/cache'

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return { success: true as const }
}

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) return { error: error.message }

  if (!data.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (signInError) {
      return {
        error:
          "Cuenta creada. Revisa tu correo para confirmarla antes de continuar.",
      }
    }
  }

  revalidatePath('/', 'layout')
  return { success: true as const }
}

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}