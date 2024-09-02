import React, { useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Avatar, Button } from "@nextui-org/react";
import md5 from "md5";
import { FaPlus, FaMinus } from "react-icons/fa";

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
}

interface HierarchyNode {
  label: React.ReactNode;
  children: HierarchyNode[];
  employee?: Employee;
}

const EmployeeHierarchy: React.FC<EmployeeHierarchyProps> = ({ employees }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const getGravatarUrl = (email: string) => {
    const hash = md5(email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderEmployeeNode = (employee: Employee) => (
    <div className="flex items-center p-2 border rounded-lg shadow-sm dark:bg-gray-700 dark:text-white">
      <Avatar src={getGravatarUrl(employee.email)} size="sm" />
      <div className="ml-2 flex-grow">
        <div className="font-semibold text-sm">{`${employee.name} ${employee.surname}`}</div>
        <div className="text-xs text-gray-400">{employee.role}</div>
      </div>
      {buildHierarchy(employees, employee.role).length > 0 && (
        <Button
          size="sm"
          isIconOnly
          variant="light"
          onClick={() => toggleNode(employee.id)}
        >
          {expandedNodes.has(employee.id) ? (
            <FaMinus size={12} />
          ) : (
            <FaPlus size={12} />
          )}
        </Button>
      )}
    </div>
  );

  const buildHierarchy = (
    employees: Employee[],
    managerRole: string | null = null
  ): HierarchyNode[] => {
    return employees
      .filter((emp) => emp.reporting_line_manager === managerRole)
      .sort((a, b) => a.role.localeCompare(b.role)) // Sort by role
      .map((emp) => ({
        label: renderEmployeeNode(emp),
        children: buildHierarchy(employees, emp.role),
        employee: emp,
      }));
  };

  const renderTreeNodes = (nodes: HierarchyNode[]): React.ReactNode => {
    return nodes.map((node) => (
      <TreeNode key={node.employee?.id} label={node.label}>
        {expandedNodes.has(node.employee?.id!) &&
          renderTreeNodes(node.children)}
      </TreeNode>
    ));
  };

  // Find the root node, typically the one with no reporting_line_manager
  const rootEmployees = employees.filter(
    (emp) => emp.reporting_line_manager === null
  );

  const hierarchy = rootEmployees.map((rootEmployee) => ({
    label: renderEmployeeNode(rootEmployee),
    children: buildHierarchy(employees, rootEmployee.role),
    employee: rootEmployee,
  }));

  return (
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
          {renderTreeNodes(hierarchy)}
        </Tree>
      </div>
    </div>
  );
};

export default EmployeeHierarchy;
