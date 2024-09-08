import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className="dark:bg-gray-900 bg-gray-200"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
    </Button>
  );
}

export default ThemeToggle;
