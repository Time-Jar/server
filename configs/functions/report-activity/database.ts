import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@1.33.1";

export async function insertAppUsage(supabase: SupabaseClient, packageId: number, userId: string, acceptanceId: number, shouldBeBlocked: boolean, actionId: number, locationId: number, weekday: number,  timeOfDay: string, appUsageTime: number) {

  // console.debug("appNameId:", appNameId, "userId:", userId, "locationId:", locationId, "eventTime", eventTime)

  // Insert data into user_app_usage
  const userAppUsage = {
      app_name: packageId,
      user_id: userId,
      acceptance: acceptanceId,
      should_be_blocked: shouldBeBlocked,
      action: actionId,
      location: locationId,
      weekday: weekday,
      time_of_day: timeOfDay, // They are saved in UTC format on the server
      app_usage_time: appUsageTime,
  };

  const reponse = await supabase
      .from('user_app_usage')
      .insert([userAppUsage]);

  if (reponse.error) {
      throw reponse.error;
  }
}
