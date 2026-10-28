import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";

import { signInRequestSchema } from "@shared/schemas/auth";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";
import { useSignInMutation } from "@/lib/mutations";

export function LoginPage() {
  const navigate = useNavigate();
  const signInMutation = useSignInMutation();

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: signInRequestSchema },
    onSubmit: ({ value }) => {
      signInMutation.mutate(value, {
        onSuccess: () => navigate({ to: "/" }),
      });
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold">Log in</h1>
        <p className="mt-1 text-muted-foreground">Welcome back to Growth.</p>
      </div>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!signInMutation.isPending) form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => (
            <FormField
              id={field.name}
              label="Email"
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              error={field.state.meta.errors[0]?.message}
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <FormField
              id={field.name}
              label="Password"
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              error={field.state.meta.errors[0]?.message}
            />
          )}
        </form.Field>
        {signInMutation.isError && (
          <p className="text-sm text-destructive">{signInMutation.error.message}</p>
        )}
        <Button type="submit" disabled={signInMutation.isPending} className="min-h-11">
          Log in
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/sign-up" className="font-medium text-foreground underline underline-offset-4">
          Sign up
        </Link>
      </p>
    </div>
  );
}
