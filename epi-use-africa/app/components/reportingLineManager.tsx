/**
 * The `ReportingLineManager` component is a dropdown that allows selecting an employee's reporting line manager from a filtered list.
 * It ensures that the current employee and their subordinates are excluded from the available manager options to prevent circular reporting.
 * The component dynamically renders the selected manager's name and avatar and handles employee selection changes via the `onSelectionChange` callback.
 * It also supports error messaging and optional initial selection.
 */

import React, { useState, useEffect, useMemo } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import md5 from "md5";
import { Employee } from "../components/editUser";

interface ReportingLineManagerProps {
  label: string;
  onSelectionChange: (
    managerRole: string | null,
    managerId: string | null
  ) => void; // Updated
  initialSelection?: string | null;
  disabled?: boolean; // Disable dropdown if true
  employees: Employee[]; // List of all employees to populate the dropdown
  errorMessage?: string;
  className?: string;
  currentEmployeeId?: string; // ID of the current employee to exclude them and their subordinates
}

const ReportingLineManager: React.FC<ReportingLineManagerProps> = ({
  label,
  onSelectionChange,
  initialSelection = null,
  disabled = false,
  employees,
  errorMessage,
  className,
  currentEmployeeId,
}) => {
  const [selectedManagerRole, setSelectedManagerRole] = useState<string | null>(
    initialSelection
  );

  // Set the initial manager selection if provided
  useEffect(() => {
    if (initialSelection !== null && employees.length > 0) {
      const matchingEmployee = employees.find(
        (employee) => employee.role === initialSelection
      );
      if (matchingEmployee) {
        setSelectedManagerRole(matchingEmployee.role);
      } else {
        setSelectedManagerRole(null);
      }
    }
  }, [employees, initialSelection, currentEmployeeId]);

  // Function to get all subordinates of the current employee to avoid circular reporting
  const getSubordinates = (
    employeeId: string,
    allEmployees: Employee[]
  ): Set<string> => {
    const subordinates = new Set<string>();

    const addSubordinates = (id: string) => {
      const directReports = allEmployees.filter(
        (emp) => emp.reporting_id === id
      );

      for (const report of directReports) {
        if (!subordinates.has(report.id)) {
          subordinates.add(report.id);
          addSubordinates(report.id);
        }
      }
    };

    addSubordinates(employeeId);
    return subordinates;
  };

  // Filter out the current employee and their subordinates from the available manager options
  const filteredEmployees = useMemo(() => {
    if (!currentEmployeeId) {
      console.warn("No currentEmployeeId provided. Returning all employees.");
      return employees;
    }

    const subordinates = getSubordinates(currentEmployeeId, employees);

    const filtered = employees.filter(
      (emp) => !subordinates.has(emp.id) && emp.id !== currentEmployeeId
    );

    return filtered;
  }, [employees, currentEmployeeId]);

  // Handle manager selection change and pass the role and ID to the callback
  const handleSelect = (value: React.Key) => {
    const selectedValue = value.toString();
    const [role, id] = selectedValue.split("-");
    setSelectedManagerRole(role);
    onSelectionChange(role, id); // Pass both role and id to parent component
  };

  // Generate Gravatar URL based on the employee's email
  const getGravatarUrl = (email: string) => {
    const hash = md5(email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  // Find the selected employee from the filtered list
  const selectedEmployee = filteredEmployees.find(
    (emp) => emp.role === selectedManagerRole
  );

  // Render the selected manager's name and avatar
  const renderSelectedValue = () => {
    if (!selectedEmployee) return label;
    return (
      <div className="flex gap-2 items-center">
        <Avatar
          alt={`${selectedEmployee.name} ${selectedEmployee.surname}`}
          className="flex-shrink-0"
          size="sm"
          src={getGravatarUrl(selectedEmployee.email)}
        />
        <div className="flex flex-col">
          <span className="text-small">{`${selectedEmployee.name} ${selectedEmployee.surname}`}</span>
          <span className="text-tiny text-default-400">
            {selectedEmployee.role}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <Select
        variant="faded"
        items={filteredEmployees}
        label={label}
        isDisabled={disabled}
        classNames={{
          base: `w-full ${errorMessage ? "border-red-500" : ""}`,
          trigger: [
            "min-h-unit-12",
            "h-auto",
            "py-2",
            "bg-transparent",
            "text-gray-800 dark:text-white",
            "shadow-xl",
            "bg-white dark:bg-gray-800",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-gray-100 dark:hover:bg-gray-800",
            "group-data-[focused=true]:bg-white dark:group-data-[focused=true]:bg-gray-800",
            "cursor-pointer",
            "border-gray-300 dark:border-gray-600",
            "dark:bg-gray-900",
            errorMessage ? "border-red-500" : "",
          ],
          innerWrapper: "bg-transparent !important",
          selectorIcon: "text-gray-500 dark:text-gray-400",
          value: "text-gray-800 dark:text-white",
          label: [
            "text-gray-500 dark:text-gray-400 group-data-[filled=true]:-translate-y-5",
            "group-data-[filled=true]:text-gray-500",
            errorMessage ? "text-red-500 dark:text-red-500" : "",
            "group-data-[focused=true]:!text-red-500",
          ],
        }}
        listboxProps={{
          itemClasses: {
            base: [
              "rounded-md",
              "transition-opacity",
              "text-gray-800 dark:text-white",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              "hover:text-gray-900 dark:hover:text-white",
              "data-[selected=true]:bg-gray-200 dark:data-[selected=true]:bg-gray-600",
              "data-[selected=true]:text-gray-900 dark:data-[selected=true]:text-white",
              "data-[selectable=true]:focus:bg-gray-100 dark:data-[selectable=true]:focus:bg-gray-700",
            ],
          },
        }}
        popoverProps={{
          classNames: {
            base: "before:bg-default-200",
            content: "p-0 bg-background dark:bg-gray-800 !important",
          },
        }}
        selectedKeys={
          selectedManagerRole !== null
            ? new Set([`${selectedManagerRole}-${selectedEmployee?.id || ""}`])
            : new Set()
        }
        onSelectionChange={(keys) => handleSelect(Array.from(keys)[0])}
        renderValue={renderSelectedValue} // Display selected manager's name and avatar
      >
        {(employee) => (
          <SelectItem
            key={`${employee.role}-${employee.id}`}
            textValue={`${employee.name} ${employee.surname}`}
          >
            <div className="flex gap-2 items-center py-2 ">
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
      {errorMessage && !disabled && (
        <div className="text-red-500 text-xs mt-2">{errorMessage}</div>
      )}
    </div>
  );
};

export default ReportingLineManager;
