/**
 * This component, `CustomInput`, is a reusable input field component for form elements.
 * It wraps around the `Input` component from the `@nextui-org/react` library, applying custom styles
 * for a more polished and modern look, including support for dark mode.
 *
 * It accepts all `InputProps` from the NextUI Input component and passes them to the underlying Input.
 * Custom styles are applied using the `classNames` property, enabling consistent theming across light and dark modes.
 *
 * It also handles displaying an error message if `errorMessage` prop is provided.
 */

import React from "react";
import { Input, InputProps } from "@nextui-org/react";

// CustomInput component that extends NextUI's Input component and applies custom styles
const CustomInput: React.FC<InputProps> = (props) => (
  <Input
    variant="faded"
    {...props}
    className="mb-4"
    classNames={{
      input: [
        "bg-transparent",
        "text-gray-800 dark:text-white",
        "dark:bg-gray-800",
        "dark:text-opacity-100",
      ],
      innerWrapper: "bg-transparent",
      inputWrapper: [
        "shadow-xl",
        "bg-white dark:bg-gray-800",
        "backdrop-blur-xl",
        "backdrop-saturate-200",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "group-data-[focused=true]:bg-white dark:group-data-[focused=true]:bg-gray-800",
        "cursor-text",
        "border-gray-300 dark:border-gray-600",
        "dark:bg-gray-900",
      ],
      label: [
        "text-gray-500 dark:text-gray-400",
        "group-data-[focused=true]:text-blue-500",
      ],
      errorMessage: ["text-red-500", "text-sm", "mt-1"],
    }}
    isInvalid={!!props.errorMessage}
  />
);

export default CustomInput;
