import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Skeleton,
} from "@nextui-org/react";
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
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingManagers, setIsLoadingManagers] = useState(true);

  useEffect(() => {
    if (employee) {
      setEditedEmployee({ ...employee });
      // Simulate loading for roles and managers
      setTimeout(() => setIsLoadingRoles(false), 1000); // Simulate 1 second loading time
      setTimeout(() => setIsLoadingManagers(false), 1200); // Simulate 1.2 second loading time
    }
  }, [employee]);

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
                  <CustomInput
                    label="Name"
                    value={editedEmployee.name}
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        name: e.target.value,
                      })
                    }
                    className="mb-2"
                  />
                  <CustomInput
                    label="Surname"
                    value={editedEmployee.surname}
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        surname: e.target.value,
                      })
                    }
                    className="mb-2"
                  />
                  <CustomInput
                    label="Email"
                    value={editedEmployee.email}
                    onChange={(e) =>
                      setEditedEmployee({
                        ...editedEmployee,
                        email: e.target.value,
                      })
                    }
                    className="mb-2"
                  />

                  {/* Role Dropdown with Skeleton */}
                  {isLoadingRoles ? (
                    <Skeleton
                      className="
                        relative 
                        w-full 
                        h-14 
                        rounded-medium 
                        bg-transparent 
                        dark:bg-gray-900 
                        dark:border-gray-100 
                        px-3 
                        py-2 
                        text-gray-800 
                        dark:text-white 
                        shadow-xl
                    "
                    />
                  ) : (
                    <RoleDropdown
                      label="Role"
                      placeholder="Select a role"
                      onSelectionChange={(role) =>
                        setEditedEmployee({
                          ...editedEmployee,
                          role: role,
                        })
                      }
                      initialSelection={editedEmployee.role}
                    />
                  )}

                  {/* Reporting Line Manager with Skeleton */}
                  {isLoadingManagers ? (
                    <Skeleton
                      className="
                        relative 
                        w-full 
                        h-14 
                        rounded-medium 
                        bg-transparent 
                        dark:bg-gray-900 
                        dark:border-gray-100 
                        px-3 
                        py-2 
                        text-gray-800 
                        dark:text-white 
                        shadow-xl
                    "
                    />
                  ) : (
                    <ReportingLineManager
                      label="Reporting Line Manager"
                      placeholder="Select a manager"
                      onSelectionChange={(manager) =>
                        setEditedEmployee({
                          ...editedEmployee,
                          reporting_line_manager: manager || null,
                        })
                      }
                      initialSelection={editedEmployee.reporting_line_manager}
                    />
                  )}
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
                  className="w-full mt-2" // Added mt-2 to give space between buttons
                  color="primary"
                  onPress={() => {
                    if (editedEmployee) {
                      onUpdate(editedEmployee);
                      onCloseModal();
                    }
                  }}
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
