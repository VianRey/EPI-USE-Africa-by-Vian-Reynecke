import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4"
    >
      {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
    </Button>
  );
}
