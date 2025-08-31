import { createFileRoute } from '@tanstack/react-router'
import LoadingComponent from './-loading'

export const Route = createFileRoute('/dashboard/properties/')({
    component: RouteComponent,
    pendingComponent: LoadingComponent
})

function RouteComponent() {
    return <div>Hello "/dashboard/properties/"!</div>
}
