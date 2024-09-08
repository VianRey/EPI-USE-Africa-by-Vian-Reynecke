/**
 * CustomNavbar is a responsive navigation bar component built using NextUI's `Navbar` component.
 * It supports light and dark themes with a toggle switch, navigation links, and a logo.
 * The component dynamically renders content based on the current theme and screen size.
 * It also handles mobile and desktop layouts with menu toggles and ensures the component is only mounted on the client side.
 */

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
import dynamic from "next/dynamic"; // Dynamically imports components to optimize performance by splitting the code

// Dynamically load the ThemeToggle component to optimize performance
const ThemeToggle = dynamic(() => import("../components/toggleTheme"), {
  ssr: false,
});

const CustomNavbar = () => {
  // Define the navigation menu items with their respective paths
  const menuItems = [
    { name: "Landing", path: "/" },
    { name: "Home", path: "/home" },
    { name: "Hierarchy", path: "/hierarchy" },
    { name: "About", path: "/about" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility on mobile
  const router = useRouter(); // Hook to manage routing
  const pathname = usePathname(); // Get the current path to apply active class to the active route
  const { theme, resolvedTheme } = useTheme(); // Theme management (light/dark mode)
  const [mounted, setMounted] = useState(false); // Ensures the component is mounted before rendering

  // Set mounted to true after the component has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handles navigation when a menu item is clicked
  const handleNavigation = (path: string) => {
    // Avoid navigating if the theme toggle is clicked
    if (path === "toggleTheme") {
      return;
    }
    router.push(path); // Navigate to the specified path
  };

  // Renders the appropriate logo based on the current theme (dark or light)
  const renderLogo = (width: number, height: number) => {
    if (!mounted) return null;

    const currentTheme = theme === "system" ? resolvedTheme : theme; // Determine current theme
    const logoSrc = currentTheme === "dark" ? "/dark-logo.webp" : "/logo.png"; // Load the appropriate logo based on the theme

    return (
      <Image
        src={logoSrc} // Source of the logo
        alt="Project Logo" // Alt text for the logo image
        className="object-contain"
        width={width} // Logo width
        height={height} // Logo height
      />
    );
  };

  if (!mounted) return null; // Avoid rendering the component until it is mounted

  return (
    <>
      {/* Navbar component */}
      <Navbar
        className="bg-gradient-to-b dark:bg-gray-800 bg-white shadow-md" // Apply gradient background depending on theme
        isMenuOpen={isMenuOpen} // Track if the menu is open (for mobile)
        onMenuOpenChange={setIsMenuOpen} // Toggle the menu state
      >
        {/* Mobile Menu Toggle and Logo */}
        <NavbarContent className="sm:hidden w-full flex justify-between items-center">
          {/* Button to toggle the mobile menu */}
          <NavbarMenuToggle
            className="text-gray-700 dark:text-white" // Adjust color for dark/light mode
            aria-label={isMenuOpen ? "Close menu" : "Open menu"} // Aria label for accessibility
          />
          {/* Logo for mobile */}
          <div className="relative w-24 ml-auto flex justify-end">
            {renderLogo(96, 48)}{" "}
            {/* Render the logo with specified width and height */}
          </div>
        </NavbarContent>

        {/* Centered Logo and Links for larger screens */}
        <NavbarContent className="hidden sm:flex flex-1 justify-between items-center">
          {/* Brand logo for desktop */}
          <NavbarBrand className="flex-shrink-0">
            {renderLogo(128, 64)}{" "}
            {/* Render the logo with larger dimensions for desktop */}
          </NavbarBrand>

          {/* Navigation links */}
          <div className="flex gap-4 items-center">
            {menuItems.map((item, index) => (
              <NavbarItem key={`${item.name}-${index}`}>
                <Link
                  className={`text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-200 ${
                    pathname === item.path
                      ? "border-b-2 border-gray-900 dark:border-gray-200"
                      : ""
                  }`}
                  href="#" // Prevent default link navigation
                  aria-current={item.path === pathname ? "page" : undefined} // Highlight current page link
                  onClick={() => handleNavigation(item.path)} // Handle navigation on click
                >
                  {item.name} {/* Display menu item name */}
                </Link>
              </NavbarItem>
            ))}
            {/* Theme toggle button */}
            <NavbarItem className="flex items-center">
              <ThemeToggle /> {/* Renders the theme toggle switch */}
            </NavbarItem>
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
                onClick={() => handleNavigation(item.path)} // Handle navigation on mobile menu click
              >
                {item.name} {/* Display menu item name */}
              </Link>
            </NavbarMenuItem>
          ))}
          {/* Theme toggle button for mobile menu */}
          <NavbarMenuItem>
            <div className="w-full text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-200">
              <ThemeToggle /> {/* Renders the theme toggle switch */}
            </div>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </>
  );
};

export default CustomNavbar;
