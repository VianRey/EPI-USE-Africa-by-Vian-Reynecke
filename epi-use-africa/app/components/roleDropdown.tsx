import React, { useState, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/react";

interface Role {
  role: string;
}

interface RoleDropdownProps {
  label: string;
  placeholder: string;
  onSelectionChange: (role: string) => void;
  initialSelection?: string; // Optional prop for initial selection
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({
  label,
  placeholder,
  onSelectionChange,
  initialSelection = "", // Default value for initialSelection
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(initialSelection);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
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
          const errorData = await response.json();
          console.error("Error response:", errorData);
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${JSON.stringify(
              errorData
            )}`
          );
        }
        const data: Role[] = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        setError("Failed to fetch roles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    // If there is an initial selection, trigger the onSelectionChange with it
    if (initialSelection) {
      onSelectionChange(initialSelection);
    }
  }, [initialSelection, onSelectionChange]);

  const handleSelectionChange = (keys: any) => {
    // The keys object might be a SharedSelection type, so extract the selected key safely
    const selectedValue = Array.isArray(keys) ? keys[0] : keys.currentKey || "";
    setSelectedRole(selectedValue);
    onSelectionChange(selectedValue);
  };

  if (error) return <p>{error}</p>;

  return (
    <Select
      variant="faded"
      label={label}
      placeholder={placeholder}
      className="w-full mb-2"
      selectedKeys={selectedRole ? new Set([selectedRole]) : new Set()}
      onSelectionChange={handleSelectionChange}
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
    >
      {roles.map((role) => (
        <SelectItem key={role.role} value={role.role}>
          {role.role}
        </SelectItem>
      ))}
    </Select>
  );
};

export default RoleDropdown;
