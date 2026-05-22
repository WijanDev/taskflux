import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'

import AuthForm from '#/components/AuthForm'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/signup')({
  beforeLoad: async () => {
    const { getSession } = await import('#/server/session')
    const session = await getSession()
    if (session?.user) {
      throw redirect({ to: '/tasks' })
    }
  },
  component: SignUpPage,
})

function SignUpPage() {
  const router = useRouter()

  return (
    <AuthForm
      mode="signup"
      title="Create account"
      description="Get started with TaskFlux in a few seconds."
      submitLabel="Create account"
      alternate={{
        label: 'Already have an account?',
        to: '/signin',
      }}
      onSubmit={async ({ name, email, password }) => {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
        })
        if (result.error) {
          throw new Error(result.error.message ?? 'Sign up failed')
        }
        await router.navigate({ to: '/tasks' })
      }}
    />
  )
}
