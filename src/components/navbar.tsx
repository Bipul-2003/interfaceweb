"use client";

// import { UserNav } from "./user-nav";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";
import logOut from "@/utils/logoutUser";
import { User } from "next-auth";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, Package2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import getSession from "@/utils/getSession";
import { UserNav } from "./user-nav";

export function Navbar() {
  const [user, setUser] = useState<User | undefined | null>();

  const onclickHandler = async () => {
    const loggedout = await logOut();
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      console.log(session?.user);

      setUser(session?.user);
    };
    fetchUser();
  }, []);

  return (
    <div className="">
      <nav className="flex flex-wrap items-center justify-between mx-auto p-4 inset-x-0 z-50 fixed top-0 bg-background">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold">
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground"
                href="/courses">
                Courses
              </Link>
              <div>
                {user?.role === 1 ? (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-muted-foreground text-lg hover:text-foreground">
                        Dashbord
                      </AccordionTrigger>
                      <AccordionContent className="grid gap-y-2 text-lg font-medium pl-4">
                        <Link
                          href="/admin/dashboard/home"
                          className="text-muted-foreground hover:text-foreground">
                          Home
                        </Link>
                        <Link
                          href="/admin/dashboard/enrollments"
                          className="text-muted-foreground hover:text-foreground">
                          Enrollments
                        </Link>
                        <Link
                          href="/admin/dashboard/sessions"
                          className="text-muted-foreground hover:text-foreground">
                          Session
                        </Link>
                        <Link
                          href="/admin/dashboard/courses"
                          className="text-muted-foreground hover:text-foreground">
                          Courses
                        </Link>
                        <Link
                          href="/admin/dashboard/students"
                          className="text-muted-foreground hover:text-foreground">
                          Students
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : null}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <section>
          <Link href="/" className="text-2xl font-bold">
            Interface
          </Link>
        </section>
        <section className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col items-start justify-evenly gap-x-12 sm:flex-row ">
              <div className="">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}>
                    <Link href="/">Home</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </div>
              <div className="">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Offerings</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}>
                        <Link href="/courses">Training & Workshops</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}>
                        <Link href="/">Products</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}>
                        <Link href="/">Services</Link>
                      </NavigationMenuLink>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </div>
              <div className="">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}>
                    <Link href="/careers">Careers</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </div>
              <div className="">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}>
                    <Link href="/contact-us">Contact Us</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </div>
            </NavigationMenuList>
          </NavigationMenu>
        </section>
        <section className="flex gap-x-2 ">
          <div className="hidden md:flex">
            {user?.role === 1 ? (
              <Button className="rounded-full" asChild>
                <Link href="/admin/dashboard/home">Dashboard</Link>
              </Button>
            ) : null}
          </div>
          {user ? (
            <UserNav logout={onclickHandler} user={user} />
          ) : (
            <Button className="rounded-full" asChild>
              <Link href="/sign-in">SignIn</Link>
            </Button>
          )}
        </section>
      </nav>
    </div>
  );
}
