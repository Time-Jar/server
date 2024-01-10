import { serve } from "https://deno.land/std@0.177.1/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.33.1";
import { getAppNameIdOrInsertAppName, insertAppUsage, getWeekday } from "./database.ts"
import { validateInput } from "./validateInput.ts";
import { tensorFlowApi } from "./tensorflow-api.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? "";
const supabaseAnonKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const requestBody = await request.json();
  
  // eventTime is miliseconds after epoch

  const validationError = validateInput(requestBody);
  if (validationError) {
    // console.debug("initial-app-activity validationError", validationError, requestBody);
    
    return new Response(`validation error: ${validationError}`, { status: 400 });
  }

  let shouldBlock = false
  let weekday
  let timeOfDay
  let appNameId

  try {
    const eventTime = new Date(requestBody.eventTime)
  
    weekday = getWeekday(eventTime)
    timeOfDay = eventTime.toLocaleTimeString()
    appNameId = await getAppNameIdOrInsertAppName(supabase, requestBody.packageName)

    // shouldBlock = await tensorFlowApi(requestBody.userId)

  } catch (error) {
    return new Response(`Error: ${error.message || 'Unknown error'}`, { status: 412 });
  }

  try {
    await insertAppUsage(supabase, appNameId, requestBody.userId, requestBody.locationId, weekday, timeOfDay)

    return new Response(JSON.stringify({message: 'Data inserted successfully', shouldBlock: shouldBlock}), { status: 200 });
  } catch (error) {
    return new Response(`Error: ${error.message || 'Unknown error'}`, { status: 500 });
  }
})
