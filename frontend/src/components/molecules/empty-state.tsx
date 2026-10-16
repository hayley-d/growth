import type { ReactNode } from "react";

type EmptyStateProperties = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProperties) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-10 text-center">
      <h3 className="font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
