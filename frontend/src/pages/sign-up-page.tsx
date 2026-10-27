import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";

import { type SignUpRequest, signUpRequestSchema } from "@shared/schemas/auth";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";
import { useSignUpMutation } from "@/lib/mutations";

const defaultValues: SignUpRequest = { email: "", password: "", name: "" };

export function SignUpPage() {
  const navigate = useNavigate();
  const signUpMutation = useSignUpMutation();

  const form = useForm({
    defaultValues,
    validators: { onChange: signUpRequestSchema },
    onSubmit: ({ value }) => {
      signUpMutation.mutate(value, {
        onSuccess: () => navigate({ to: "/" }),
      });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Sign up</h1>
        <p className="mt-1 text-muted-foreground">Create your Growth account.</p>
      </div>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!signUpMutation.isPending) form.handleSubmit();
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
        <form.Field name="name">
          {(field) => (
            <FormField
              id={field.name}
              label="Display name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              error={field.state.meta.errors[0]?.message}
            />
          )}
        </form.Field>
        {signUpMutation.isError && (
          <p className="text-sm text-destructive">{signUpMutation.error.message}</p>
        )}
        <Button type="submit" disabled={signUpMutation.isPending} className="min-h-11">
          Sign up
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
          Log in
        </Link>
      </p>
    </div>
  );
}
