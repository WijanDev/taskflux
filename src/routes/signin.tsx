import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import AuthForm from '#/components/AuthForm'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/signin')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : '/tasks',
  }),
  beforeLoad: async () => {
    const { getSession } = await import('#/server/session')
    const session = await getSession()
    if (session?.user) {
      throw redirect({ to: '/tasks' })
    }
  },
  component: SignInPage,
})

function SignInPage() {
  const { t } = useTranslation('auth')
  const router = useRouter()
  const { redirect: redirectTo } = Route.useSearch()

  return (
    <AuthForm
      mode="signin"
      title={t('signIn.title')}
      description={t('signIn.description')}
      submitLabel={t('signIn.submit')}
      alternate={{
        label: t('signIn.alternate'),
        to: '/signup',
      }}
      onSubmit={async ({ email, password }) => {
        const result = await authClient.signIn.email({
          email,
          password,
        })
        if (result.error) {
          throw new Error(result.error.message ?? t('signIn.failed'))
        }
        await router.navigate({ to: redirectTo })
      }}
    />
  )
}
