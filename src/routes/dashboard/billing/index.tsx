import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/billing/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/tenants/"!</div>
}
