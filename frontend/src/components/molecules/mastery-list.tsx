import { MasteryMeter } from "@/components/molecules/mastery-meter";

type MasteryListProperties = {
  lessons: readonly { id: string; title: string; mastery: number }[];
};

export function MasteryList({ lessons }: MasteryListProperties) {
  return (
    <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {lessons.map((lesson) => (
        <li key={lesson.id} className="flex flex-col gap-2">
          <p className="font-medium">{lesson.title}</p>
          <MasteryMeter mastery={lesson.mastery} />
        </li>
      ))}
    </ul>
  );
}
