import { Link } from '@tanstack/react-router'
import type { SubmitEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PageShell } from '@/components/PageShell'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AuthFormProps = Readonly<{
  mode: 'signin' | 'signup'
  title: string
  description: string
  submitLabel: string
  alternate: { label: string; to: '/signin' | '/signup' }
  onSubmit: (data: {
    name: string
    email: string
    password: string
  }) => Promise<void>
}>

export default function AuthForm({
  mode,
  title,
  description,
  submitLabel,
  alternate,
  onSubmit,
}: AuthFormProps) {
  const { t } = useTranslation(['auth', 'common', 'errors'])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      await onSubmit({ name, email, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors:generic'))
    } finally {
      setPending(false)
    }
  }

  return (
    <PageShell narrow>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' ? (
              <div className="grid gap-2">
                <Label htmlFor="name">{t('common:labels.name')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  disabled={pending}
                />
              </div>
            ) : null}

            <div className="grid gap-2">
              <Label htmlFor="email">{t('common:labels.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={pending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">{t('common:labels.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={
                  mode === 'signup' ? 'new-password' : 'current-password'
                }
                disabled={pending}
              />
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? t('common:actions.pleaseWait') : submitLabel}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {alternate.label}{' '}
            <Link
              to={alternate.to}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {alternate.to === '/signin'
                ? t('signIn.submit')
                : t('signUp.submit')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </PageShell>
  )
}
