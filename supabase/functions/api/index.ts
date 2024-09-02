import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables')
}
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    })
  }

  try {
    const { type } = await req.json()
    console.log('Request type:', type);

    let data 
    if (type === 'getEmployees') {
      console.log('Fetching employees...');
      const { data: employees, error } = await supabase
        .from('employees') // Use the default schema
        .select('id, name, surname, birth_date, employee_number, salary, role, reporting_line_manager, email')
      
      if (error) {
        console.error('Supabase error:', error);
        throw error
      }
      
      console.log('Fetched employees:', employees);
      data = employees
    } else {
      throw new Error('Invalid request type')
    }

    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('Error in Supabase function:', error);
    return new Response(JSON.stringify({ error: error.message, details: error }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
})
