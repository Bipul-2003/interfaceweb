'use client'
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
// import Footer from "./Footer";
import { Navbar } from "./navbar";
import Footer from "./Footer";

const Layout = ({children}:{children:ReactNode}) => {

    const path = usePathname()
    const noNavbarRoutes = ['/sign-in', '/sign-up'];
  return (
    <div className="m-2">
        {!noNavbarRoutes.includes(path) && <Navbar/>}
        {children}
        {!noNavbarRoutes.includes(path) && <Footer/>}
    </div>
  )
};

export default Layout;
