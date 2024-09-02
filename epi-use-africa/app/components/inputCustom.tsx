import React from "react";
import { Input, InputProps } from "@nextui-org/react";

const CustomInput: React.FC<InputProps> = (props) => (
  <Input
    variant="faded"
    {...props}
    className="mb-2"
    classNames={{
      input: [
        "bg-transparent !important",
        "text-gray-800 dark:text-white !important",
        "dark:bg-gray-800 !important",
        "dark:text-opacity-100 !important",
      ],
      innerWrapper: "bg-transparent !important",
      inputWrapper: [
        "shadow-xl",
        "bg-white dark:bg-gray-800 !important",
        "backdrop-blur-xl",
        "backdrop-saturate-200",
        "hover:bg-gray-100 dark:hover:bg-gray-800 !important",
        "group-data-[focused=true]:bg-white dark:group-data-[focused=true]:bg-gray-800 !important",
        "cursor-text !important",
        "border-gray-300 dark:border-gray-600 !important",
        "dark:bg-gray-900",
      ],
      label: [
        "text-gray-500 dark:text-gray-400",
        "group-data-[focused=true]:text-red-500 !important",
      ],
    }}
  />
);

export default CustomInput;
