'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CircleUser } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserNav({
  logout,
  user,
}: {
  logout: () => void
  user: { username: string, role:number }
}) {
  const [open, setOpen] = useState(false)

  const handleSelect = (callback?: () => void) => {
    setOpen(false)
    if (callback) {
      callback()
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
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
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
       {user.role==1 && <DropdownMenuItem asChild>
          <Link href="/admin/dashboard" onClick={() => handleSelect()}>
            Dashboard
          </Link>
        </DropdownMenuItem>}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/user/profile" onClick={() => handleSelect()}>
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="bg-red-200 cursor-pointer"
          onSelect={() => handleSelect(logout)}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}