import { serve } from "https://deno.land/std@0.177.1/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.33.1";
import { getAppNameIdOrInsertAppName, insertAppUsage } from "./database.ts"

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? "";
const supabaseAnonKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { userId, packageName, eventTime, locationId } = await request.json();
  // eventTime is miliseconds after epoch

  try {
    const appNameId = await getAppNameIdOrInsertAppName(supabase, packageName)

    await insertAppUsage(supabase, appNameId, userId, locationId, new Date(eventTime))

    return new Response('Data inserted successfully', { status: 200 });
  } catch (error) {
    return new Response(`Error: ${error.message || 'Unknown error'}`, { status: 500 });
  }
})
