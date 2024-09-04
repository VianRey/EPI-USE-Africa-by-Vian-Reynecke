import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
} from "@nextui-org/react";
import md5 from "md5";
import CustomInput from "../components/inputCustom";
import RoleDropdown from "../components/roleDropdown";
import ReportingLineManager from "../components/reportingLineManager";

// Updated Employee interface
export interface Employee {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  reporting_line_manager: string | null;
  profileImageUrl?: string;
}

interface Role {
  role: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onUpdate: (updatedEmployee: Employee) => void;
  onDelete: (employeeId: string) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  employee,
  onUpdate,
  onDelete,
}) => {
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data: Employee[] = await response.json();
      data.sort((a, b) => a.role.localeCompare(b.role));
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setError("Failed to fetch employees. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://lfilvjszdheghtldasjg.supabase.co/functions/v1/api",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "getRole" }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Role[] = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setError("Failed to fetch roles. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchEmployees(), fetchRoles()]).then(() => setLoading(false));
  }, [fetchEmployees, fetchRoles]);

  useEffect(() => {
    if (isOpen && employee) {
      setEditedEmployee({ ...employee });
    } else if (!isOpen) {
      setEditedEmployee(null);
    }
  }, [isOpen, employee]);

  const getGravatarUrl = useCallback((email: string) => {
    const hash = md5(email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  }, []);

  const handleInputChange = useCallback(
    (field: keyof Employee, value: string | null) => {
      setEditedEmployee((prev) => {
        if (!prev) return null;

        // If the role is changed to CEO, set the reporting line manager to null
        if (field === "role" && value === "CEO") {
          return { ...prev, [field]: value, reporting_line_manager: null };
        }

        return { ...prev, [field]: value };
      });
    },
    []
  );

  const handleManagerChange = useCallback(
    (managerId: string | null) => {
      if (editedEmployee?.reporting_line_manager !== managerId) {
        handleInputChange("reporting_line_manager", managerId);
      }
    },
    [handleInputChange, editedEmployee]
  );

  // Check if a CEO exists and exclude the "CEO" role if a CEO already exists (except if the edited employee is the CEO)
  const ceoExists = employees.some(
    (emp) => emp.role === "CEO" && emp.id !== editedEmployee?.id
  );

  const filteredRoles = ceoExists
    ? roles.filter((role) => role.role !== "CEO")
    : roles;

  if (!editedEmployee) {
    return null;
  }

  return (
    <Modal
      className="dark:bg-gray-800 bg-white dark:text-white"
      isOpen={isOpen}
      onOpenChange={onClose}
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[95vh] h-[95vh] sm:h-auto sm:max-h-[95vh]",
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
                  src={getGravatarUrl(editedEmployee.email)}
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
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="mb-4"
              />
              <CustomInput
                label="Surname"
                value={editedEmployee.surname}
                onChange={(e) => handleInputChange("surname", e.target.value)}
                className="mb-4"
              />
              <CustomInput
                label="Email"
                value={editedEmployee.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mb-4"
              />

              <RoleDropdown
                label="Role"
                placeholder="Select a role"
                value={editedEmployee.role}
                onChange={(role) => handleInputChange("role", role)}
                roles={filteredRoles}
                className="mb-4"
              />

              <ReportingLineManager
                label="Reporting Line Manager"
                onSelectionChange={handleManagerChange}
                initialSelection={editedEmployee.reporting_line_manager}
                employees={employees.filter(
                  (emp) => emp.id !== editedEmployee?.id
                )}
                disabled={editedEmployee.role === "CEO"}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                className="w-full mb-2"
                color="danger"
                variant="light"
                onPress={() => {
                  onDelete(editedEmployee.id);
                  onCloseModal();
                }}
              >
                Delete User
              </Button>
              <Button
                className="w-full"
                color="primary"
                onPress={() => {
                  onUpdate(editedEmployee);
                  onCloseModal();
                }}
              >
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
