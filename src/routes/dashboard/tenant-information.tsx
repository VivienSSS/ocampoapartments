import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/tenant-information')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/tenant-information"!</div>
}
