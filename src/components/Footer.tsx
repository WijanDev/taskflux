import { Container } from '@/components/Container'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="shrink-0 border-t border-border/60 py-8">
      <Container
        fluid
        className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"
      >
        <p className="m-0 text-sm text-muted-foreground">
          &copy; {year} TaskFlux
        </p>
        <p className="m-0 text-xs text-muted-foreground sm:text-right">
          TanStack Start · Cloudflare · Better Auth
        </p>
      </Container>
    </footer>
  )
}
