import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import type { RouterContext } from '@/router'
import type { ReactNode } from 'react'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import { NotFound } from '@/components/NotFound'
import { Toaster } from '@/components/ui/sonner'
import { AppPreferencesProvider } from '@/providers/AppPreferencesProvider'
import Footer from '../components/Footer'
import Header from '../components/Header'

import { getAppPreferences } from '#/server/app-preferences'

import { LOCALE_INIT_SCRIPT } from '@/lib/locale-init-script'
import { THEME_INIT_SCRIPT } from '@/lib/theme-init-script'

import appCss from '../styles.css?url'

export const Route = createRootRouteWithContext<RouterContext>()({
  loader: () => getAppPreferences(),
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TaskFlux',
      },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootLayout() {
  const preferences = Route.useLoaderData()

  return (
    <AppPreferencesProvider initial={preferences}>
      <Header />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <NuqsAdapter>
          <Outlet />
        </NuqsAdapter>
      </div>
      <Footer />
      <Toaster richColors closeButton position="top-right" />
    </AppPreferencesProvider>
  )
}

type RootDocumentProps = Readonly<{
  children: ReactNode
}>

function RootDocument({ children }: RootDocumentProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: LOCALE_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="flex h-dvh flex-col overflow-hidden [overflow-wrap:anywhere]">
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
