import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/cartCount";

import 'react-quill/dist/quill.snow.css';  

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interface Hub",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Layout>
            <div className="mx-1 min-h-dvh">{children}</div>
            <Toaster />
          </Layout>
        </CartProvider>
      </body>
{/* 
      <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/react-quill@1.3.3/dist/react-quill.js"></script>
      <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
      <script type="text/babel" src="/my-scripts.js"></script> */}
    </html>
  );
}
