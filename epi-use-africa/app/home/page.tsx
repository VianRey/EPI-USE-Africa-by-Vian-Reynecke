"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDarkMode } from "use-dark-mode-ts";

import {
  Skeleton,
  Link,
  Avatar,
  Button,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import dynamic from "next/dynamic";

const CustomInput = dynamic(() => import("../components/inputCustom"), {
  ssr: false,
});
const RoleDropdown = dynamic(() => import("../components/roleDropdown"), {
  ssr: false,
});
const ReportingLineManager = dynamic(
  () => import("../components/reportingLineManager"),
  {
    ssr: false,
  }
);
const CustomNavbar = dynamic(() => import("../components/navbar"), {
  ssr: false,
});
const EditUserModal = dynamic(() => import("../components/editUser"), {
  ssr: false,
});
const Spinner = dynamic(() => import("../components/loading"), {
  ssr: false,
});
const EmployeeHierarchy = dynamic(() => import("../components/editHierachy"), {
  ssr: false,
});
interface Employee {
  id: string;
  name: string;
  surname: string;
  role: string;
  email: string;
  reporting_line_manager: string | null;
}

interface Role {
  role: string;
}

export default function home() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const isDarkMode = useDarkMode();
  const showSuccessToast = (message: string, isDarkMode: boolean) => {
    toast.success(message, {
      duration: 4000,
      position: "top-center",
      style: {
        border: isDarkMode ? "1px solid #9ca3af" : "1px solid #d1d5db",
        padding: "16px",
        color: isDarkMode ? "#ffffff" : "#111827",
        background: isDarkMode ? "#111827" : "#ffffff",
      },
    });
  };
  const showErrorToast = (message: string, isDarkMode: boolean) => {
    toast.error(message, {
      duration: 4000,
      position: "top-center",
      style: {
        border: isDarkMode ? "1px solid #9ca3af" : "1px solid #d1d5db",
        padding: "16px",
        color: isDarkMode ? "#ffffff" : "#111827",
        background: isDarkMode ? "#111827" : "#ffffff",
      },
    });
  };

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [employeesResponse, rolesResponse] = await Promise.all([
          fetch("https://lfilvjszdheghtldasjg.supabase.co/functions/v1/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "getEmployees" }),
          }),
          fetch("https://lfilvjszdheghtldasjg.supabase.co/functions/v1/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "getRole" }),
          }),
        ]);

        if (!employeesResponse.ok || !rolesResponse.ok) {
          throw new Error(
            `HTTP error! status: ${employeesResponse.status} ${rolesResponse.status}`
          );
        }

        const employeesData = await employeesResponse.json();
        const rolesData = await rolesResponse.json();

        setEmployees(employeesData);
        setRoles(rolesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const flattenHierarchy = (
    employees: Employee[],
    managerId: string | null = null
  ): Employee[] => {
    let flatEmployees: Employee[] = [];
    let queue: Employee[] = employees.filter(
      (emp) => emp.reporting_line_manager === managerId
    );
    let visitedEmployees = new Set<string>();

    while (queue.length > 0) {
      const employee = queue.shift()!;
      if (!visitedEmployees.has(employee.id)) {
        visitedEmployees.add(employee.id);
        flatEmployees.push(employee);

        const children = employees.filter(
          (emp) => emp.reporting_line_manager === employee.id
        );
        queue.push(...children);
      }
    }

    return flatEmployees;
  };

  interface CreateSectionProps {
    roles: Role[];
    employees: Employee[];
  }

  const CreateSection: React.FC<CreateSectionProps> = ({
    roles,
    employees,
  }) => {
    const [newEmployee, setNewEmployee] = useState({
      name: "",
      surname: "",
      birthDate: "",
      email: "",
      role: "",
      salary: "",
      reporting_line_manager: null,
    });

    const [errors, setErrors] = useState({
      name: "",
      surname: "",
      birthDate: "",
      email: "",
      role: "",
      salary: "",
      reporting_line_manager: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add this new state
    const [reportingLineManager, setReportingLineManager] = useState<
      string | null
    >(null);

    // Add this new state
    const [reportingManagerMessage, setReportingManagerMessage] = useState("");

    const validateInputs = () => {
      const newErrors = {
        name: "",
        surname: "",
        birthDate: "",
        email: "",
        role: "",
        salary: "",
        reporting_line_manager: "",
      };

      let isValid = true;

      if (!newEmployee.name.trim()) {
        newErrors.name = "Name is required";
        isValid = false;
      }
      if (!newEmployee.surname.trim()) {
        newErrors.surname = "Surname is required";
        isValid = false;
      }
      if (!newEmployee.birthDate.trim()) {
        newErrors.birthDate = "Birth Date is required";
        isValid = false;
      }
      if (!newEmployee.email.trim()) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(newEmployee.email)) {
        newErrors.email = "Email is invalid";
        isValid = false;
      }
      if (!newEmployee.role) {
        // Changed from newEmployee.role == "" to !newEmployee.role
        console.log("HELLO ", newEmployee.role);
        newErrors.role = "Role is required";
        isValid = false;
      }
      if (!newEmployee.salary.trim()) {
        newErrors.salary = "Salary is required";
        isValid = false;
      }
      if (newEmployee.role !== "CEO" && !newEmployee.reporting_line_manager) {
        newErrors.reporting_line_manager = "Reporting Line Manager is required";
        isValid = false;
      }

      setErrors(newErrors);
      return isValid;
    };

    const handleInputChange = (field: string, value: string | null) => {
      setNewEmployee((prev) => ({ ...prev, [field]: value }));
      // Clear the error for this field when the user starts typing
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleRoleChange = (role: string) => {
      handleInputChange("role", role);

      if (role === "CEO") {
        setNewEmployee((prev) => ({ ...prev, reporting_line_manager: null }));
        setReportingManagerMessage("CEO does not have a reporting manager.");
      } else if (role) {
        setReportingManagerMessage("");
      } else {
        setReportingManagerMessage("Please select a role first.");
      }
    };

    const handleManagerChange = (managerId: string | null) => {
      handleInputChange("reporting_line_manager", managerId);
    };

    const handleCreateEmployee = async () => {
      if (!validateInputs()) {
        return;
      }

      setIsSubmitting(true);

      try {
        // First, check if the email already exists
        const checkEmailResponse = await fetch(
          "https://lfilvjszdheghtldasjg.supabase.co/functions/v1/api",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "checkEmailExists",
              payload: { email: newEmployee.email },
            }),
          }
        );

        if (!checkEmailResponse.ok) {
          throw new Error("Failed to check email existence");
        }

        const { exists } = await checkEmailResponse.json();

        if (exists) {
          setErrors((prev) => ({
            ...prev,
            email: "This email already exists",
          }));

          showErrorToast(
            "An employee with this email address already exists in the system.",
            isDarkMode
          );

          return;
        }

        // If email doesn't exist, proceed with creating the employee
        const createResponse = await fetch(
          "https://lfilvjszdheghtldasjg.supabase.co/functions/v1/api",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "createEmployee",
              payload: newEmployee,
            }),
          }
        );

        const result = await createResponse.json();

        if (!createResponse.ok) {
          console.error("Error response:", result);
          if (
            result.error ===
            "A CEO already exists in the system. Only one CEO is allowed."
          ) {
            showErrorToast(
              "A CEO already exists in the system. Only one CEO is allowed.",
              isDarkMode
            );
          } else {
            showErrorToast(
              result.error || "Failed to create employee",
              isDarkMode
            );
          }
          return;
        }

        console.log("Employee created successfully:", result);

        // Reset form and show success message

        // Reset the form after a successful creation
        setNewEmployee({
          name: "",
          surname: "",
          birthDate: "",
          email: "",
          role: "",
          salary: "",
          reporting_line_manager: null,
        });
        setErrors({
          name: "",
          surname: "",
          birthDate: "",
          email: "",
          role: "",
          salary: "",
          reporting_line_manager: "",
        });

        showSuccessToast(
          `${result.name} ${result.surname} has been successfully added to the system.`,
          isDarkMode
        );
      } catch (error) {
        console.error("Error creating employee:", error);
        showErrorToast(
          "An unexpected error occurred while creating the employee. Please try again.",
          isDarkMode
        );
      } finally {
        setIsSubmitting(false);
      }
    };
    return (
      <Card className="w-full dark:bg-gray-800 bg-white  rounded-xl shadow-none ">
        <CardHeader className="flex gap-3 shadow-transparent ">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <FaUserPlus className="text-5xl text-blue-500" />
          </div>
          <div className="flex flex-col">
            <p className="text-md dark:text-white text-gray-900">Create</p>
            <p className="text-small dark:text-default-400 text-default-500">
              Create a new user
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="dark:text-gray-300 text-gray-700">
          <form className="w-full">
            <CustomInput
              required
              type="text"
              label="First Name"
              placeholder="Enter name"
              value={newEmployee.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              errorMessage={errors.name}
            />
            <CustomInput
              required
              type="text"
              label="Surname"
              placeholder="Enter surname"
              value={newEmployee.surname}
              onChange={(e) => handleInputChange("surname", e.target.value)}
              errorMessage={errors.surname}
            />
            <CustomInput
              required
              type="date"
              label="Birth Date"
              placeholder="Enter DOB"
              value={newEmployee.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              errorMessage={errors.birthDate}
            />
            <CustomInput
              required
              label="Email"
              type="email"
              placeholder="Enter email"
              value={newEmployee.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              errorMessage={errors.email}
            />
            <CustomInput
              required
              type="number"
              label="Salary"
              placeholder="Enter salary"
              value={newEmployee.salary}
              onChange={(e) => handleInputChange("salary", e.target.value)}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">R</span>
                </div>
              }
              errorMessage={errors.salary}
            />
            <div className="w-full mb-2">
              {isLoading ? (
                <Skeleton className="w-full mb-4 h-14 bg-white dark:bg-gray-900 rounded-xl cursor-text border-2 border-gray-300 dark:border-gray-600" />
              ) : (
                <RoleDropdown
                  label="Role"
                  placeholder="Select a role"
                  value={newEmployee.role}
                  onChange={handleRoleChange}
                  roles={roles}
                  errorMessage={errors.role} // Make sure this prop is correctly passed and handled in RoleDropdown
                />
              )}
            </div>
            {isLoading ? (
              <Skeleton className="w-full mb-2 h-14 bg-white dark:bg-gray-900 rounded-xl cursor-text border-2 border-gray-300 dark:border-gray-600" />
            ) : (
              <>
                <ReportingLineManager
                  label="Reporting Line Manager"
                  onSelectionChange={handleManagerChange}
                  initialSelection={newEmployee.reporting_line_manager}
                  employees={employees}
                  errorMessage={
                    newEmployee.role !== "CEO"
                      ? errors.reporting_line_manager
                      : ""
                  }
                  disabled={!newEmployee.role || newEmployee.role === "CEO"}
                />
                {reportingManagerMessage && (
                  <div className="text-sm text-gray-500 mt-2">
                    {reportingManagerMessage}
                  </div>
                )}
              </>
            )}
          </form>
          <Button
            color="primary"
            className="mt-4 p-6"
            onClick={handleCreateEmployee}
            isLoading={isSubmitting}
          >
            Create New Employee Profile
          </Button>
        </CardBody>
      </Card>
    );
  };

  const ManageSection = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // Flatten the hierarchy for comprehensive searching
    const flatEmployees = flattenHierarchy(employees);

    // Apply the search on the flattened list
    const filteredEmployees = flatEmployees.filter((employee) =>
      `${employee.name} ${employee.surname} ${employee.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const handleEditUser = (employee: Employee) => {
      console.log("Edit button clicked for employee:", employee);
      setSelectedEmployee(employee);
      setIsEditModalOpen(true);
    };

    const handleUpdateUser = async (updatedEmployee: Employee) => {
      try {
        const response = await fetch(
          "https://lfilvjszdheghtldasjg.supabase.co/functions/v1/api",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "updateEmployee",
              payload: updatedEmployee,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          if (response.status === 400 && result.error) {
            showErrorToast("Error: " + `${result.error}`, isDarkMode);
            return;
          }
          throw new Error("Failed to update employee");
        }
        showSuccessToast("Successfully updated employee", isDarkMode);

        console.log("Employee updated successfully:", result);

        // Update the local state with the updated employee
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp.id === updatedEmployee.id ? result : emp
          )
        );

        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error updating employee:", error);
        showErrorToast(
          "Error updating employee error:" + `${error}`,
          isDarkMode
        );
      }
    };

    const handleDeleteUser = async (employeeId: string) => {
      try {
        const response = await fetch(
          "https://lfilvjszdheghtldasjg.supabase.co/functions/v1/api",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "deleteEmployee",
              payload: { id: employeeId },
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          if (response.status === 400 && result.error) {
            showErrorToast("Error: " + `${result.error}`, isDarkMode);
            return;
          }
          throw new Error("Failed to delete employee");
        }

        // Update the local state to remove the deleted employee
        setEmployees((prevEmployees) =>
          prevEmployees.filter((emp) => emp.id !== employeeId)
        );
        showSuccessToast(
          "Employee deleted successfully: " + `${result}`,
          isDarkMode
        );

        setIsEditModalOpen(false);
      } catch (error) {
        showErrorToast("Error: " + `${error}`, isDarkMode);
      }
    };

    return (
      <>
        <Card className="w-full dark:bg-gray-800 bg-white  rounded-xl  shadow-none">
          <CardHeader className="flex gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FaUsers className="text-5xl text-green-500" />
            </div>
            <div className="flex flex-col">
              <p className="text-md dark:text-white text-gray-900">
                Employee Management
              </p>
              <p className="text-small dark:text-default-400 text-default-500">
                View, search, and manage employees
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="dark:text-gray-300 text-gray-700 p-3">
            <CustomInput
              label="Search employees"
              placeholder="Enter name, surname, or role"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
                Employee Hierarchy
              </h2>
              {isLoading ? (
                <div className="flex justify-center items-center mt-4 mb-4">
                  {" "}
                  <Spinner />
                </div>
              ) : (
                <EmployeeHierarchy
                  employees={employees}
                  onEditUser={handleEditUser}
                  expandedByDefault={true}
                  mode="edit"
                  searchTerm={searchTerm} // Add this line
                />
              )}
            </div>
          </CardBody>
        </Card>
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          employee={selectedEmployee}
          onUpdate={handleUpdateUser}
          onDelete={handleDeleteUser}
        />
      </>
    );
  };

  return (
    <>
      <CustomNavbar />
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-[800px] dark:bg-gray-800 bg-white rounded-xl mb-8 ">
          <CardBody>
            <Tabs
              aria-label="CRUD Operations"
              classNames={{
                base: "w-full", // Applies to the entire Tabs container
                tabList:
                  "flex p-1 h-fit gap-2 items-center flex-nowrap overflow-x-scroll scrollbar-hide dark:bg-gray-900 bg-white rounded-medium border-b-2 border-gray-200 dark:border-gray-700", // Copy and adjust styles from the screenshot
                tab: "text-white", // Styles for individual tabs
              }}
              color="primary"
            >
              {" "}
              <Tab key="create" title="Create">
                <CreateSection roles={roles} employees={employees} />
              </Tab>
              <Tab key="manage" title="Manage">
                <ManageSection />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>{" "}
      <Toaster />
    </>
  );
}
