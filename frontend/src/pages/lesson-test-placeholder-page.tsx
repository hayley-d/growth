import { Link } from "@tanstack/react-router";

export function LessonTestPlaceholderPage() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold sm:text-3xl">Test</h1>
      <p className="text-muted-foreground">The test page is on the way.</p>
      <Link to="/learn" className="inline-flex min-h-11 items-center text-sm font-medium underline">
        Back to Learn
      </Link>
    </div>
  );
}
