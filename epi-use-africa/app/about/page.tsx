"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";
import CustomNavbar from "../components/navbar";
import EmployeeHierarchy from "../components/editHierachy";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <CustomNavbar />
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-[800px] dark:bg-gray-800 bg-white rounded-xl mb-8 ">
          <CardBody>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
              Employee Hierarchy
            </h2>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
