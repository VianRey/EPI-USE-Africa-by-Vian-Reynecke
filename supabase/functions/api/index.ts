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
    switch (type) {
      case "getEmployees": {
        console.log("Fetching employees...");
        const { data: employees, error: employeesError } = await supabase
          .from("employees")
          .select(
            "id, name, surname, birth_date, employee_number, salary, role, reporting_line_manager, email, created_at, updated_at, reporting_id",
          );

        if (employeesError) throw employeesError;
        data = employees;
        break;
      }
      case "getRole": {
        console.log("Fetching all roles from the view...");
        const { data: roles, error: rolesError } = await supabase
          .from("all_roles")
          .select("*")
          .order("role");

        if (rolesError) throw rolesError;
        data = roles;
        break;
      }
      case "getReportingLineManager": {
        console.log("Fetching reporting line managers...");
        const { data: managers, error: managersError } = await supabase
          .from("employees")
          .select("id, name, surname, role")
          .order("name");

        if (managersError) throw managersError;
        data = managers;
        break;
      }
      case "checkEmailExists": {
        console.log("Checking if email exists...");
        const { email } = payload;
        const { data: emailData, error: emailError } = await supabase
          .from("employees")
          .select("id")
          .eq("email", email)
          .single();

        if (emailError && emailError.code !== "PGRST116") throw emailError;
        data = { exists: !!emailData };
        break;
      }
      case "createEmployee": {
        console.log("Creating a new employee...");
        if (payload.role === "CEO") {
          const { data: existingCEO, error: ceoCheckError } = await supabase
            .from("employees")
            .select("id")
            .eq("role", "CEO")
            .single();

          if (ceoCheckError && ceoCheckError.code !== "PGRST116") {
            throw ceoCheckError;
          }

          if (existingCEO) {
            return new Response(
              JSON.stringify({
                error:
                  "A CEO already exists in the system. Only one CEO is allowed.",
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
          reporting_id: payload.reporting_id,
        };

        const { data: employee, error: createError } = await supabase
          .from("employees")
          .insert([newEmployeeData])
          .select("*")
          .single();

        if (createError) throw createError;
        data = employee;
        break;
      }
      case "updateEmployee": {
        console.log("Attempting to update an employee...");
        const { id, ...updates } = payload;

        // Check for duplicate email
        if (updates.email) {
          const { data: existingEmail, error: emailCheckError } = await supabase
            .from("employees")
            .select("id")
            .eq("email", updates.email)
            .neq("id", id)
            .single();

          if (emailCheckError && emailCheckError.code !== "PGRST116") {
            throw emailCheckError;
          }

          if (existingEmail) {
            return new Response(
              JSON.stringify({
                error: "Email already exists",
                code: "DUPLICATE_EMAIL",
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

        const { data: currentEmployee, error: fetchError } = await supabase
          .from("employees")
          .select("role")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;

        if (updates.role && updates.role !== currentEmployee.role) {
          const { data: dependentEmployees, error: dependencyError } =
            await supabase
              .from("employees")
              .select("id")
              .eq("reporting_line_manager", currentEmployee.role);

          if (dependencyError) throw dependencyError;

          if (dependentEmployees && dependentEmployees.length > 0) {
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

        const { data: updatedEmployee, error: updateError } = await supabase
          .from("employees")
          .update(updates)
          .eq("id", id)
          .select("*")
          .single();

        if (updateError) throw updateError;
        data = updatedEmployee;
        break;
      }
      case "deleteEmployee": {
        console.log("Attempting to delete an employee...");
        const { id: deleteId } = payload;

        const { data: employeeToDelete, error: fetchDeleteError } =
          await supabase
            .from("employees")
            .select("role")
            .eq("id", deleteId)
            .single();

        if (fetchDeleteError) throw fetchDeleteError;

        const { data: dependentEmployees, error: dependencyDeleteError } =
          await supabase
            .from("employees")
            .select("id")
            .eq("reporting_line_manager", employeeToDelete.role);

        if (dependencyDeleteError) throw dependencyDeleteError;

        if (dependentEmployees && dependentEmployees.length > 0) {
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

        const { data: deletedEmployee, error: deleteError } = await supabase
          .from("employees")
          .delete()
          .eq("id", deleteId)
          .select("*")
          .single();

        if (deleteError) throw deleteError;
        data = deletedEmployee;
        break;
      }
      default:
        return new Response(
          JSON.stringify({ error: "Unsupported request type" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          },
        );
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
