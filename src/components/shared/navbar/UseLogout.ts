'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

/**
 * Signs the user out through Better Auth, then re-renders the server tree so the
 * navbar drops back to its signed-out state.
 */
export const useLogout = () => {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const logout = async () => {
    if (isPending) return

    setIsPending(true)
    const loadingToast = toast.loading('Signing you out…')

    try {
      const { error: signOutError } = await authClient.signOut()

      toast.dismiss(loadingToast)

      if (signOutError) {
        toast.error('Could not sign you out', {
          description: signOutError.message ?? 'Please try again.',
        })
        return
      }

      toast.success('Signed out', {
        description: 'You can sign back in whenever you like.',
      })

      router.push('/')
      router.refresh()
    } catch {
      toast.dismiss(loadingToast)
      toast.error('Something went wrong', {
        description: 'We could not reach the server. Please try again.',
      })
    } finally {
      setIsPending(false)
    }
  }

  return { logout, isPending }
}
