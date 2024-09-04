"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Image } from "@nextui-org/react";
import CustomNavbar from "../components/navbar";
import EmployeeHierarchy from "../components/editHierachy";
import Spinner from "../components/loading";

interface Employee {
  id: string;
  name: string;
  surname: string;
  role: string;
  email: string;
  reporting_line_manager: string | null;
}

export default function hierarchy() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const employeesResponse = await fetch(
          "https://lfilvjszdheghtldasjg.supabase.co/functions/v1/api",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "getEmployees" }),
          }
        );

        if (!employeesResponse.ok) {
          throw new Error(`HTTP error! status: ${employeesResponse.status}`);
        }

        const employeesData = await employeesResponse.json();
        setEmployees(employeesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <CustomNavbar />
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 p-4 ">
        <Card className="p-4 w-full max-w-[800px] dark:bg-gray-800 bg-white rounded-xl mb-8 ">
          <CardBody>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
              Employee Hierarchy
            </h2>
            {!isLoading ? (
              <EmployeeHierarchy
                employees={employees}
                onEditUser={() => {}}
                expandedByDefault={true}
                mode="view"
              />
            ) : (
              <Spinner />
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
