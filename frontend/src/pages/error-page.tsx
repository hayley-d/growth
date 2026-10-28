import { useRouter } from "@tanstack/react-router";

export function ErrorPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <h1 className="text-2xl font-semibold sm:text-3xl">Something went wrong</h1>
      <p className="max-w-sm text-muted-foreground">
        This page hit a problem. Try again, and if it keeps happening, reload the app.
      </p>
      <button
        type="button"
        onClick={() => router.invalidate()}
        className="mt-2 inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        Try again
      </button>
    </div>
  );
}
