import React, { useState, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Avatar, Button } from "@nextui-org/react";
import md5 from "md5";
import { FaEdit, FaPlus, FaMinus } from "react-icons/fa";

interface Employee {
  id: string;
  name: string;
  surname: string;
  role: string;
  email: string;
  reporting_line_manager: string | null;
  reporting_id: string | null; // Add this line
  profileImageUrl?: string;
  birthDate?: string;
  salary?: string;
}

interface EmployeeHierarchyProps {
  employees: Employee[];
  onEditUser?: (employee: Employee) => void;
  expandedByDefault: boolean;
  mode: "edit" | "view";
  searchTerm: string;
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
  mode,
  searchTerm,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

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
    if (onEditUser) {
      onEditUser(employee);
    }
  };

  const toggleExpand = (employeeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  const matchesSearch = (employee: Employee) => {
    if (!searchTerm.trim()) return false; // Return false if searchTerm is empty or just whitespace
    const searchLower = searchTerm.toLowerCase().trim();
    return (
      employee.name.toLowerCase().includes(searchLower) ||
      employee.surname.toLowerCase().includes(searchLower) ||
      employee.role.toLowerCase().includes(searchLower)
    );
  };

  const renderEmployeeNode = (employee: Employee, hasChildren: boolean) => {
    const isHighlighted = matchesSearch(employee);
    return (
      <div
        key={employee.id}
        className={`flex items-center p-2 border rounded-lg shadow-sm ${
          isHighlighted
            ? "bg-yellow-100 dark:bg-green-900 dark:text-white"
            : "dark:bg-gray-700 dark:text-white"
        }`}
      >
        <Avatar src={getGravatarUrl(employee.email)} size="sm" />
        <div className="ml-2 flex-grow">
          <div className="font-semibold text-sm">{`${employee.name} ${employee.surname}`}</div>
          <div className="text-xs text-gray-400">{employee.role}</div>
        </div>
        {mode === "edit" ? (
          <Button
            size="sm"
            isIconOnly
            variant="light"
            onClick={() => handleEditUser(employee)}
          >
            <FaEdit size={12} />
          </Button>
        ) : (
          hasChildren && (
            <Button
              size="sm"
              isIconOnly
              variant="light"
              onClick={() => toggleExpand(employee.id)}
            >
              {expandedNodes.has(employee.id) ? (
                <FaMinus size={12} />
              ) : (
                <FaPlus size={12} />
              )}
            </Button>
          )
        )}
      </div>
    );
  };

  const buildHierarchy = (
    employees: Employee[],
    managerRole: string | null = null
  ): HierarchyNode[] => {
    const hierarchy = employees
      .filter((emp) => emp.reporting_line_manager === managerRole)
      .map((emp) => {
        const children = buildHierarchy(employees, emp.role);
        const hasChildren = children.length > 0;

        return {
          label: renderEmployeeNode(emp, hasChildren),
          children: children,
          employee: emp,
        };
      });

    return hierarchy;
  };

  const renderTreeNodes = (nodes: HierarchyNode[]): React.ReactNode => {
    return nodes.map((node) => (
      <TreeNode
        key={`${node.employee?.id}-${node.employee?.role}`}
        label={node.label}
      >
        {(expandedNodes.has(node.employee!.id) || searchTerm.trim()) &&
          renderTreeNodes(node.children)}
      </TreeNode>
    ));
  };

  const hierarchy = buildHierarchy(employees);

  return (
    <div className="p-4 overflow-x-auto max-w-full">
      <div className="min-w-max">
        <Tree
          lineWidth="2px"
          lineColor="#ccc"
          lineBorderRadius="10px"
          label={""}
        >
          {renderTreeNodes(hierarchy)}
        </Tree>
      </div>
    </div>
  );
};

export default EmployeeHierarchy;
