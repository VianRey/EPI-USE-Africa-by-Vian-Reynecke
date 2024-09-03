import React, { useState, useEffect } from "react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import md5 from "md5";

interface Manager {
  id: string;
  name: string;
  surname: string;
  role: string;
}

interface ReportingLineManagerProps {
  label: string;
  placeholder: string;
  onSelectionChange: (manager: string) => void;
  initialSelection?: string | null; // Optional prop for initial selection
}

const ReportingLineManager: React.FC<ReportingLineManagerProps> = ({
  label,
  placeholder,
  onSelectionChange,
  initialSelection = null,
}) => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedManager, setSelectedManager] = useState<string | null>(
    initialSelection
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://lfilvjszdheghtldasjg.supabase.co/functions/v1/api",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: "getReportingLineManager" }),
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
        const data: Manager[] = await response.json();
        setManagers(data);
      } catch (error) {
        console.error("Failed to fetch managers:", error);
        setError("Failed to fetch managers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchManagers();
  }, []);

  useEffect(() => {
    if (initialSelection) {
      setSelectedManager(initialSelection);
      onSelectionChange(initialSelection);
    }
  }, [initialSelection, onSelectionChange]);

  const getGravatarUrl = (email: string) => {
    const hash = md5(email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  const handleSelectionChange = (keys: any) => {
    const selectedValue = Array.isArray(keys) ? keys[0] : keys.currentKey || "";
    setSelectedManager(selectedValue);
    onSelectionChange(selectedValue);
  };

  if (loading) return <p>Loading managers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Select
      variant="faded"
      label={label}
      placeholder={placeholder}
      className="w-full mb-2"
      selectedKeys={selectedManager ? new Set([selectedManager]) : new Set()}
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
      {managers.map((manager) => (
        <SelectItem
          key={manager.id}
          textValue={`${manager.name} ${manager.surname}`}
        >
          <div className="flex gap-2 items-center">
            <Avatar
              alt={`${manager.name} ${manager.surname}`}
              className="flex-shrink-0"
              size="sm"
              src={getGravatarUrl(
                `${manager.name}.${manager.surname}@example.com`
              )}
            />
            <div className="flex flex-col">
              <span className="text-small dark:text-white">{`${manager.name} ${manager.surname}`}</span>
              <span className="text-tiny text-default-400 dark:text-gray-300">
                {manager.role}
              </span>
            </div>
          </div>
        </SelectItem>
      ))}
    </Select>
  );
};

export default ReportingLineManager;
