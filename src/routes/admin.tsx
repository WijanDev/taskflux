import { createFileRoute, Outlet } from '@tanstack/react-router'

import { ensureAdminRouteAccess } from '@/lib/admin-route'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => ensureAdminRouteAccess('/admin/users'),
  component: AdminLayout,
})

function AdminLayout() {
  return <Outlet />
}
