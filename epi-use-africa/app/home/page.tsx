"use client";
import React, { useState, useEffect, useCallback } from "react";

import {
  Skeleton,
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Avatar,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import CustomInput from "../components/inputCustom";
import RoleDropdown from "../components/roleDropdown";
import ReportingLineManager from "../components/reportingLineManager";
import EmployeeHierarchy from "../components/editHierachy";
import EditUserModal from "../components/editUser";

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

export default function App() {
  const menuItems = ["Home", "Hierarchy", "About Us"];

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const flattenHierarchy = useCallback(
    (employees: Employee[], managerRole: string | null = null): Employee[] => {
      let flatEmployees: Employee[] = [];
      let visitedRoles = new Set<string>(); // Track visited roles to prevent infinite loops

      const addEmployeeWithDescendants = (employee: Employee) => {
        if (visitedRoles.has(employee.role)) {
          console.warn(`Circular reference detected in role: ${employee.role}`);
          return; // Stop further processing if circular reference is detected
        }

        visitedRoles.add(employee.role);
        flatEmployees.push(employee);

        employees
          .filter((emp) => emp.reporting_line_manager === employee.role)
          .forEach(addEmployeeWithDescendants);
      };

      // Start with employees who have no manager (top-level employees)
      employees
        .filter((emp) => emp.reporting_line_manager === managerRole)
        .forEach(addEmployeeWithDescendants);

      return flatEmployees;
    },
    []
  );

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
          setIsSubmitting(false);
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

        if (!createResponse.ok) {
          throw new Error("Failed to create new employee");
        }

        const result = await createResponse.json();
        console.log("Employee created successfully:", result);

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

        // TODO: Add a success message or notification here
      } catch (error) {
        console.error("Error creating employee:", error);
        // TODO: Add a general error message here
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Card className="w-full dark:bg-gray-800 bg-white shadow-md rounded-xl">
        <CardHeader className="flex gap-3">
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
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
      null
    );
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
            // Handle the case where update is not allowed
            alert(
              result.error +
                ` ${result.dependentCount} employee(s) are still reporting to this role.`
            );
            return;
          }
          throw new Error("Failed to update employee");
        }

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
        alert(
          "An error occurred while trying to update the employee. Please try again."
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
            // Handle the case where deletion is not allowed
            alert(
              result.error +
                ` ${result.dependentCount} employee(s) are still reporting to this role.`
            );
            return;
          }
          throw new Error("Failed to delete employee");
        }

        console.log("Employee deleted successfully:", result);

        // Update the local state to remove the deleted employee
        setEmployees((prevEmployees) =>
          prevEmployees.filter((emp) => emp.id !== employeeId)
        );

        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert(
          "An error occurred while trying to delete the employee. Please try again."
        );
      }
    };

    return (
      <>
        <Card className="w-full dark:bg-gray-800 bg-white shadow-md rounded-xl">
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
              <EmployeeHierarchy
                employees={filteredEmployees}
                onEditUser={handleEditUser}
                expandedByDefault={true}
              />
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
            <NavbarItem>
              <Link className="dark:text-white text-gray-600" href="#">
                Home
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
              <Link
                className="dark:text-white text-gray-600"
                href="#"
                aria-current="page"
              >
                Hierarchy
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link className="dark:text-white text-gray-600" href="#">
                Integrations
              </Link>
            </NavbarItem>
          </div>
        </NavbarContent>

        {/* Avatar and other items aligned to the right */}
        <NavbarContent
          justify="end"
          className="gap-2 dark:text-white text-gray-600"
        >
          <NavbarItem className="lg:hidden">
            {/* Smaller Avatar for small screens */}
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            {/* Larger Avatar for large screens */}
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Dropdown Menu */}
        <NavbarMenu className="dark:text-white text-gray-600 bg-transparent">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
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
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-[800px] dark:bg-gray-800 bg-white shadow-md rounded-xl mb-8">
          <CardBody>
            <Tabs color="primary" aria-label="CRUD Operations">
              <Tab key="create" title="Create">
                <CreateSection roles={roles} employees={employees} />
              </Tab>
              <Tab key="manage" title="Manage">
                <ManageSection />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
