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
import { placeholderUser } from "@/lib/placeholder-user";

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        className="flex size-11 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Avatar className="size-9">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-semibold">
            {placeholderUser.initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate">{placeholderUser.name}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {placeholderUser.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <User />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
