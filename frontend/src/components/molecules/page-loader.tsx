import { TreeLoader } from "@/components/atoms/tree-loader";

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
      <TreeLoader />
      <p className="text-sm">Loading...</p>
    </div>
  );
}
