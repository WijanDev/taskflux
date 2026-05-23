import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { NotFound } from '@/components/NotFound'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}
