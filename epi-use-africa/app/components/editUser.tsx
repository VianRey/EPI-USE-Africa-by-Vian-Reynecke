////////////////////////////////////////////////////////////////
// EditUserModal Component
// This component provides a modal for editing employee details. It allows
// users to update an employee's name, surname, email, role, and reporting
// line manager. It uses data fetched from an API for roles and employees,
// and supports validating input fields. The component also allows users to
// delete the employee.
//
// Key Features:
// 1. Fetch employee and role data from an API when the modal is opened.
// 2. Form validation for input fields (name, surname, email, role).
// 3. Allows assigning a reporting line manager unless the employee is a CEO.
// 4. Gravatar integration for displaying the employee's profile picture.
// 5. Provides an option to delete the employee record.
////////////////////////////////////////////////////////////////

import React, { useState, useEffect, useCallback } from "react"; // React hooks for state management and lifecycle
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
} from "@nextui-org/react"; // NextUI components for building the modal
import md5 from "md5"; // Library for hashing emails to generate Gravatar URLs
import CustomInput from "../components/inputCustom"; // Custom input component for text fields
import RoleDropdown from "../components/roleDropdown"; // Dropdown component for selecting employee roles
import ReportingLineManager from "../components/reportingLineManager"; // Component for selecting reporting line managers

// Interface defining the structure of an Employee object
export interface Employee {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  reporting_id: string | null;
  reporting_line_manager: string | null;
  profileImageUrl?: string; // Optional profile image URL (from Gravatar)
}

// Interface defining the structure of a Role object
interface Role {
  role: string;
}

// Interface defining the props for the EditUserModal component
interface EditUserModalProps {
  isOpen: boolean; // Determines if the modal is open or not
  onClose: () => void; // Function to close the modal
  employee: Employee | null; // The employee being edited (null if no employee selected)
  onUpdate: (updatedEmployee: Employee) => void; // Function to handle updating the employee
  onDelete: (employeeId: string) => void; // Function to handle deleting the employee
}

