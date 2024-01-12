import { serve } from "https://deno.land/std@0.177.1/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.33.1";
import { validatePredictionInput } from "./validateInput.ts";
import { tensorFlowApi } from "./tensorflow-api.ts";
import { getAppNameIdOrInsertAppName, getWeekday } from "../shared/database.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? "";
const supabaseAnonKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const requestBody = await request.json();
  
  // startTime is miliseconds after epoch

  const validationError = validatePredictionInput(requestBody);
  if (validationError) {
    // console.debug("initial-app-activity validationError", validationError, requestBody);
    
    return new Response(`validation error: ${validationError}`, { status: 400 });
  }

  let shouldBlock = false

  try {
    const startTime = new Date(requestBody.startTime)
  
    const weekday = getWeekday(startTime)
    const timeOfDay = startTime.toLocaleTimeString()
    const appNameId = await getAppNameIdOrInsertAppName(supabase, requestBody.packageName)

    // shouldBlock = await tensorFlowApi(requestBody.userId, appNameId, weekday, timeOfDay)

    return new Response(JSON.stringify({message: 'Data inserted successfully', shouldBlock: shouldBlock}), { status: 200 });
  } catch (error) {
    return new Response(`Error: ${error.message || 'Unknown error'}`, { status: 500 });
  }
})
