import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'

import AuthForm from '#/components/AuthForm'
import { authClient } from '#/lib/auth-client'
import { getSession } from '#/server/session'

export const Route = createFileRoute('/signin')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : '/tasks',
  }),
  beforeLoad: async () => {
    const session = await getSession()
    if (session?.user) {
      throw redirect({ to: '/tasks' })
    }
  },
  component: SignInPage,
})

function SignInPage() {
  const router = useRouter()
  const { redirect: redirectTo } = Route.useSearch()

  return (
    <AuthForm
      mode="signin"
      title="Sign in"
      submitLabel="Sign in"
      alternate={{
        label: "Don't have an account?",
        to: '/signup',
      }}
      onSubmit={async ({ email, password }) => {
        const result = await authClient.signIn.email({
          email,
          password,
        })
        if (result.error) {
          throw new Error(result.error.message ?? 'Sign in failed')
        }
        await router.navigate({ to: redirectTo })
      }}
    />
  )
}
