import { Check, LoaderCircle, TriangleAlert } from "lucide-react";

type SaveStatusProperties = {
  status: "idle" | "pending" | "success" | "error";
  errorMessage?: string;
};

export function SaveStatus({ status, errorMessage }: SaveStatusProperties) {
  return (
    <p role="status" className="flex min-h-6 items-center gap-1.5 text-sm text-muted-foreground">
      {status === "pending" && (
        <>
          <LoaderCircle aria-hidden className="size-4 animate-spin motion-reduce:animate-none" />
          Saving…
        </>
      )}
      {status === "success" && (
        <>
          <Check aria-hidden className="size-4" />
          Saved
        </>
      )}
      {status === "error" && (
        <span className="flex items-center gap-1.5 text-destructive">
          <TriangleAlert aria-hidden className="size-4 shrink-0" />
          {errorMessage}
        </span>
      )}
    </p>
  );
}
