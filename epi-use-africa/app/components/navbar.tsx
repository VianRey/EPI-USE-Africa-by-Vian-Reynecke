"use client"; // Ensures this component is only rendered on the client side

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  Link,
} from "@nextui-org/react";

const CustomNavbar = () => {
  const menuItems = [
    { name: "Landing", path: "/" },
    { name: "Home", path: "/home" },
    { name: "Hierarchy", path: "/hierarchy" },
    { name: "About", path: "/about" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const renderLogo = (width: number, height: number) => {
    if (!mounted) return null;

    const currentTheme = theme === "system" ? resolvedTheme : theme;
    const logoSrc = currentTheme === "dark" ? "/dark-logo.webp" : "/logo.webp";

    return (
      <Image
        src={logoSrc}
        alt="Project Logo"
        className="object-contain"
        width={width}
        height={height}
      />
    );
  };

  if (!mounted) return null; // Ensure pathname is available after mounting

  return (
    <>
      <Navbar
        className="bg-gradient-to-b dark:bg-gray-800 bg-white shadow-md"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        {/* Mobile Menu Toggle and Logo */}
        <NavbarContent className="sm:hidden w-full flex justify-between items-center">
          <NavbarMenuToggle
            className="text-gray-700 dark:text-white"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />

          {/* Logo for mobile - aligned to the right */}
          <div className="relative w-24 ml-auto flex justify-end">
            {renderLogo(96, 48)}
          </div>
        </NavbarContent>

        {/* Centered Logo and Links for larger screens */}
        <NavbarContent className="hidden sm:flex flex-1 justify-between items-center">
          <NavbarBrand className="flex-shrink-0">
            {renderLogo(128, 64)}
          </NavbarBrand>

          <div className="flex gap-4">
            {menuItems.map((item, index) => (
              <NavbarItem key={`${item.name}-${index}`}>
                <Link
                  className={`text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-200 ${
                    pathname === item.path
                      ? "border-b-2 border-gray-900 dark:border-gray-200"
                      : ""
                  }`}
                  href="#"
                  aria-current={item.path === pathname ? "page" : undefined}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.name}
                </Link>
              </NavbarItem>
            ))}
          </div>
        </NavbarContent>

        {/* Mobile Dropdown Menu */}
        <NavbarMenu className="bg-white dark:bg-gray-800 bg-opacity-95 dark:bg-opacity-95">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Link
                className={`w-full text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-200 ${
                  pathname === item.path
                    ? "border-b-2 border-gray-900 dark:border-gray-200"
                    : ""
                }`}
                href="#"
                size="lg"
                onClick={() => handleNavigation(item.path)}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </>
  );
};

export default CustomNavbar;
