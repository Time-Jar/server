import { serve } from "https://deno.land/std@0.177.1/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.33.1";
import { insertAppUsage } from "./database.ts"
import { validateReportInput } from "./validateInput.ts";
import { getAppNameIdOrInsertAppName, getWeekday } from "../shared/database.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? "";
const supabaseAnonKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const requestBody = await request.json();

  const validationError = validateReportInput(requestBody);
  if (validationError) {
    return new Response(`validation error: ${validationError}`, { status: 400 });
  }

  try {
    const startTime = new Date(requestBody.startTime)
  
    const weekday = getWeekday(startTime)
    const timeOfDay = startTime.toLocaleTimeString()
    const appNameId = await getAppNameIdOrInsertAppName(supabase, requestBody.packageName)

    await insertAppUsage(supabase, appNameId, requestBody.userId, requestBody.acceptanceId, requestBody.shouldBeBlocked, requestBody.actionId, requestBody.locationId, weekday, timeOfDay, requestBody.appUsageTime)

    return new Response('Data updated successfully', { status: 200 });
  } catch (error) {
    return new Response(`Error: ${error.message || 'Unknown error'}`, { status: 500 });
  }
})
