import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    const { type, payload } = await req.json();
    console.log("Request type:", type);

    let data;
    if (type === "getEmployees") {
      console.log("Fetching employees...");
      const { data: employees, error } = await supabase
        .from("employees")
        .select(
          "id, name, surname, birth_date, employee_number, salary, role, reporting_line_manager, email, created_at, updated_at",
        );

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Fetched employees:", employees);
      data = employees;
    } else if (type === "getRole") {
      console.log("Fetching all roles from the view...");
      const { data: roles, error } = await supabase
        .from("all_roles") // Query the view instead of the employees table
        .select("*") // Select all columns from the view
        .order("role");

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      // The roles are already unique in the view, so no need to filter them again
      data = roles;

      console.log("Fetched all roles from the view:", data);
    } else if (type === "getReportingLineManager") {
      console.log("Fetching reporting line managers...");
      const { data: managers, error } = await supabase
        .from("employees")
        .select("id, name, surname, role")
        .order("name");

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Fetched reporting line managers:", managers);
      data = managers;
    } else if (type === "createEmployee") {
      console.log("Creating a new employee...");

      // Check if the new employee is supposed to be a CEO
      if (payload.role === "CEO") {
        // Check if there's already a CEO in the system
        const { data: existingCEO, error: ceoCheckError } = await supabase
          .from("employees")
          .select("id")
          .eq("role", "CEO")
          .single();

        if (ceoCheckError && ceoCheckError.code !== "PGRST116") {
          console.error("Error checking for existing CEO:", ceoCheckError);
          throw ceoCheckError;
        }

        if (existingCEO) {
          return {
            error:
              "A CEO already exists in the system. Only one CEO is allowed.",
          };
        }
      }

      // Generate the next employee number
      const { data: maxEmployeeNumber } = await supabase
        .from("employees")
        .select("employee_number")
        .order("employee_number", { ascending: false })
        .limit(1)
        .single();

      let nextEmployeeNumber = "EMP001";
      if (maxEmployeeNumber && maxEmployeeNumber.employee_number) {
        const lastNumber = parseInt(
          maxEmployeeNumber.employee_number.replace("EMP", ""),
          10,
        );
        nextEmployeeNumber = `EMP${String(lastNumber + 1).padStart(3, "0")}`;
      }

      const newEmployeeData = {
        name: payload.name,
        surname: payload.surname,
        birth_date: payload.birthDate,
        employee_number: nextEmployeeNumber,
        salary: payload.salary,
        role: payload.role,
        email: payload.email,
        reporting_line_manager: payload.reporting_line_manager,
      };

      const { data: employee, error } = await supabase
        .from("employees")
        .insert([newEmployeeData])
        .select("*")
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Created employee:", employee);
      data = employee;
    } else if (type === "updateEmployee") {
      console.log("Attempting to update an employee...");
      const { id, ...updates } = payload;

      // First, get the current role of the employee we're trying to update
      const { data: currentEmployee, error: fetchError } = await supabase
        .from("employees")
        .select("role")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching employee to update:", fetchError);
        throw fetchError;
      }

      // If the role is being updated, check for dependencies
      if (updates.role && updates.role !== currentEmployee.role) {
        // Check if any employees are reporting to the current role
        const { data: dependentEmployees, error: dependencyError } =
          await supabase
            .from("employees")
            .select("id")
            .eq("reporting_line_manager", currentEmployee.role);

        if (dependencyError) {
          console.error(
            "Error checking for dependent employees:",
            dependencyError,
          );
          throw dependencyError;
        }

        if (dependentEmployees && dependentEmployees.length > 0) {
          console.log("Cannot update: Employees are reporting to this role");
          return new Response(
            JSON.stringify({
              error:
                "Cannot update employee role. There are still employees reporting to the current role.",
              dependentCount: dependentEmployees.length,
            }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            },
          );
        }
      }

      // If no dependents or role is not being updated, proceed with the update
      const { data: updatedEmployee, error: updateError } = await supabase
        .from("employees")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

      if (updateError) {
        console.error("Error updating employee:", updateError);
        throw updateError;
      }

      console.log("Updated employee:", updatedEmployee);
      data = updatedEmployee;
    } else if (type === "deleteEmployee") {
      console.log("Attempting to delete an employee...");
      const { id } = payload;

      // First, get the role of the employee we're trying to delete
      const { data: employeeToDelete, error: fetchError } = await supabase
        .from("employees")
        .select("role")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching employee to delete:", fetchError);
        throw fetchError;
      }

      // Check if any employees are reporting to this role
      const { data: dependentEmployees, error: dependencyError } =
        await supabase
          .from("employees")
          .select("id")
          .eq("reporting_line_manager", employeeToDelete.role);

      if (dependencyError) {
        console.error(
          "Error checking for dependent employees:",
          dependencyError,
        );
        throw dependencyError;
      }

      if (dependentEmployees && dependentEmployees.length > 0) {
        console.log("Cannot delete: Employees are reporting to this role");
        return new Response(
          JSON.stringify({
            error:
              "Cannot delete employee. There are still employees reporting to this role.",
            dependentCount: dependentEmployees.length,
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          },
        );
      }

      // If no dependents, proceed with deletion
      const { data: deletedEmployee, error: deleteError } = await supabase
        .from("employees")
        .delete()
        .eq("id", id)
        .select("*")
        .single();

      if (deleteError) {
        console.error("Error deleting employee:", deleteError);
        throw deleteError;
      }

      console.log("Deleted employee:", deletedEmployee);
      data = deletedEmployee;
    }
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in Supabase function:", error);
    return new Response(
      JSON.stringify({ error: error.message, details: error }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
});
