"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import Link from "next/link";
import { Button } from "../ui/button";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function NavigationBar() {
  const { data: session, status } = useSession();

  console.log(`Nav bar: ${status}`);

  const user: User = session?.user as User;

  return (
    <>
      <div className="navbar shadow-sm py-5 px-6">
        <Navbar>
          <div className="flex-1">
            <NavbarBrand>
              <p className="font-bold text-lg text-inherit">Secret Sprinkles</p>
            </NavbarBrand>
          </div>
          <div className="flex-none">
            <NavbarContent justify="end">
              <NavbarItem>
                {session ? (
                  <Button onClick={() => signOut()}>Sign Out</Button>
                ) : (
                  <Link href="/sign-in">
                    <Button>Sign In</Button>
                  </Link>
                )}
              </NavbarItem>
              <NavbarItem>
                <ThemeSwitcher />
              </NavbarItem>
            </NavbarContent>
          </div>
        </Navbar>
      </div>
    </>
  );
}
