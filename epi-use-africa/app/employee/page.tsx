"use client";

import React, { useState, useEffect } from "react";
import { Select, SelectItem, Button } from "@nextui-org/react";

interface Employee {
  id: string;
  name: string;
  surname: string;
  role: string;
}

interface RoleSelectorProps {
  onRoleSelect: (employee: Employee) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees");
        const data: Employee[] = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleSelect = (value: React.Key) => {
    setSelectedEmployee(value as string);
  };

  const handleSubmit = () => {
    const employee = employees.find((emp) => emp.id === selectedEmployee);
    if (employee) {
      onRoleSelect(employee);
    }
  };

  return (
    <div className="p-4 border rounded bg-black">
      <h2 className="text-xl font-bold mb-4">Select Your Role</h2>
      <Select
        label="Select an employee"
        placeholder="Choose an employee"
        className="mb-4"
        selectedKeys={selectedEmployee ? [selectedEmployee] : []}
        onSelectionChange={(keys) => handleSelect(Array.from(keys)[0])}
      >
        {employees.map((emp) => (
          <SelectItem key={emp.id} value={emp.id}>
            {emp.name} {emp.surname} - {emp.role}
          </SelectItem>
        ))}
      </Select>
      <Button
        color="primary"
        onClick={handleSubmit}
        disabled={!selectedEmployee}
      >
        Enter System
      </Button>
    </div>
  );
};

export default RoleSelector;
