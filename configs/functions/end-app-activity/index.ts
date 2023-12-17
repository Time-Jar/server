import { serve } from "https://deno.land/std@0.177.1/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.33.1";
import { updateLastAppUsage } from "./database.ts"
import { validateInput } from "./validateInput.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? "";
const supabaseAnonKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const requestBody = await request.json();

  const validationError = validateInput(requestBody);
  if (validationError) {
    return new Response(`validation error: ${validationError}`, { status: 400 });
  }

  try {
    const updateError = await updateLastAppUsage(supabase, requestBody.userId, requestBody.acceptance, requestBody.should_be_blocked, requestBody.action, new Date(requestBody.eventTime))
    if (updateError) {
      throw Error(`updateLastAppUsage error: ${updateError}`);
    }

    return new Response('Data updated successfully', { status: 200 });
  } catch (error) {
    return new Response(`Error: ${error.message || 'Unknown error'}`, { status: 500 });
  }
})
