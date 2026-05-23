import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('auth')
  const router = useRouter()

  return (
    <AuthForm
      mode="signup"
      title={t('signUp.title')}
      description={t('signUp.description')}
      submitLabel={t('signUp.submit')}
      alternate={{
        label: t('signUp.alternate'),
        to: '/signin',
      }}
      onSubmit={async ({ name, email, password }) => {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
        })
        if (result.error) {
          throw new Error(result.error.message ?? t('signUp.failed'))
        }
        await router.navigate({ to: '/tasks' })
      }}
    />
  )
}
