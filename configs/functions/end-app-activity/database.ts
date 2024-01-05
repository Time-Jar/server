import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@1.33.1";

export async function updateLastAppUsage(supabase: SupabaseClient, userId: string, acceptance: number, shouldBeBlocked: boolean, action: number, eventTime: Date): Promise<string | null> {
  let result = await supabase
    .from('user_app_usage')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (result.error) throw result.error;
  if (!result.data) return 'No previous app usage record found';

  // Check if the last record is already complete
  if (result.data.should_be_blocked != null) {
    return 'The last app usage record is already complete and cannot be updated.';
  }

  const should_be_blocked = shouldBeBlocked
  const app_usage_time = getAbsDifferenceInSeconds(eventTime, result.data.time_of_day )

  // console.debug("updateLastAppUsage", "acceptance:", acceptance, "should_be_blocked:", should_be_blocked, "action:", action, "app_usage_time:", app_usage_time)

  // Update the record
  result = await supabase
    .from('user_app_usage')
    .update({ acceptance, should_be_blocked, action, app_usage_time })
    .eq('id', result.data.id);

  if (result.error) throw result.error;

  return null;
}

function getSecondsSinceMidnight(time: Date) {
  return time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds();
}

function getAbsDifferenceInSeconds(eventTime: Date, timeOfDay: string) {
  // Extract hours, minutes, and seconds from the time string
  const [hours, minutes, seconds] = timeOfDay.split(':').map(Number);

  // Create a Date object for today at the time_of_day
  const comparisonTime = new Date(eventTime);
  comparisonTime.setHours(hours, minutes, seconds);

  // Calculate total seconds from midnight for both times
  const eventTimeSeconds = getSecondsSinceMidnight(eventTime);
  const comparisonTimeSeconds = getSecondsSinceMidnight(comparisonTime);

  // Calculate the absolute difference in seconds
  const differenceInSeconds = Math.abs(eventTimeSeconds - comparisonTimeSeconds);

  return differenceInSeconds;
}