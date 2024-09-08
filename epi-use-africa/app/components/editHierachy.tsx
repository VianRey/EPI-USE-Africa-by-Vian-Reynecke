////////////////////////////////////////////////////////////////
// EmployeeHierarchy Component
// This component displays a hierarchical tree structure of employees
// using the react-organizational-chart library. Each employee is
// displayed as a node with their name, role, and an avatar pulled
// from Gravatar based on their email. The component supports
// two modes: 'view' and 'edit'. In 'edit' mode, users can trigger
// an edit function on an employee. The hierarchy is built based
// on the reporting structure of the employees.
//
// Key Features:
// 1. Dynamic hierarchy rendering based on employee data and reporting
//    relationships.
// 2. Avatar fetched from Gravatar using md5 hash of the employee's email.
// 3. Toggle expand/collapse functionality for nodes with children. (View Mode)
// 4. Search highlighting for nodes that match the search term.
// 5. Modes ('edit'/'view') determine if the edit button is displayed.
////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react"; // React hooks for managing state and lifecycle
import { Tree, TreeNode } from "react-organizational-chart"; // Tree structure for hierarchical display
import { Avatar, Button } from "@nextui-org/react"; // UI components from NextUI for Avatar and Button
import md5 from "md5"; // md5 for hashing email to generate Gravatar URLs
import { FaEdit, FaPlus, FaMinus } from "react-icons/fa"; // Icons for edit, expand, and collapse

// Employee interface to define the structure of an employee object
interface Employee {
  id: string;
  name: string;
  surname: string;
  role: string;
  email: string;
  reporting_line_manager: string | null;
  reporting_id: string | null; // ID of the employee's reporting manager
  profileImageUrl?: string; // Optional URL for the employee's profile image
  birthDate?: string;
  salary?: string;
}

// Props for the EmployeeHierarchy component
interface EmployeeHierarchyProps {
  employees: Employee[]; // Array of employees to be rendered in the hierarchy
  onEditUser?: (employee: Employee) => void; // Optional function to handle editing an employee
  expandedByDefault: boolean; // Boolean to determine if all nodes should be expanded by default
  mode: "edit" | "view"; // Determines if the component is in 'edit' or 'view' mode
  searchTerm: string; // Search term to highlight matching nodes
}

// HierarchyNode interface to define the structure of each node in the hierarchy
interface HierarchyNode {
  label: React.ReactNode; // The content (label) to be displayed for each node
  children: HierarchyNode[]; // Array of child nodes
  employee?: Employee; // Optional employee object associated with the node
}

