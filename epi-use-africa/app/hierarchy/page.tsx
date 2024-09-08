////////////////////////////////////////////////////////////////
// HierarchyPage Component
// This page displays an employee hierarchy in a structured view.
// It fetches employee data from a Supabase API and dynamically loads
// components like the navbar, spinner, and hierarchy view.
// The user can view the hierarchy but does not have edit permissions.
//
// Summary of main functions:
// 1. Fetches employee data from the Supabase API.
// 2. Displays a loading spinner until data is fetched.
// 3. Renders the employee hierarchy once data is available.
////////////////////////////////////////////////////////////////

"use client"; // Marks this component as a client-side rendered component

import React, { useState, useEffect } from "react"; // React hooks for managing component state and lifecycle
import { Card, CardBody, Image } from "@nextui-org/react"; // NextUI components for building the UI
import dynamic from "next/dynamic"; // Dynamic imports for performance optimization

// Dynamically load the Spinner component (displays loading animation) - only loaded on client-side
const Spinner = dynamic(() => import("../components/loading"), {
  ssr: false,
});

// Dynamically load the EmployeeHierarchy component - only loaded on client-side
const EmployeeHierarchy = dynamic(() => import("../components/editHierachy"), {
  ssr: false,
});

// Dynamically load the CustomNavbar component - only loaded on client-side
const CustomNavbar = dynamic(() => import("../components/navbar"), {
  ssr: false,
});

// TypeScript interface defining the structure of an Employee object
interface Employee {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  reporting_id: string | null;
  reporting_line_manager: string | null;
  profileImageUrl?: string;
  birthDate?: string;
  salary?: string;
}

export default function HierarchyPage() {
  // State for storing employee data and loading status
  const [employees, setEmployees] = useState<Employee[]>([]); // Stores the array of employees
  const [isLoading, setIsLoading] = useState(true); // Tracks whether the page is still loading

  // useEffect to fetch employee data when the component is first rendered
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading state to true while fetching data
        const employeesResponse = await fetch(
          "https://lfilvjszdheghtldasjg.supabase.co/functions/v1/api", // Fetch employees from Supabase API
          {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // API request headers
            body: JSON.stringify({ type: "getEmployees" }), // Request body to specify fetching employee data
          }
        );

        if (!employeesResponse.ok) {
          throw new Error(`HTTP error! status: ${employeesResponse.status}`); // Throw error if the request fails
        }

        const employeesData = await employeesResponse.json(); // Parse JSON data from response
        setEmployees(employeesData); // Set the employee data in the state
      } catch (error) {
        console.error("Failed to fetch data:", error); // Log error if the request fails
      } finally {
        setIsLoading(false); // Set loading state to false once data is fetched or error occurs
      }
    };

    fetchData(); // Call the function to fetch employee data
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage whether a menu is open (not used in this example)

  return (
    <>
      <CustomNavbar /> {/* Render the custom navigation bar at the top */}
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 p-4 ">
        {/* Main container for the page, including background gradient and padding */}
        <Card className="w-full lg:w-[auto] lg:min-w-[800px] dark:bg-gray-800 bg-white rounded-xl shadow-none h-auto">
          {/* Card component to hold the content */}
          <CardBody>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
              Employee Hierarchy
            </h2>{" "}
            {/* Heading for the hierarchy section */}
            {!isLoading ? (
              // Conditionally render the EmployeeHierarchy if data has been loaded
              <EmployeeHierarchy
                employees={employees} // Pass the employee data as a prop
                onEditUser={() => {}} // No edit functionality in this view (empty function)
                expandedByDefault={true} // Expand all hierarchy nodes by default
                mode="view" // Set the mode to "view" (no editing capabilities)
                searchTerm={""} // Pass an empty string as the search term (no filtering)
              />
            ) : (
              // If data is still loading, show the Spinner component
              <Spinner />
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
