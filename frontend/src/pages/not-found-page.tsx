import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-sm font-semibold text-secondary-foreground">404</p>
      <h1 className="text-2xl font-semibold sm:text-3xl">Page not found</h1>
      <p className="text-muted-foreground">We couldn't find that page.</p>
      <Link
        to="/"
        className="mt-2 inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
