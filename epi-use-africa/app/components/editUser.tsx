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

interface Employee {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  reporting_line_manager: string | null;
  profileImageUrl?: string;
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

  const initializeEmployee = useCallback(() => {
    if (employee) {
      setEditedEmployee({ ...employee });
    }
  }, [employee]);

  useEffect(() => {
    if (isOpen) {
      initializeEmployee();
    } else {
      setEditedEmployee(null);
    }
  }, [isOpen, initializeEmployee]);

  const getGravatarUrl = (email: string) => {
    const hash = md5(email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  const handleUpdate = async () => {
    if (editedEmployee) {
      onUpdate(editedEmployee);
      onClose();
    }
  };

  const handleInputChange = (field: keyof Employee, value: string | null) => {
    setEditedEmployee((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  return (
    <Modal
      className="bg-gray-800 text-white"
      isOpen={isOpen}
      onOpenChange={onClose}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Employee
            </ModalHeader>
            <ModalBody>
              {editedEmployee ? (
                <>
                  <div className="flex justify-center mb-4">
                    <Avatar
                      src={getGravatarUrl(editedEmployee.email)}
                      size="lg"
                      alt="User Avatar"
                    />
                  </div>

                  <p className="text-sm text-gray-400 mb-4">
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

                  <CustomInput
                    label="Name"
                    value={editedEmployee.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mb-2"
                  />
                  <CustomInput
                    label="Surname"
                    value={editedEmployee.surname}
                    onChange={(e) =>
                      handleInputChange("surname", e.target.value)
                    }
                    className="mb-2"
                  />
                  <CustomInput
                    label="Email"
                    value={editedEmployee.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="mb-2"
                  />

                  <RoleDropdown
                    label="Role"
                    placeholder="Select a role"
                    onSelectionChange={(role) =>
                      handleInputChange("role", role)
                    }
                    initialSelection={editedEmployee.role}
                  />

                  <ReportingLineManager
                    label="Reporting Line Manager"
                    placeholder="Select a manager"
                    onSelectionChange={(manager) =>
                      handleInputChange(
                        "reporting_line_manager",
                        manager !== null ? manager.toString() : null
                      )
                    }
                    initialSelection={editedEmployee.reporting_line_manager}
                  />
                </>
              ) : (
                <p>Loading employee data...</p>
              )}
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-col w-full">
                <Button
                  className="w-full"
                  color="danger"
                  variant="light"
                  onPress={() => {
                    if (editedEmployee) {
                      onDelete(editedEmployee.id);
                      onCloseModal();
                    }
                  }}
                >
                  Delete User
                </Button>
                <Button
                  className="w-full mt-2"
                  color="primary"
                  onPress={handleUpdate}
                >
                  Update
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;
