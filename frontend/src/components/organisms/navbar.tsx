import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/atoms/logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/atoms/sheet";
import { NavLinks } from "@/components/molecules/nav-links";
import { UserMenu } from "@/components/molecules/user-menu";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <nav
        aria-label="Main"
        className="relative mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6"
      >
        <Link to="/" className="flex min-h-11 items-center gap-2 font-semibold">
          <Logo />
          <span className="text-lg">Rebalance</span>
        </Link>
        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <NavLinks />
        </div>
        <div className="ml-auto flex items-center gap-1">
          <UserMenu />
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="flex size-11 items-center justify-center rounded-md hover:bg-muted md:hidden"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Logo className="size-6" />
                  Rebalance
                </SheetTitle>
                <SheetDescription className="sr-only">Main navigation</SheetDescription>
              </SheetHeader>
              <div className="px-4">
                <NavLinks orientation="vertical" onNavigate={() => setIsMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
