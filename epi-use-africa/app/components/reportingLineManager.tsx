import React, { useState, useEffect, useMemo } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import md5 from "md5";
import { Employee } from "../components/editUser";

interface ReportingLineManagerProps {
  label: string;
  onSelectionChange: (managerRole: string | null) => void;
  initialSelection?: string | null;
  disabled?: boolean;
  employees: Employee[];
}

const ReportingLineManager: React.FC<ReportingLineManagerProps> = ({
  label,
  onSelectionChange,
  initialSelection = null,
  disabled = false,
  employees,
}) => {
  const [selectedManagerRole, setSelectedManagerRole] = useState<string | null>(
    initialSelection
  );

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
  }, [employees, initialSelection]);

  const handleSelect = (value: React.Key) => {
    const selectedValue = value.toString();
    setSelectedManagerRole(selectedValue);
    onSelectionChange(selectedValue);
  };

  const getGravatarUrl = (email: string) => {
    const hash = md5(email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  const selectedEmployee = employees.find(
    (emp) => emp.role === selectedManagerRole
  );

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
    <Select
      variant="faded"
      items={employees}
      label={label}
      isDisabled={disabled}
      classNames={{
        base: "w-full",
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
        ],
        innerWrapper: "bg-transparent !important",
        selectorIcon: "text-gray-500 dark:text-gray-400",
        value: "text-gray-800 dark:text-white",
        label: "group-data-[filled=true]:-translate-y-5",
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
          ? new Set([selectedManagerRole.toString()])
          : new Set()
      }
      onSelectionChange={(keys) => handleSelect(Array.from(keys)[0])}
      renderValue={renderSelectedValue}
    >
      {(employee) => (
        <SelectItem
          key={employee.role}
          textValue={`${employee.name} ${employee.surname}`}
          className=""
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
  );
};

export default ReportingLineManager;
