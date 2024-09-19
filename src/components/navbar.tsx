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
import { Menu, Package2, ShoppingCart, ShoppingCartIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import getSession from "@/utils/getSession";
import { UserNav } from "./user-nav";
import { useCart } from "@/context/cartCount";
import axios from "axios";

export function Navbar() {
  const [user, setUser] = useState<User | undefined | null>();
  // const [cartCount, setCartCount] = useState(0);
  
  const {cartCount} = useCart();

  const onclickHandler = async () => {
    const loggedout = await logOut();
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      // console.log(session?.user);

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
                <span className="sr-only">Interface Hub</span>
              </Link>
              <SheetClose asChild>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </SheetClose>
              <div className="">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-muted-foreground text-lg hover:text-foreground h-2">
                      Offerings
                    </AccordionTrigger>
                    <AccordionContent className="grid gap-y-2 text-lg font-medium pl-4">
                      <SheetClose asChild>
                        <Link
                          href="/courses"
                          className="text-muted-foreground hover:text-foreground">
                          Training & Workshops
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/"
                          className="text-muted-foreground hover:text-foreground">
                          Products
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/"
                          className="text-muted-foreground hover:text-foreground">
                          Services
                        </Link>
                      </SheetClose>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <SheetClose asChild>
                <Link
                  className="text-muted-foreground hover:text-foreground"
                  href="/careers">
                  Careers
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  className="text-muted-foreground hover:text-foreground"
                  href="/about-us">
                  About Us
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  className="text-muted-foreground hover:text-foreground"
                  href="/contact-us">
                  Contact Us
                </Link>
              </SheetClose>

              <div>
                {user?.role === 1 ? (
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-muted-foreground text-lg hover:text-foreground h-2 bg-muted rounded-md">
                        Dashbord
                      </AccordionTrigger>
                      <AccordionContent className="grid gap-y-2 text-lg font-medium pl-4">
                        <SheetClose asChild>
                          <Link
                            href="/admin/dashboard"
                            className="text-muted-foreground hover:text-foreground">
                            Home
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/admin/dashboard/enrollments"
                            className="text-muted-foreground hover:text-foreground">
                            Enrollments
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/admin/dashboard/sessions"
                            className="text-muted-foreground hover:text-foreground">
                            Session
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/admin/dashboard/courses"
                            className="text-muted-foreground hover:text-foreground">
                            Courses
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/admin/dashboard/students"
                            className="text-muted-foreground hover:text-foreground">
                            Users
                          </Link>
                        </SheetClose>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : null}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <section>
          <Link href="/" className="text-xl  font-bold">
            Interface <span className="text-primary">H</span>ub
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
                        <Link href="/trainings">Trainings</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}>
                          <div className="flex flex-col">
                          <p className='text-[10px] text-primary '>Comming soon</p>
                        <Link href="/courses" className="text-gray-400">Workshops</Link>
                          </div>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}>
                        <Link href="/">Products</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}>
                        <Link href="/services">Services</Link>
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
                    <Link href="/about-us">About Us</Link>
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
          
          {user ? (
            <div className="flex items-center space-x-5">
             <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6" />
             { cartCount!==0?<span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>:null}
            </Link>
            <UserNav logout={onclickHandler} user={user} />
            </div>
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
