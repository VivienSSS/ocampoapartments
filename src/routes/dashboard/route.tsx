import { pb } from '@/pocketbase'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
    component: RouteComponent,
    beforeLoad: () => {
        if (!pb.authStore.isValid) throw redirect({ to: "/login" }) // for fail
    }
})

function RouteComponent() {
    return <div>
        <Outlet />
    </div>
}
