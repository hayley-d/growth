import { Link } from "@tanstack/react-router";

export function LessonPlaceholderPage() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold sm:text-3xl">Lesson</h1>
      <p className="text-muted-foreground">The lesson page is on the way.</p>
      <Link to="/learn" className="inline-flex min-h-11 items-center text-sm font-medium underline">
        Back to Learn
      </Link>
    </div>
  );
}
