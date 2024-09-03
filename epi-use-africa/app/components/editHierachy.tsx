import React, { useState, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Avatar, Button } from "@nextui-org/react";
import md5 from "md5";
import { FaEdit } from "react-icons/fa";
import EditUserModal from "../components/editUser";

interface Employee {
  id: string;
  name: string;
  surname: string;
  role: string;
  email: string;
  reporting_line_manager: string | null;
}

interface EmployeeHierarchyProps {
  employees: Employee[];
  onEditUser: (employee: Employee) => void;
  expandedByDefault: boolean;
}

interface HierarchyNode {
  label: React.ReactNode;
  children: HierarchyNode[];
  employee?: Employee;
}

const EmployeeHierarchy: React.FC<EmployeeHierarchyProps> = ({
  employees,
  onEditUser,
  expandedByDefault,
}) => {
  const [searchTerm, setSearchTerm] = useState(""); // Added searchTerm state
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  useEffect(() => {
    if (expandedByDefault) {
      setExpandedNodes(new Set(employees.map((emp) => emp.id)));
    }
  }, [employees, expandedByDefault]);

  const getGravatarUrl = (email: string) => {
    const hash = md5(email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  const handleEditUser = (employee: Employee) => {
    console.log("handleEditUser called with employee:", employee);
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
    onEditUser(employee); // Call the original onEditUser prop if needed
  };

  const handleUpdateUser = (updatedEmployee: Employee) => {
    // Implement update logic here
    console.log("Updating employee:", updatedEmployee);
    setIsEditModalOpen(false);
    // You should update the employees state here
  };

  const handleDeleteUser = (employeeId: string) => {
    // Implement delete logic here
    console.log("Deleting employee:", employeeId);
    setIsEditModalOpen(false);
    // You should update the employees state here
  };

  const renderEmployeeNode = (employee: Employee) => (
    <div className="flex items-center p-2 border rounded-lg shadow-sm dark:bg-gray-700 dark:text-white">
      <Avatar src={getGravatarUrl(employee.email)} size="sm" />
      <div className="ml-2 flex-grow">
        <div className="font-semibold text-sm">{`${employee.name} ${employee.surname}`}</div>
        <div className="text-xs text-gray-400">{employee.role}</div>
      </div>
      <Button
        size="sm"
        isIconOnly
        variant="light"
        onClick={() => handleEditUser(employee)}
      >
        <FaEdit size={12} />
      </Button>
    </div>
  );

  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.surname} ${employee.role}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const relatedEmployees = new Set<string>();
  filteredEmployees.forEach((emp) => {
    relatedEmployees.add(emp.id);
    // Add parents
    let manager = employees.find((e) => e.role === emp.reporting_line_manager);
    while (manager) {
      relatedEmployees.add(manager.id);
      // Check if manager is defined before accessing its properties
      const nextManagerRole = manager.reporting_line_manager;
      if (!nextManagerRole) break;
      manager = employees.find((e) => e.role === nextManagerRole);
    }
    // Add children
    const addChildren = (parentId: string) => {
      const children = employees.filter(
        (e) => e.reporting_line_manager === parentId
      );
      children.forEach((child) => {
        relatedEmployees.add(child.id);
        addChildren(child.role);
      });
    };
    addChildren(emp.role);
  });
  const buildHierarchy = (
    employees: Employee[],
    managerRole: string | null = null
  ): HierarchyNode[] => {
    return employees
      .filter((emp) => emp.reporting_line_manager === managerRole)
      .map((emp) => {
        const children = buildHierarchy(employees, emp.role);

        // Check if this employee matches the search term or if any of their children do
        const matchesSearchTerm =
          `${emp.name} ${emp.surname} ${emp.role}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) || children.length > 0;

        if (matchesSearchTerm) {
          return {
            label: renderEmployeeNode(emp),
            children,
            employee: emp,
          };
        }
        return null;
      })
      .filter((node) => node !== null) as HierarchyNode[];
  };
  const filteredHierarchy = buildHierarchy(
    employees.filter((emp) => relatedEmployees.has(emp.id))
  );

  const renderTreeNodes = (nodes: HierarchyNode[]): React.ReactNode => {
    return nodes.map((node) => (
      <TreeNode key={node.employee?.id} label={node.label}>
        {renderTreeNodes(node.children)}
      </TreeNode>
    ));
  };

  return (
    <>
      <div className="p-4 overflow-x-auto max-w-full">
        <div className="min-w-max">
          <Tree
            lineWidth="2px"
            lineColor="#ccc"
            lineBorderRadius="10px"
            label={
              <div className="font-bold text-xl mb-4 text-white">
                Company Structure
              </div>
            }
          >
            {renderTreeNodes(filteredHierarchy)}
          </Tree>
        </div>
      </div>
    </>
  );
};

export default EmployeeHierarchy;
