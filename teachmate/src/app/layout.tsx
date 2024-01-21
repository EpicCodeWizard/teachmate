import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    // <SessionProvider session={session}>
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="navbar bg-base-100">
            <div className="navbar-start">
              <a className="btn btn-ghost text-xl" href="/">TeachMate</a>
            </div>
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="/attendance">Attendance</a>
                </li>
                <li>
                  <a href="/feedback">Feedback</a>
                </li>
                <li>
                  <a href="/slideshow">Slideshow</a>
                </li>
            </div>
            <div className="navbar-end">
              <SignedIn><UserButton afterSignOutUrl="/"></UserButton></SignedIn>
              <SignedOut><SignInButton mode="modal"></SignInButton></SignedOut>
            </div>
          </div>
          {children}
          <Script src="/script.js" />
        </body>
      </html>
    </ClerkProvider>
    // </SessionProvider>
  );
}
