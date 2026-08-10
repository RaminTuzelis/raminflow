"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { LogOutIcon, UserIcon } from "lucide-react";

type AccountMenuProps = {
  userName: string;
  userTitle: string | null;
  logoutAction: () => Promise<void>;
};

export function AccountMenu({
  userName,
  userTitle,
  logoutAction,
}: AccountMenuProps) {
  const router = useRouter();

  const initials = userName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((namePart) => namePart.charAt(0))
    .join("")
    .toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:ring-2 hover:ring-primary/60 focus-visible:ring-primary/80 aria-expanded:ring-2 aria-expanded:ring-primary/80"
            aria-label="Open account menu"
          />
        }
      >
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="space-y-0.5">
            <span className="block text-sm text-foreground">{userName}</span>
            <span className="block font-normal">
              {userTitle || "Title not set"}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/account")}>
            <UserIcon />
            Account
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <form action={logoutAction}>
          <DropdownMenuItem
            render={<button type="submit" className="w-full" />}
            variant="destructive"
          >
            <LogOutIcon />
            Logout
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