// EmployeeHierarchy component
const EmployeeHierarchy: React.FC<EmployeeHierarchyProps> = ({
  employees,
  onEditUser,
  expandedByDefault,
  mode,
  searchTerm,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set()); // State to track expanded nodes

  // Automatically expand all nodes if expandedByDefault is true
  useEffect(() => {
    if (expandedByDefault) {
      setExpandedNodes(new Set(employees.map((emp) => emp.id))); // Expand all nodes by default
    }
  }, [employees, expandedByDefault]);

  // Function to get Gravatar URL for an employee's email
  const getGravatarUrl = (email: string) => {
    const hash = md5(email.toLowerCase().trim()); // Create md5 hash from email
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`; // Return the Gravatar URL
  };

  // Function to handle when an employee is selected for editing
  const handleEditUser = (employee: Employee) => {
    if (onEditUser) {
      onEditUser(employee); // Call the onEditUser function passed in props
    }
  };

  // Function to toggle expansion of a specific node
  const toggleExpand = (employeeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId); // Collapse node if it is already expanded
      } else {
        newSet.add(employeeId); // Expand node if it is collapsed
      }
      return newSet;
    });
  };

  // Function to check if an employee matches the search term
  const matchesSearch = (employee: Employee) => {
    if (!searchTerm.trim()) return false; // Return false if searchTerm is empty or whitespace
    const searchLower = searchTerm.toLowerCase().trim(); // Convert search term to lowercase
    return (
      employee.name.toLowerCase().includes(searchLower) || // Check if name matches
      employee.surname.toLowerCase().includes(searchLower) || // Check if surname matches
      employee.role.toLowerCase().includes(searchLower) // Check if role matches
    );
  };

  // Function to render each employee node
  const renderEmployeeNode = (employee: Employee, hasChildren: boolean) => {
    const isHighlighted = matchesSearch(employee); // Check if the employee matches the search term
    return (
      <div
        key={employee.id}
        className={`flex items-center p-2 border rounded-lg shadow-sm ${
          isHighlighted
            ? "bg-yellow-100 dark:bg-green-900 dark:text-white" // Highlight node if it matches the search term
            : "dark:bg-gray-700 dark:text-white"
        }`}
      >
        <Avatar src={getGravatarUrl(employee.email)} size="sm" />{" "}
        {/* Render employee avatar */}
        <div className="ml-2 flex-grow">
          <div className="font-semibold text-sm">{`${employee.name} ${employee.surname}`}</div>{" "}
          {/* Render employee name */}
          <div className="text-xs text-gray-400">{employee.role}</div>{" "}
          {/* Render employee role */}
        </div>
        {mode === "edit" ? (
          <Button
            size="sm"
            isIconOnly
            variant="light"
            onClick={() => handleEditUser(employee)} // Trigger edit mode when the button is clicked
          >
            <FaEdit size={12} /> {/* Edit icon */}
          </Button>
        ) : (
          hasChildren && (
            <Button
              size="sm"
              isIconOnly
              variant="light"
              onClick={() => toggleExpand(employee.id)} // Expand or collapse node on button click
            >
              {expandedNodes.has(employee.id) ? (
                <FaMinus size={12} /> // Collapse icon
              ) : (
                <FaPlus size={12} /> // Expand icon
              )}
            </Button>
          )
        )}
      </div>
    );
  };

  // Function to build the hierarchy structure recursively
  const buildHierarchy = (
    employees: Employee[],
    managerId: string | null = null
  ): HierarchyNode[] => {
    // Create a map for quick access to employees by ID
    const employeeMap = new Map<string, Employee>();
    employees.forEach((emp) => employeeMap.set(emp.id, emp));

    // Helper function to build the hierarchy recursively
    const buildNodeHierarchy = (managerId: string | null): HierarchyNode[] => {
      const children: HierarchyNode[] = [];

      employees.forEach((emp) => {
        if (emp.reporting_id === managerId) {
          const childNodes = buildNodeHierarchy(emp.id); // Build children recursively
          const hasChildren = childNodes.length > 0; // Check if the employee has children
          children.push({
            label: renderEmployeeNode(emp, hasChildren), // Render the employee node
            children: childNodes, // Set the children nodes
            employee: emp,
          });
        }
      });

      return children;
    };

    return buildNodeHierarchy(managerId); // Build hierarchy starting from the root
  };

  // Function to recursively render the tree nodes
  const renderTreeNodes = (nodes: HierarchyNode[]): React.ReactNode => {
    return nodes.map((node) => (
      <TreeNode
        key={`${node.employee?.id}-${node.employee?.role}`} // Unique key for each node
        label={node.label} // Label for the node
      >
        {(expandedNodes.has(node.employee!.id) || searchTerm.trim()) &&
          renderTreeNodes(node.children)}{" "}
        {/* Recursively render children nodes if expanded */}
      </TreeNode>
    ));
  };

  const hierarchy = buildHierarchy(employees); // Build the hierarchy from the employee list

  return (
    <div className="p-4 overflow-x-auto max-w-full">
      {/* Main container with padding and horizontal scrolling support */}
      <div className="min-w-max">
        {/* Container with minimum width to prevent content shrinking */}
        <Tree
          lineWidth="2px"
          lineColor="#ccc"
          lineBorderRadius="10px"
          label={""} // Root label is empty as the tree starts from top-level employees
        >
          {renderTreeNodes(hierarchy)} {/* Render the tree nodes */}
        </Tree>
      </div>
    </div>
  );
};

export default EmployeeHierarchy;
