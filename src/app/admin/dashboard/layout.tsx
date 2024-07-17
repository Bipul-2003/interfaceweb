
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Home, Files, Settings, FolderCog, Users2, FileMinus } from "lucide-react";
import Link from "next/link";
import React, { ReactNode } from "react";

export default function AdminDashbord({children}:{children:ReactNode}) {
  // const active = "bg-accent text-accent-foreground";
  return (
    <div className="flex min-h-screen w-full flex-col ">
      <aside className="fixed inset-y-0 left-0 hidden w-14 flex-col bg-background sm:flex border-r">
        <TooltipProvider>
        
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5 mt-16">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"/admin/dashboard"}
                  className="flex h-9 w-9 items-center justify-center rounded-lg  bg-accent text-accent-foregroundtransition-colors hover:text-foreground md:h-8 md:w-8">
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/dashboard/enrollments"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                  <Files className="h-5 w-5" />
                  <span className="sr-only">Enrollments</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Enrollments</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/dashboard/users"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Users</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Users</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/dashboard/sessions"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                  <FolderCog className="h-5 w-5" />
                  <span className="sr-only">Sessions</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Sessions</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/dashboard/courses"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                  <FileMinus className="h-5 w-5" />
                  <span className="sr-only">Courses</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Courses</TooltipContent>
            </Tooltip>
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>
      </aside>
      <main className="py-20 md:pl-4">
        {/* <DashbordHome /> */}
        {children}
      </main>
    </div>
  );
}
