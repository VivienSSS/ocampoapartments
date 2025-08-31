import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/announcements/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/apartments/"!</div>
}

