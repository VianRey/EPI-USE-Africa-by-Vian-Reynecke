import React, { useState, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Avatar, Button } from "@nextui-org/react";
import md5 from "md5";
import { FaEdit } from "react-icons/fa";

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
    console.log("handleEditUser called with employee:", employee);
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
    onEditUser(employee);
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

  const getRelatedEmployees = (
    employees: Employee[],
    searchTerm: string
  ): Set<string> => {
    const relatedEmployees = new Set<string>();

    // Start by finding all employees that match the search term
    const matchedEmployees = employees.filter((emp) => {
      const matches = `${emp.name} ${emp.surname} ${emp.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      // if (matches) {
      //   console.log(`Matched employee: ${emp.name} ${emp.surname}`);
      // }
      return matches;
    });

    // Add all matched employees and their reporting chain (both managers and subordinates)
    const queue = [...matchedEmployees];

    while (queue.length > 0) {
      const emp = queue.shift()!;
      // console.log(`Processing employee: ${emp.name} ${emp.surname}`);

      // Avoid duplicates
      if (relatedEmployees.has(emp.id)) {
        // console.log(`Skipping duplicate employee: ${emp.name} ${emp.surname}`);
        continue;
      }

      relatedEmployees.add(emp.id);
      // console.log(
      //   `Added employee to relatedEmployees: ${emp.name} ${emp.surname}`
      // );

      // Add manager to the queue
      const manager = employees.find(
        (e) => e.id === emp.reporting_line_manager
      );
      if (manager && !relatedEmployees.has(manager.id)) {
        // console.log(
        //   `Added manager to queue: ${manager.name} ${manager.surname}`
        // );
        queue.push(manager);
      }

      // Add direct reports to the queue
      const directReports = employees.filter(
        (e) => e.reporting_line_manager === emp.id
      );
      for (const report of directReports) {
        if (!relatedEmployees.has(report.id)) {
          // console.log(
          //   `Added direct report to queue: ${report.name} ${report.surname}`
          // );
          queue.push(report);
        }
      }
    }

    // console.log("Final related employees set:", Array.from(relatedEmployees));
    return relatedEmployees;
  };

  const buildHierarchy = (
    employees: Employee[],
    managerRole: string | null = null,
    relatedEmployees: Set<string>,
    processedEmployees: Set<string> = new Set() // Add a set to track processed employees
  ): HierarchyNode[] => {
    console.log(`Building hierarchy for managerRole: ${managerRole}`);

    const hierarchy = employees
      .filter(
        (emp) =>
          emp.reporting_line_manager === managerRole && // Compare by role instead of ID
          relatedEmployees.has(emp.id) &&
          !processedEmployees.has(emp.id) // Ensure the employee has not been processed yet
      )
      .map((emp) => {
        console.log(
          `Creating node for employee: ${emp.name} ${emp.surname} (Role: ${emp.role})`
        );

        // Add this employee to the processed set to avoid infinite loops
        processedEmployees.add(emp.id);

        return {
          label: renderEmployeeNode(emp),
          children: buildHierarchy(
            employees,
            emp.role,
            relatedEmployees,
            processedEmployees
          ), // Pass processedEmployees set to track
          employee: emp,
        };
      });

    console.log(`Hierarchy nodes for managerRole ${managerRole}:`, hierarchy);
    return hierarchy;
  };

  const relatedEmployees = getRelatedEmployees(employees, searchTerm);
  const filteredHierarchy = buildHierarchy(employees, null, relatedEmployees);

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
