import { Container } from '@/components/Container'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border/60 py-8">
      <Container className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm text-muted-foreground">
          &copy; {year} TaskFlux
        </p>
        <p className="m-0 text-xs text-muted-foreground">
          TanStack Start · Cloudflare · Better Auth
        </p>
      </Container>
    </footer>
  )
}
