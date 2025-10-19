import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type z from "zod"
import { loginUserSchema } from "@/pocketbase/schemas/users"
import { useMutation } from "@tanstack/react-query"
import { loginUserMutation } from "@/pocketbase/queries/users"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { AutoForm } from "./ui/autoform"
import { ZodProvider } from "@autoform/zod"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate({ from: "/" });
  const loginMutation = useMutation(loginUserMutation);

  return (
    <AutoForm schema={new ZodProvider(loginUserSchema)} onSubmit={(value) => {
      loginMutation.mutate(value, {
        onSuccess: () => {
          navigate({ to: "/dashboard/apartments" })
        }
      })
    }}>
      <Button>Login</Button>
    </AutoForm>
  )
}
