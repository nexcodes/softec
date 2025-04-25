"use client";

import Logo from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const Header = () => {
  const { user } = useCurrentUser();

  return (
    <header className="bg-transparent text-white py-2 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Logo showText />
          </Link>
        </div>
        <nav className="dark">
          <ul className="flex space-x-2">
            <li>
              <Link
                href="/"
                className={buttonVariants({
                  variant: "link",
                  className: "hover:underline",
                })}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/report"
                className={buttonVariants({
                  variant: "link",
                  className: "hover:underline",
                })}
              >
                Report
              </Link>
            </li>
            <li>
              <Link
                href="/report"
                className={buttonVariants({
                  variant: "link",
                  className: "hover:underline",
                })}
              >
                Consultency
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={buttonVariants({
                  variant: "link",
                  className: "hover:underline",
                })}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={buttonVariants({
                  variant: "link",
                  className: "hover:underline",
                })}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/report"
                className={buttonVariants({
                  variant: "link",
                  className: "hover:underline",
                })}
              >
                Explore
              </Link>
            </li>
            {!!user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => authClient.signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="secondary">
                <Link
                  href="/auth/sign-in"
                  className="hover:text-gray-200 transition-colors"
                >
                  Sign In
                </Link>
              </Button>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
