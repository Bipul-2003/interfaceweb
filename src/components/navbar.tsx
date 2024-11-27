"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { User } from "next-auth"
import { Menu, Package2, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { useCart } from "@/context/cartCount"
import getSession from "@/utils/getSession"
import logOut from "@/utils/logoutUser"
import { UserNav } from "./user-nav"

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const { cartCount, updateCart } = useCart()

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession()
      setUser(session?.user || null)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (user) {
      updateCart()
    }
  }, [user, updateCart])

  const handleLogout = async () => {
    await logOut()
    setUser(null)
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background p-4">
      <div className="mx-auto flex items-center justify-between">
        <MobileMenu user={user} />
        <Logo />
        <DesktopMenu />
        <UserSection user={user} cartCount={cartCount} onLogout={handleLogout} />
      </div>
    </nav>
  )
}

function Logo() {
  return (
    <Link href="/" className="text-xl font-bold">
      Interface <span className="text-primary">H</span>ub
    </Link>
  )
}

function MobileMenu({ user }: { user: User | null }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Interface Hub</span>
          </Link>
          <MobileMenuItem href="/" label="Home" />
          <MobileAccordionItem title="Offerings">
            <MobileMenuItem href="/courses" label="Training & Workshops" />
            <MobileMenuItem href="/" label="Products" />
            <MobileMenuItem href="/services" label="Services" />
          </MobileAccordionItem>
          <MobileMenuItem href="/careers" label="Careers" />
          <MobileMenuItem href="/about-us" label="About Us" />
          <MobileMenuItem href="/contact-us" label="Contact Us" />
          {user?.role === 1 && (
            <MobileAccordionItem title="Dashboard">
              <MobileMenuItem href="/admin/dashboard" label="Home" />
              <MobileMenuItem href="/admin/dashboard/enrollments" label="Enrollments" />
              <MobileMenuItem href="/admin/dashboard/sessions" label="Session" />
              <MobileMenuItem href="/admin/dashboard/courses" label="Courses" />
              <MobileMenuItem href="/admin/dashboard/users" label="Users" />
            </MobileAccordionItem>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

function MobileMenuItem({ href, label }: { href: string; label: string }) {
  return (
    <SheetClose asChild>
      <Link href={href} className="text-muted-foreground hover:text-foreground">
        {label}
      </Link>
    </SheetClose>
  )
}

function MobileAccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-muted-foreground text-lg hover:text-foreground h-2">
          {title}
        </AccordionTrigger>
        <AccordionContent className="grid gap-y-2 text-lg font-medium pl-4">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function DesktopMenu() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="flex items-center space-x-4">
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/">
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Offerings</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <DesktopMenuItem href="/trainings" label="Trainings" />
              <DesktopMenuItem
                href="/courses"
                label="Workshops"
                description="Coming soon"
                className="text-gray-400"
              />
              <DesktopMenuItem href="/" label="Products" />
              <DesktopMenuItem href="/services" label="Services" />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/careers">
            Careers
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/about-us">
            About Us
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/contact-us">
            Contact Us
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function DesktopMenuItem({
  href,
  label,
  description,
  className,
}: {
  href: string
  label: string
  description?: string
  className?: string
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link href={href} className={navigationMenuTriggerStyle() + " " + className}>
          <div>
            {description && <p className="text-[10px] text-primary">{description}</p>}
            {label}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

function UserSection({
  user,
  cartCount,
  onLogout,
}: {
  user: User | null
  cartCount: number
  onLogout: () => void
}) {
  return (
    <section className="flex items-center space-x-4">
      {user ? (
        <>
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            )}
          </Link>
          <UserNav logout={onLogout} user={user} />
        </>
      ) : (
        <Button className="rounded-full" asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      )}
    </section>
  )
}