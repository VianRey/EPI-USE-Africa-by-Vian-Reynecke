import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import md5 from "md5";

interface Employee {
  id: number;
  name: string;
  surname: string;
  role: string;
  email: string;
  reporting_line_manager: string | null;
}

interface ReportingLineManagerProps {
  label: string;
  placeholder: string;
  onSelectionChange: (manager: number | null) => void;
  initialSelection?: string | number | null;
  disabled?: boolean;
}

const ReportingLineManager: React.FC<ReportingLineManagerProps> = ({
  label,
  placeholder,
  onSelectionChange,
  initialSelection = null,
  disabled = false,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedManager, setSelectedManager] = useState<number | null>(null);
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

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (employees.length > 0 && initialSelection !== null) {
      const initialSelectionNumber =
        typeof initialSelection === "string"
          ? parseInt(initialSelection, 10)
          : initialSelection;

      const matchingEmployee = employees.find(
        (employee) =>
          employee.id === initialSelectionNumber ||
          employee.role === initialSelection
      );
      if (matchingEmployee) {
        setSelectedManager(matchingEmployee.id);
        onSelectionChange(matchingEmployee.id);
      } else {
        setSelectedManager(null);
        onSelectionChange(null);
      }
    }
  }, [employees, initialSelection, onSelectionChange]);

  const handleSelect = useCallback(
    (value: React.Key) => {
      const selectedValue =
        typeof value === "string" ? parseInt(value, 10) : (value as number);
      setSelectedManager(selectedValue);
      onSelectionChange(selectedValue);
    },
    [onSelectionChange]
  );

  const getGravatarUrl = useMemo(
    () => (email: string) => {
      const hash = md5(email.toLowerCase().trim());
      return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
    },
    []
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Select
      variant="faded"
      items={employees}
      label={label}
      placeholder={placeholder}
      isDisabled={disabled}
      classNames={{
        trigger: [
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
        label: [
          "text-gray-500 dark:text-gray-400",
          "group-data-[focused=true]:text-red-500 !important",
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
            "data-[pressed=true]:opacity-70",
            "data-[focus-visible=true]:ring-gray-400 dark:data-[focus-visible=true]:ring-gray-600",
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
        selectedManager !== null
          ? new Set([selectedManager.toString()])
          : new Set()
      }
      onSelectionChange={(keys) => handleSelect(Array.from(keys)[0])}
    >
      {(employee) => (
        <SelectItem
          key={employee.id.toString()}
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
  );
};

export default ReportingLineManager;
