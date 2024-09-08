/**
 * This component, `EmployeeListView`, displays a paginated, searchable, sortable, and filterable table of employees.
 * The table includes columns for employee name, role, email, and manager, with actions to edit a user.
 * It features role and manager-based filtering, search functionality, and dynamic sorting.
 * It uses NextUI for the table UI, dropdowns, pagination, and input fields, as well as dynamic imports for better performance.
 * The employee Gravatar image is fetched using the MD5 hash of their email.
 */

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  User,
  Pagination,
  SortDescriptor,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import md5 from "md5";

// Dynamic import of custom input for performance optimization
const CustomInput = dynamic(() => import("../components/inputCustom"), {
  ssr: false,
});

// Utility function to get the Gravatar image URL based on an email address
const getGravatarUrl = (email: string) => {
  const hash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

// Define the structure of an Employee object
interface Employee {
  id: string;
  name: string;
  surname: string;
  role: string;
  email: string;
  reporting_id: string | null;
  reporting_line_manager: string | null;
}

interface EmployeeListViewProps {
  employees?: Employee[]; // List of employees to display
  onEditUser: (employee: Employee) => void; // Function to handle editing a user
  roles: { role: string }[]; // List of roles for filtering
}

// Main EmployeeListView component
const EmployeeListView: React.FC<EmployeeListViewProps> = ({
  employees = [],
  onEditUser,
  roles,
}) => {
  const [filterValue, setFilterValue] = useState(""); // Search filter input value
  const [selectedRole, setSelectedRole] = useState<Set<string>>(
    new Set(["All"])
  ); // State to store selected role for filtering
  const [selectedManager, setSelectedManager] = useState<Set<string>>(
    new Set(["All"])
  ); // State to store selected manager for filtering
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name", // Default column to sort by
    direction: "ascending", // Default sort direction
  });
  const [page, setPage] = useState(1); // Current page for pagination
  const rowsPerPage = 10; // Number of rows to display per page

  // Filter employees based on the search filter, selected role, and selected manager
  const filteredItems = useMemo(() => {
    let filteredEmployees = [...employees];

    // Filter by search term
    if (filterValue) {
      filteredEmployees = filteredEmployees.filter((employee) =>
        Object.values(employee).some((value) =>
          value?.toString().toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }

    // Filter by selected role
    const selectedRoleValue = Array.from(selectedRole)[0];
    if (selectedRoleValue !== "All") {
      filteredEmployees = filteredEmployees.filter(
        (employee) => employee.role === selectedRoleValue
      );
    }

    // Filter by selected manager
    const selectedManagerValue = Array.from(selectedManager)[0];
    if (selectedManagerValue !== "All") {
      filteredEmployees = filteredEmployees.filter(
        (employee) => employee.reporting_line_manager === selectedManagerValue
      );
    }

    return filteredEmployees;
  }, [employees, filterValue, selectedRole, selectedManager]);

  // Sort employees based on the current sort descriptor (column and direction)
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Employee, b: Employee) => {
      const first = a[sortDescriptor.column as keyof Employee];
      const second = b[sortDescriptor.column as keyof Employee];

      if (sortDescriptor.column === "reporting_line_manager") {
        // Handle null values for manager
        if (first === null && second === null) return 0;
        if (first === null)
          return sortDescriptor.direction === "descending" ? 1 : -1;
        if (second === null)
          return sortDescriptor.direction === "descending" ? -1 : 1;
      }

      if (first == null && second == null) return 0;
      if (first == null)
        return sortDescriptor.direction === "descending" ? 1 : -1;
      if (second == null)
        return sortDescriptor.direction === "descending" ? -1 : 1;

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor.column, sortDescriptor.direction]);

  // Calculate the number of pages and slice the sorted items to fit the current page
  const pages = Math.ceil(sortedItems.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems]);

  // Function to render each table cell based on the column key
  const renderCell = (employee: Employee, columnKey: React.Key) => {
    const cellValue = employee[columnKey as keyof Employee];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: getGravatarUrl(employee.email), // Get gravatar for the employee's email
            }}
            description={employee.email}
            name={`${employee.name} ${employee.surname}`}
          >
            {employee.email}
          </User>
        );
      case "role":
        return (
          <Chip className="capitalize" color="primary" size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <Button
            color="primary"
            size="sm"
            onClick={() => onEditUser(employee)} // Handle editing the user
          >
            Edit
          </Button>
        );
      default:
        return cellValue;
    }
  };

  // Handle search filter input change
  const onSearchChange = (value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  };

  // Extract a list of unique managers for filtering
  const managers = useMemo(() => {
    const uniqueManagers = new Set(
      employees
        .map((e) => e.reporting_line_manager)
        .filter((manager): manager is string => manager !== null)
    );
    return ["All", ...Array.from(uniqueManagers)];
  }, [employees]);

  // Render the search bar, role filter, and manager filter
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col ">
        <CustomInput
          label="Search employees"
          placeholder="Enter name, surname, or role"
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
          className="w-full"
        />
        <div className="flex justify-start gap-3">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="dark:bg-gray-900 bg-white border-2 border-gray-200 dark:border-gray-600"
              >
                {Array.from(selectedRole)[0] === "All"
                  ? "Filter by Role"
                  : Array.from(selectedRole)[0]}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              className="bg-white dark:bg-gray-900 border-white dark:border-gray-600 cursor-pointer text-gray-800 dark:text-white"
              aria-label="Role filter"
              selectedKeys={selectedRole}
              selectionMode="single"
              onSelectionChange={(keys) => {
                setSelectedRole(new Set(keys as Iterable<string>));
                setPage(1);
              }}
            >
              {[{ role: "All" }, ...roles].map((role) => (
                <DropdownItem
                  key={role.role}
                  className="transition-opacity data-[hover=true]:bg-default-100 data-[hover=true]:text-default-foreground"
                >
                  {role.role}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="dark:bg-gray-900 bg-white border-2 border-gray-200 dark:border-gray-600"
              >
                {Array.from(selectedManager)[0] === "All"
                  ? "Filter by Manager"
                  : Array.from(selectedManager)[0]}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              className="bg-white dark:bg-gray-900 border-white dark:border-gray-600 cursor-pointer text-gray-800 dark:text-white"
              aria-label="Manager filter"
              selectedKeys={selectedManager}
              selectionMode="single"
              onSelectionChange={(keys) => {
                setSelectedManager(new Set(keys as Iterable<string>));
                setPage(1);
              }}
            >
              {managers.map((manager) => (
                <DropdownItem
                  key={manager}
                  className="transition-opacity data-[hover=true]:bg-default-100 data-[hover=true]:text-default-foreground"
                >
                  {manager}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    );
  }, [filterValue, selectedRole, selectedManager, roles, managers]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[600px] dark:bg-gray-900 bg-gray-100",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader className="dark:bg-gray-900 bg-gray-100">
        <TableColumn
          className="dark:bg-gray-800 bg-white"
          key="name"
          allowsSorting
        >
          Name
        </TableColumn>
        <TableColumn
          className="dark:bg-gray-800 bg-white"
          key="role"
          allowsSorting
        >
          Role
        </TableColumn>
        <TableColumn
          className="dark:bg-gray-800 bg-white"
          key="email"
          allowsSorting
        >
          Email
        </TableColumn>
        <TableColumn
          className="dark:bg-gray-800 bg-white"
          key="reporting_line_manager"
          allowsSorting
        >
          Manager
        </TableColumn>
        <TableColumn className="dark:bg-gray-800 bg-white" key="actions">
          Actions
        </TableColumn>
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default EmployeeListView;
