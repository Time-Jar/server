import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@1.33.1";

export async function getAppNameIdOrInsertAppName(supabase: SupabaseClient, packageName: string): Promise<number> {
    // Insert or fetch app name
    let reponse = await supabase
        .from('_app_names')
        .select('id')
        .eq('app_name', packageName)
        .single();

    if (reponse.error && reponse.error.message !== 'No rows found') {
        throw reponse.error;
    }

    if (!reponse.data) {
        reponse = await supabase
        .from('_app_names')
        .insert([{ app_name: packageName }])
        .single();
    }

    return reponse.data.id
}

export async function insertAppUsage(supabase: SupabaseClient, appNameId: number, userId: string, locationId: number, eventTime: Date) {
  // Insert data into user_app_usage
  const userAppUsage = {
      app_name: appNameId,
      user_id: userId,
      // acceptance: 'acceptance-id-here', // on end
      // should_be_blocked: false, // on end
      // action: 'action-id-here', // on end
      location: locationId,
      weekday: eventTime.getDay(),
      time_of_day: eventTime.toTimeString(),
      // app_usage_time: 0, // on end
  };

  const reponse = await supabase
      .from('user_app_usage')
      .insert([userAppUsage]);

  if (reponse.error) {
      throw reponse.error;
  }
}