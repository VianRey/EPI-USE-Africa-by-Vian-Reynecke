import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async (req) => {
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
      console.log("Updating an employee...");
      const { id, ...updates } = payload;

      const { data: employee, error } = await supabase
        .from("employees")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Updated employee:", employee);
      data = employee;
    } else if (type === "deleteEmployee") {
      console.log("Deleting an employee...");
      const { id } = payload;

      const { data: employee, error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Deleted employee:", employee);
      data = employee;
    } else {
      throw new Error("Invalid request type");
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
