import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/courses", label: "Courses" },
] as const;

type NavLinksProperties = {
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
};

export function NavLinks({ orientation = "horizontal", onNavigate }: NavLinksProperties) {
  return (
    <ul className={cn("flex gap-1", orientation === "vertical" && "flex-col")}>
      {links.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            onClick={onNavigate}
            activeOptions={{ exact: true }}
            className="group flex min-h-11 items-center px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
            activeProps={{ "aria-current": "page" }}
          >
            <span className="relative isolate after:absolute after:inset-x-[-0.15em] after:bottom-0 after:-z-10 after:h-[45%] after:origin-left after:scale-x-0 after:rounded-sm after:bg-primary after:opacity-60 after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 group-data-[status=active]:after:scale-x-100 group-data-[status=active]:after:opacity-100 dark:after:opacity-25 dark:group-data-[status=active]:after:opacity-40 motion-reduce:after:transition-none">
              {link.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
