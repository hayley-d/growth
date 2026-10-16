import { EmptyState } from "@/components/molecules/empty-state";

export function CoursesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Courses</h1>
        <p className="mt-1 text-muted-foreground">Learn one tree at a time.</p>
      </div>
      <EmptyState title="No courses yet" description="Courses are on the way. Check back soon." />
    </div>
  );
}
