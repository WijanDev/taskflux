import { Link } from '@tanstack/react-router'
import { useState } from 'react'

type AuthFormProps = {
  mode: 'signin' | 'signup'
  title: string
  submitLabel: string
  alternate: { label: string; to: '/signin' | '/signup' }
  onSubmit: (data: {
    name: string
    email: string
    password: string
  }) => Promise<void>
}

export default function AuthForm({
  mode,
  title,
  submitLabel,
  alternate,
  onSubmit,
}: AuthFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      await onSubmit({ name, email, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in mx-auto max-w-md rounded-[2rem] px-6 py-8 sm:px-10">
        <p className="island-kicker mb-2">TaskFlux</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
          {title}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' ? (
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--sea-ink)]">
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                disabled={pending}
                className="rounded-xl border border-[var(--line)] bg-white/60 px-4 py-2.5 font-normal text-[var(--sea-ink)] outline-none focus:border-[rgba(50,143,151,0.5)]"
              />
            </label>
          ) : null}

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--sea-ink)]">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={pending}
              className="rounded-xl border border-[var(--line)] bg-white/60 px-4 py-2.5 font-normal text-[var(--sea-ink)] outline-none focus:border-[rgba(50,143,151,0.5)]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-[var(--sea-ink)]">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={
                mode === 'signup' ? 'new-password' : 'current-password'
              }
              disabled={pending}
              className="rounded-xl border border-[var(--line)] bg-white/60 px-4 py-2.5 font-normal text-[var(--sea-ink)] outline-none focus:border-[rgba(50,143,151,0.5)]"
            />
          </label>

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] transition hover:bg-[rgba(79,184,178,0.24)] disabled:opacity-50"
          >
            {pending ? 'Please wait…' : submitLabel}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--sea-ink-soft)]">
          {alternate.label}{' '}
          <Link to={alternate.to} className="font-semibold text-[var(--lagoon-deep)]">
            {alternate.to === '/signin' ? 'Sign in' : 'Sign up'}
          </Link>
        </p>
      </section>
    </main>
  )
}
