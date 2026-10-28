import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/atoms/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { useSignOutMutation } from "@/lib/mutations";
import { useSessionQuery } from "@/lib/queries";

const toInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function UserMenu() {
  const navigate = useNavigate();
  const session = useSessionQuery();
  const signOutMutation = useSignOutMutation();

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => navigate({ to: "/login" }),
    });
  };

  if (!session.data) return null;
  const { name, email } = session.data.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="flex size-11 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Avatar className="size-9">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-semibold">
            {toInitials(name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate">{name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <User />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={signOutMutation.isPending}
          onSelect={(event) => {
            event.preventDefault();
            handleSignOut();
          }}
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
        {signOutMutation.isError && (
          <p className="px-2 py-1.5 text-xs text-destructive">{signOutMutation.error.message}</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
