import React, { useState, useEffect } from "react";
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
  profileImageUrl?: string; // Optional profile image URL
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

  useEffect(() => {
    if (employee) {
      setEditedEmployee({ ...employee });
    }
  }, [employee]);

  const getGravatarUrl = (email: string) => {
    const hash = md5(email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  const handleUpdate = async () => {
    if (editedEmployee) {
      onUpdate(editedEmployee);
    }
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
                  {/* Display Gravatar */}
                  <div className="flex justify-center mb-4">
                    <Avatar
                      src={getGravatarUrl(editedEmployee.email)}
                      size="sm"
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

                  {/* Role Dropdown */}
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

                  {/* Reporting Line Manager */}
                  <ReportingLineManager
                    label="Reporting Line Manager"
                    placeholder="Select a manager"
                    onSelectionChange={(manager) => {
                      console.log(manager),
                        setEditedEmployee({
                          ...editedEmployee,
                          reporting_line_manager: manager || null,
                        });
                    }}
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
