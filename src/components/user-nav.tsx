import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { MouseEventHandler } from "react";
import { DialogClose } from "./ui/dialog";
import { CircleUser } from "lucide-react";

export function UserNav({
  logout,
  user,
}: {
  logout: MouseEventHandler;
  user: any;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src="/avatars/01.png" alt="@shadcn" /> */}
            <AvatarFallback>
              <CircleUser />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">
              {user.username}
            </p>
            {/* <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p> */}
          </div>
          <DropdownMenuSeparator />
          
        </DropdownMenuLabel>
        <DropdownMenuItem className="ml-0">
            <Link href={"/admin/dashboard"}>Dashboard</Link>
          </DropdownMenuItem>
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/user/profile"}>Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="bg-red-200 cursor-pointer"
          onClick={logout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
