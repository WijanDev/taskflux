import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'
import { NotFound } from '@/components/NotFound'
import { Toaster } from '@/components/ui/sonner'
import { AppPreferencesProvider } from '@/providers/AppPreferencesProvider'
import Footer from '../components/Footer'
import Header from '../components/Header'

import { getAppPreferences } from '#/server/app-preferences'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

const LOCALE_INIT_SCRIPT = `(function(){try{var match=document.cookie.match(/taskflux_locale=([^;]+)/);var fromCookie=match&&match[1];var stored=window.localStorage.getItem('taskflux-locale');var locale=(stored==='en'||stored==='es')?stored:(fromCookie==='en'||fromCookie==='es'?fromCookie:'en');document.documentElement.lang=locale}catch(e){}})();`

export const Route = createRootRoute({
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

function RootDocument({ children }: { children: React.ReactNode }) {
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
