import { Link } from "@tanstack/react-router";

import { EmptyState } from "@/components/molecules/empty-state";
import { placeholderUser } from "@/lib/placeholder-user";

export function DashboardPage() {
  const firstName = placeholderUser.name.split(" ")[0];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back, {firstName}.</p>
      </div>
      <section aria-labelledby="continue-learning" className="flex flex-col gap-3">
        <h2 id="continue-learning" className="text-lg font-semibold">
          Continue learning
        </h2>
        <EmptyState
          title="No courses started yet"
          description="Pick a tree and start your first lesson."
          action={
            <Link
              to="/courses"
              className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Browse courses
            </Link>
          }
        />
      </section>
      <section aria-labelledby="your-progress" className="flex flex-col gap-3">
        <h2 id="your-progress" className="text-lg font-semibold">
          Your progress
        </h2>
        <EmptyState
          title="Nothing to show yet"
          description="Your progress shows up here once you finish a lesson."
        />
      </section>
    </div>
  );
}
