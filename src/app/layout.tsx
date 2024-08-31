import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/cartCount";

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
            <div className="mx-2 md:mx-6">{children}</div>
            <Toaster />
          </Layout>
        </CartProvider>
      </body>
    </html>
  );
}
