import { useNavigate, useSearch } from "@tanstack/react-router";

import { PlaygroundSetupForm } from "@/components/organisms/playground-setup-form";
import { SetupPreviewTree } from "@/components/organisms/setup-preview-tree";
import { newSeed, playgroundSearchSchema, toSearch, toSetup } from "@/lib/playground/setup";

export function PlaygroundSetupPage() {
  const answers = useSearch({ from: "/_app/playground/" });
  const navigate = useNavigate();

  const handleAnswer = (field: "topic" | "traversal" | "explore" | "start", value: string) => {
    const next = playgroundSearchSchema.parse({ ...answers, [field]: value });
    if (field === "topic" && value !== answers.topic) next.traversal = undefined;
    if (field === "start" && next.seed === undefined) next.seed = newSeed();
    void navigate({ to: "/playground", search: next, replace: true });
  };

  const handleStart = () => {
    const setup = toSetup(answers);
    if (setup) void navigate({ to: "/playground/play", search: toSearch(setup) });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Playground</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Pick what to play with and we'll grow a tree for you.
        </p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-10">
        <SetupPreviewTree answers={answers} className="lg:order-2 lg:sticky lg:top-6" />
        <PlaygroundSetupForm answers={answers} onAnswer={handleAnswer} onStart={handleStart} />
      </div>
    </div>
  );
}
