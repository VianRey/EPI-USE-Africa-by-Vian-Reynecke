/**
 * The `RoleDropdown` component is a dropdown selector that allows users to choose a role from a list of predefined roles.
 * It accepts a list of roles, handles the selected role through the `onChange` callback, and displays an error message if provided.
 * This component is styled for both light and dark modes using NextUI's `Select` component.
 */

import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

interface Role {
  role: string;
}

interface RoleDropdownProps {
  label: string;
  placeholder: string;
  value: string; // The currently selected role
  onChange: (role: string) => void; // Callback function to handle role selection changes
  roles: Role[]; // Array of roles to display in the dropdown
  errorMessage?: string;
  className?: string;
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({
  label,
  placeholder,
  value,
  onChange,
  roles,
  errorMessage,
  className,
}) => {
  // Function to handle selection changes, calls the onChange prop with the selected role
  const handleSelectionChange = (keys: any) => {
    const selectedValue = Array.from(keys)[0] as string;
    onChange(selectedValue);
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <Select
        variant="faded"
        label={label}
        placeholder={placeholder}
        className="w-full mb-2"
        selectedKeys={value ? new Set([value]) : new Set()}
        onSelectionChange={handleSelectionChange}
        isInvalid={!!errorMessage}
        errorMessage={errorMessage}
        classNames={{
          base: "w-full",
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
            errorMessage ? "border-red-500" : "",
          ],
          innerWrapper: "bg-transparent !important",
          selectorIcon: "text-gray-500 dark:text-gray-400",
          value: "text-gray-800 dark:text-white",
          label: [
            "text-gray-500 dark:text-gray-400",
            "group-data-[focused=true]:text-red-500 !important",
          ],
          errorMessage: "text-red-500 text-sm mt-1", // Add this line for error message styling
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
      </Select>{" "}
    </div>
  );
};

export default RoleDropdown;
