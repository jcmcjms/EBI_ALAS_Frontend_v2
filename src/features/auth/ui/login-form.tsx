import { useState } from "react"
import { cn } from "cn"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"

import { Button } from "@/shared/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/shared/ui/input-group"

import { loginRequestSchema, type LoginRequest } from "../api/auth-types"
import { useLogin } from "../api/auth-mutations"
import { useAuth } from "@/app/providers"

export function LoginForm() {
  const { refetch } = useAuth()
  const loginMutation = useLogin()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: { username: "", password: "", rememberMe: false },
  })

  const onSubmit = async (data: LoginRequest) => {
    try {
      await loginMutation.mutateAsync(data)
      await refetch()
      // Navigate to dashboard after successful login
      navigate({ to: "/dashboard" })
    } catch {
      // Generic message: never confirm which credential was wrong (user enumeration).
      toast.error("Sign in failed", {
        description: "Invalid username or password. Please try again.",
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6")}
      noValidate
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your credentials to access the application
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            autoComplete="username"
            {...register("username")}
            disabled={loginMutation.isPending}
            aria-invalid={!!errors.username}
            className="bg-background"
          />
          {errors.username && (
            <FieldDescription className="text-destructive" role="alert">
              {errors.username.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          <InputGroup>
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password")}
              disabled={loginMutation.isPending}
              aria-invalid={!!errors.password}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                disabled={loginMutation.isPending}
              >
                {showPassword ? (
                  <EyeSlashIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          {errors.password && (
            <FieldDescription className="text-destructive" role="alert">
              {errors.password.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}