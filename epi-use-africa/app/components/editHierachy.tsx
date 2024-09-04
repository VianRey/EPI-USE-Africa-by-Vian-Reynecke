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
}

interface EmployeeHierarchyProps {
  employees: Employee[];
  onEditUser?: (employee: Employee) => void; // Optional if used only in edit mode
  expandedByDefault: boolean;
  mode: "edit" | "view"; // New mode prop
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
}) => {
  const [searchTerm, setSearchTerm] = useState("");
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
    if (onEditUser) {
      setSelectedEmployee(employee);
      setIsEditModalOpen(true);
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

  const renderEmployeeNode = (employee: Employee, hasChildren: boolean) => (
    <div className="flex items-center p-2 border rounded-lg shadow-sm dark:bg-gray-700 dark:text-white">
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
        // Conditionally render plus/minus only if the node has children
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

  const getRelatedEmployees = (
    employees: Employee[],
    searchTerm: string
  ): Set<string> => {
    const relatedEmployees = new Set<string>();

    const matchedEmployees = employees.filter((emp) => {
      const matches = `${emp.name} ${emp.surname} ${emp.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matches;
    });

    const queue = [...matchedEmployees];

    while (queue.length > 0) {
      const emp = queue.shift()!;
      if (relatedEmployees.has(emp.id)) continue;

      relatedEmployees.add(emp.id);

      const manager = employees.find(
        (e) => e.id === emp.reporting_line_manager
      );
      if (manager && !relatedEmployees.has(manager.id)) {
        queue.push(manager);
      }

      const directReports = employees.filter(
        (e) => e.reporting_line_manager === emp.id
      );
      for (const report of directReports) {
        if (!relatedEmployees.has(report.id)) {
          queue.push(report);
        }
      }
    }

    return relatedEmployees;
  };

  const buildHierarchy = (
    employees: Employee[],
    managerRole: string | null = null,
    relatedEmployees: Set<string>,
    processedEmployees: Set<string> = new Set()
  ): HierarchyNode[] => {
    const hierarchy = employees
      .filter(
        (emp) =>
          emp.reporting_line_manager === managerRole &&
          relatedEmployees.has(emp.id) &&
          !processedEmployees.has(emp.id)
      )
      .map((emp) => {
        processedEmployees.add(emp.id);

        const children = buildHierarchy(
          employees,
          emp.role,
          relatedEmployees,
          processedEmployees
        );

        // Check if the employee has children (i.e., if the children array is not empty)
        const hasChildren = children.length > 0;

        return {
          label: renderEmployeeNode(emp, hasChildren),
          children: children,
          employee: emp,
        };
      });

    return hierarchy;
  };

  const relatedEmployees = getRelatedEmployees(employees, searchTerm);
  const filteredHierarchy = buildHierarchy(employees, null, relatedEmployees);

  const renderTreeNodes = (nodes: HierarchyNode[]): React.ReactNode => {
    return nodes.map((node) => (
      <TreeNode key={node.employee?.id} label={node.label}>
        {expandedNodes.has(node.employee!.id) && renderTreeNodes(node.children)}
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
            label={""}
          >
            {renderTreeNodes(filteredHierarchy)}
          </Tree>
        </div>
      </div>
    </>
  );
};

export default EmployeeHierarchy;