// Main component for editing employee details
const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  employee,
  onUpdate,
  onDelete,
}) => {
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null); // State to track the employee being edited
  const [employees, setEmployees] = useState<Employee[]>([]); // List of employees fetched from the API
  const [roles, setRoles] = useState<Role[]>([]); // List of roles fetched from the API
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState<string | null>(null); // State to handle API errors
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    email: "",
    role: "",
    reporting_line_manager: "",
  }); // State to track validation errors for the input fields

  // Fetch employee data from the API
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true); // Set loading to true while fetching data
      const response = await fetch(
        "https://lfilvjszdheghtldasjg.supabase.co/functions/v1/api", // API endpoint for fetching employees
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "getEmployees" }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Handle non-OK responses
      }
      let data: Employee[] = await response.json(); // Parse the JSON response
      data.sort((a, b) => a.role.localeCompare(b.role)); // Sort employees by role
      setEmployees(data); // Set employees in state
    } catch (error) {
      console.error("Failed to fetch employees:", error); // Log any errors
      setError("Failed to fetch employees. Please try again later."); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching is complete
    }
  }, []);

  // Fetch role data from the API
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true); // Set loading to true while fetching data
      const response = await fetch(
        "https://lfilvjszdheghtldasjg.supabase.co/functions/v1/api", // API endpoint for fetching roles
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "getRole" }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Handle non-OK responses
      }
      const data: Role[] = await response.json(); // Parse the JSON response
      setRoles(data); // Set roles in state
    } catch (error) {
      console.error("Failed to fetch roles:", error); // Log any errors
      setError("Failed to fetch roles. Please try again later."); // Set error message
    } finally {
      setLoading(false); // Set loading to false after fetching is complete
    }
  }, []);

  // Fetch data when the modal is opened
  useEffect(() => {
    if (isOpen) {
      Promise.all([fetchEmployees(), fetchRoles()]).then(() =>
        setLoading(false)
      ); // Fetch employees and roles concurrently when modal opens
    }
  }, [isOpen, fetchEmployees, fetchRoles]);

  // Set the employee being edited when the modal is opened
  useEffect(() => {
    if (isOpen && employee) {
      setEditedEmployee({ ...employee }); // Copy employee details to state for editing
    } else if (!isOpen) {
      setEditedEmployee(null); // Clear the state when modal is closed
    }
  }, [isOpen, employee]);

  // Function to get the Gravatar URL for the employee's avatar based on their email
  const getGravatarUrl = useCallback((email: string) => {
    const hash = md5(email.toLowerCase().trim()); // Create md5 hash from email
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`; // Return the Gravatar URL
  }, []);

  // Function to validate the input fields in the form
  const validateInputs = () => {
    const newErrors = {
      name: "",
      surname: "",
      email: "",
      role: "",
      reporting_line_manager: "",
    };

    let isValid = true; // Tracks if all inputs are valid

    if (!editedEmployee) return false;

    if (!editedEmployee.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!editedEmployee.surname.trim()) {
      newErrors.surname = "Surname is required";
      isValid = false;
    }
    if (!editedEmployee.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(editedEmployee.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }
    if (!editedEmployee.role) {
      newErrors.role = "Role is required";
      isValid = false;
    }
    if (
      editedEmployee.role !== "CEO" &&
      !editedEmployee.reporting_line_manager
    ) {
      newErrors.reporting_line_manager = "Reporting Line Manager is required";
      isValid = false;
    }

    setErrors(newErrors); // Set any validation errors
    return isValid; // Return whether the form is valid
  };

  // Function to handle changes in input fields
  const handleInputChange = useCallback(
    (field: keyof Employee, value: string | null) => {
      setEditedEmployee((prev) => {
        if (!prev) return null;

        if (field === "role" && value === "CEO") {
          return {
            ...prev,
            [field]: value,
            reporting_line_manager: null, // CEO should not have a reporting line manager
            reporting_id: null,
          };
        }

        return { ...prev, [field]: value }; // Update the field with new value
      });

      setErrors((prev) => ({ ...prev, [field]: "" })); // Clear any existing error for the field
    },
    []
  );

  // Function to handle changes in reporting line manager
  const handleManagerChange = useCallback(
    (managerRole: string | null, managerId: string | null) => {
      if (
        editedEmployee?.reporting_line_manager !== managerRole ||
        editedEmployee?.reporting_id !== managerId
      ) {
        setEditedEmployee((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            reporting_line_manager: managerRole, // Update reporting line manager
            reporting_id: managerId, // Update reporting ID
          };
        });
      }
    },
    [editedEmployee]
  );

  // Function to handle updating the employee details
  const handleUpdate = () => {
    if (validateInputs() && editedEmployee) {
      onUpdate(editedEmployee); // Call the onUpdate function with the edited employee
      onClose(); // Close the modal after updating
    }
  };

  // Check if a CEO exists and exclude the "CEO" role if one already exists (except if the edited employee is the CEO)
  const ceoExists = employees.some(
    (emp) => emp.role === "CEO" && emp.id !== editedEmployee?.id
  );

  // Filter roles to exclude "CEO" if one already exists
  const filteredRoles = ceoExists
    ? roles.filter((role) => role.role !== "CEO")
    : roles;

  if (!editedEmployee) {
    return null; // Return null if no employee is being edited
  }

  return (
    <Modal
      className="dark:bg-gray-800 bg-white dark:text-white" // Modal styling for dark and light mode
      isOpen={isOpen}
      onOpenChange={onClose} // Function to close the modal
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[85vh] h-[90vh] sm:h-auto sm:max-h-[85vh]", // Responsive height for modal
        header: "border-b border-gray-700",
        body: "py-6",
        footer: "border-t border-gray-700",
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Employee
            </ModalHeader>
            <ModalBody className="overflow-y-auto">
              <div className="flex flex-col items-center sm:items-start mb-4">
                <Avatar
                  src={getGravatarUrl(editedEmployee.email)} // Fetch Gravatar image based on email
                  alt="User Avatar"
                  className="w-24 h-24 mb-2"
                />
                <p className="text-sm text-gray-400 text-center sm:text-left">
                  This profile picture is provided by{" "}
                  <a
                    href="https://en.gravatar.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400"
                  >
                    Gravatar
                  </a>
                  . To change your avatar, please update it on Gravatar.
                </p>
              </div>

              <CustomInput
                label="Name"
                value={editedEmployee.name}
                onChange={(e) => handleInputChange("name", e.target.value)} // Handle input changes for name
                className="mb-4"
                errorMessage={errors.name}
              />
              <CustomInput
                label="Surname"
                value={editedEmployee.surname}
                onChange={(e) => handleInputChange("surname", e.target.value)} // Handle input changes for surname
                className="mb-4"
                errorMessage={errors.surname}
              />
              <CustomInput
                label="Email"
                value={editedEmployee.email}
                onChange={(e) => handleInputChange("email", e.target.value)} // Handle input changes for email
                className="mb-4"
                errorMessage={errors.email}
              />

              <RoleDropdown
                label="Role"
                placeholder="Select a role"
                value={editedEmployee.role}
                onChange={(role) => handleInputChange("role", role)} // Handle role selection
                roles={filteredRoles} // Filtered roles excluding CEO if one already exists
                className="mb-4"
                errorMessage={errors.role}
              />

              {!loading && (
                <ReportingLineManager
                  label="Reporting Line Manager"
                  onSelectionChange={handleManagerChange} // Handle reporting manager selection
                  initialSelection={editedEmployee.reporting_line_manager}
                  employees={employees.filter(
                    (emp) => emp.id !== editedEmployee.id // Exclude the current employee from the list
                  )}
                  currentEmployeeId={editedEmployee.id}
                  disabled={editedEmployee.role === "CEO"} // Disable manager selection for CEO
                  errorMessage={errors.reporting_line_manager}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                className="w-full mb-2"
                color="danger"
                variant="light"
                onPress={() => {
                  onDelete(editedEmployee.id); // Call delete function when user is deleted
                  onCloseModal(); // Close the modal after deletion
                }}
              >
                Delete User
              </Button>
              <Button className="w-full" color="primary" onPress={handleUpdate}>
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;
