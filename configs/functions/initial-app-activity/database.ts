import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@1.33.1";

export async function insertAppUsage(supabase: SupabaseClient, appNameId: number, userId: string, locationId: number, weekday: number,  timeOfDay: string) {

  // console.debug("appNameId:", appNameId, "userId:", userId, "locationId:", locationId, "eventTime", eventTime)

  const result = await supabase
    .from('user_app_usage')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (result.error && result.error.message !== 'JSON object requested, multiple (or no) rows returned')
    throw Error(`fetch supabase last user_app_usage: ${result.error.message}`);
  
  if (result.data) {
    console.debug("result.data.should_be_blocked", result.data.should_be_blocked, typeof result.data.should_be_blocked)

    // Check if the last record is incomplete
    if (result.data.should_be_blocked == null) {
      // Delete last record since it is incomplete
      const response =  await supabase.from('user_app_usage').delete().eq('id', result.data.id)

      if (response.error) throw Error(`fetch supabase delete last user_app_usage: ${response.error.message}`);
    }
  }

  // Insert data into user_app_usage
  const userAppUsage = {
      app_name: appNameId,
      user_id: userId,
      // acceptance: 'acceptance-id-here', // on end
      // should_be_blocked: false, // on end
      // action: 'action-id-here', // on end
      location: locationId,
      weekday: weekday,
      time_of_day: timeOfDay, // They are saved in UTC format on the server
      // app_usage_time: 0, // on end
  };

  const reponse = await supabase
      .from('user_app_usage')
      .insert([userAppUsage]);

  if (reponse.error) {
      throw reponse.error;
  }
}

export async function getAppNameIdOrInsertAppName(supabase: SupabaseClient, packageName: string): Promise<number> {
  // Insert or fetch app name
  let reponse = await supabase
      .from('_app_names')
      .select('id')
      .eq('app_name', packageName)
      .single();

  if (reponse.error && reponse.error.message !== 'JSON object requested, multiple (or no) rows returned') {
      throw Error(`getAppName error: ${reponse.error.message}`);
  }

  if (!reponse.data) {
      reponse = await supabase
      .from('_app_names')
      .insert([{ app_name: packageName }])
      .single();
  }

  return reponse.data.id
}

export function getWeekday(date: Date): number {
  let day = date.getDay();
  
  // Adjust days so Monday = 1, Tuesday = 2, ..., Sunday = 7
  if (day === 0) { // If it's Sunday
    day = 7;
  }

  return day;
}
