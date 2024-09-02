"use client";

import React, { useState, useEffect } from "react";
import { Select, SelectItem, Button, Avatar } from "@nextui-org/react";
import md5 from "md5";
import { FaTree } from "react-icons/fa";
import EmployeeHierarchy from "../components/hierachy";

interface Employee {
  id: string;
  name: string;
  surname: string;
  role: string;
  email: string;
  reporting_line_manager: string | null;
}

interface RoleSelectorProps {
  onRoleSelect: (employee: Employee) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHierarchy, setShowHierarchy] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://lfilvjszdheghtldasjg.supabase.co/functions/v1/api",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: "getEmployees" }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${JSON.stringify(
              errorData
            )}`
          );
        }
        let data: Employee[] = await response.json();

        // Sort the employees alphabetically by role
        data.sort((a, b) => a.role.localeCompare(b.role));

        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        setError("Failed to fetch employees. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleSelect = (value: React.Key) => {
    setSelectedEmployee(value as string);
  };

  const handleSubmit = () => {
    const employee = employees.find((emp) => emp.id === selectedEmployee);
    if (employee) {
      onRoleSelect(employee);
    }
  };

  const getGravatarUrl = (email: string) => {
    const hash = md5(email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  const toggleHierarchyView = () => {
    setShowHierarchy(!showHierarchy);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
            Select Your Profile
          </h2>

          {loading ? (
            <p className="text-center text-gray-600 dark:text-gray-300">
              Loading employees...
            </p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              <Select
                color="primary"
                items={employees}
                label="Select an employee"
                placeholder="Choose an employee"
                className="w-full"
                selectedKeys={selectedEmployee ? [selectedEmployee] : []}
                onSelectionChange={(keys) => handleSelect(Array.from(keys)[0])}
                classNames={{
                  label: "group-data-[filled=true]:-translate-y-5",
                  trigger: "min-h-16",
                  listboxWrapper: "max-h-[400px]",
                }}
                listboxProps={{
                  itemClasses: {
                    base: [
                      "rounded-md",
                      "text-default-500",
                      "transition-opacity",
                      "data-[hover=true]:text-foreground",
                      "data-[hover=true]:bg-default-100",
                      "dark:data-[hover=true]:bg-default-50",
                      "data-[selectable=true]:focus:bg-default-50",
                      "data-[pressed=true]:opacity-70",
                      "data-[focus-visible=true]:ring-default-500",
                    ],
                  },
                }}
                popoverProps={{
                  classNames: {
                    base: "before:bg-default-200",
                    content: "p-0 bg-background",
                  },
                }}
                renderValue={(items) => {
                  return items.map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <Avatar
                        alt={`${item.data?.name ?? ""} ${
                          item.data?.surname ?? ""
                        }`}
                        className="flex-shrink-0"
                        size="sm"
                        src={
                          item.data?.email
                            ? getGravatarUrl(item.data.email)
                            : undefined
                        }
                      />
                      <div className="flex flex-col">
                        <span>{`${item.data?.name ?? ""} ${
                          item.data?.surname ?? ""
                        }`}</span>
                        <span className="text-default-500 text-tiny">
                          {item.data?.role ?? ""}
                        </span>
                      </div>
                    </div>
                  ));
                }}
              >
                {(employee) => (
                  <SelectItem
                    key={employee.id}
                    textValue={`${employee.name} ${employee.surname}`}
                  >
                    <div className="flex gap-2 items-center">
                      <Avatar
                        alt={`${employee.name} ${employee.surname}`}
                        className="flex-shrink-0"
                        size="sm"
                        src={getGravatarUrl(employee.email)}
                      />
                      <div className="flex flex-col">
                        <span className="text-small">{`${employee.name} ${employee.surname}`}</span>
                        <span className="text-tiny text-default-400">
                          {employee.role}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>
              <Button
                className="w-full font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 mt-4"
                onClick={handleSubmit}
                disabled={!selectedEmployee}
              >
                Enter System
              </Button>{" "}
              <div className=" flex justify-end mb-4 mt-4">
                <Button
                  color="secondary"
                  variant="flat"
                  startContent={<FaTree />}
                  onClick={toggleHierarchyView}
                  className="w-full"
                >
                  {showHierarchy ? "Hide Hierarchy" : "View Hierarchy"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {showHierarchy && (
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
            Employee Hierarchy
          </h2>
          <EmployeeHierarchy employees={employees} />
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
