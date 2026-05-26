import { QueryClientProvider } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { NotFound } from '@/components/NotFound'
import { getQueryClient } from '@/lib/query-client'
import { routeTree } from './routeTree.gen'

export type RouterContext = {
  queryClient: QueryClient
}

export function getRouter() {
  const queryClient = getQueryClient()

  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
    },
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  })

  return router
}

export type AppRouter = Awaited<ReturnType<typeof getRouter>>
