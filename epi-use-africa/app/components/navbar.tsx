"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import the router hook from Next.js
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  Link,
  Image,
} from "@nextui-org/react";

const CustomNavbar = () => {
  const menuItems = [
    { name: "Home", path: "/home" },
    { name: "Hierarchy", path: "/hierarchy" },
    { name: "About", path: "/about" },
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter(); // Get the router instance

  // Function to handle navigation
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <Navbar
        className="bg-gradient-to-b dark:bg-gray-800 bg-white shadow-md"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        {/* Mobile Menu Toggle */}
        <NavbarContent
          className="sm:hidden dark:text-white text-gray-600"
          justify="start"
        >
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        {/* Logo for mobile */}
        <NavbarContent className="sm:hidden pr-3 justify-center dark:text-white text-gray-600">
          <NavbarBrand>
            <div className="relative w-24">
              <Image
                src="/logo.png"
                alt="Project Logo"
                className="object-contain"
              />
            </div>
          </NavbarBrand>
        </NavbarContent>

        {/* Centered Logo and Links for larger screens */}
        <NavbarContent className="hidden sm:flex flex-1 justify-between items-center dark:text-white text-gray-600">
          <NavbarBrand className="flex-shrink-0">
            <div className="relative w-32">
              <Image
                src="/logo.png"
                alt="Project Logo"
                className="object-contain"
              />
            </div>
          </NavbarBrand>

          <div className="flex gap-4">
            {menuItems.map((item, index) => (
              <NavbarItem key={`${item.name}-${index}`}>
                <Link
                  className="dark:text-white text-gray-600"
                  href="#"
                  aria-current={item.path === "/hierarchy" ? "page" : undefined} // Set "Hierarchy" as the active link
                  onClick={() => handleNavigation(item.path)} // Navigate to the corresponding path
                >
                  {item.name}
                </Link>
              </NavbarItem>
            ))}
          </div>
        </NavbarContent>

        {/* Mobile Dropdown Menu */}
        <NavbarMenu className="dark:text-white text-gray-600 bg-transparent">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Link
                className="w-full dark:text-white text-gray-600"
                color={
                  index === 2
                    ? "warning"
                    : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                href="#"
                size="lg"
                onClick={() => handleNavigation(item.path)} // Navigate to the corresponding path
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
