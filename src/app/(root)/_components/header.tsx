"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaShieldAlt, FaBars, FaTimes, FaSearch, FaUser, FaBell } from "react-icons/fa";
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

const Header = () => {
  const { user } = useCurrentUser();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Report", path: "/report" },
    { name: "Consultancy", path: "/lawyer" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Explore", path: "/communities" },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 pt-2 ${
        isScrolled ? "bg-gray-900/95 backdrop-blur-md py-2 shadow-lg" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-0">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div
              className={`bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2 transform transition-transform ${
                isScrolled ? "scale-90" : ""
              } group-hover:scale-105`}
            >
              <FaShieldAlt className="text-white text-xl" />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-bold text-white transition-all ${
                  isScrolled ? "text-lg" : "text-xl"
                }`}
              >
                Nigheban<span className="text-blue-400">.pk</span>
              </span>
              <span
                className={`text-gray-400 text-xs transition-all ${
                  isScrolled ? "opacity-0 h-0" : "opacity-100"
                }`}
              >
                Safety in Community
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.path}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors relative group"
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white transition-colors">
              <FaSearch />
            </button>
            
              

            {/* Auth Section */}
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
              <Button variant="secondary" onClick={() => router.push("/auth/sign-in")}>
                <FaUser className="mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={toggleMobileMenu} className="md:hidden text-white">
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-md shadow-lg transition-all duration-300 ${
          mobileMenuOpen ? "max-h-screen py-4" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="px-6 space-y-4">
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          {/* Mobile Nav */}
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white px-4 py-2 border-b border-gray-700"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Auth */}
          <div className="pt-4">
            {!!user ? (
              <div className="flex justify-between items-center px-4">
                <span className="text-white">Hi, {user.name.split(" ")[0]}</span>
                <Button variant="destructive" onClick={() => authClient.signOut()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600"
                onClick={() => router.push("/auth/sign-in")}
              >
                <FaUser className="mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
