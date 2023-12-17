import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@1.33.1";

export async function updateLastAppUsage(supabase: SupabaseClient, userId: string, acceptance: number, should_be_blocked: boolean, action: number, app_usage_time: number): Promise<string | null> {
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
  if (result.data.should_be_blocked) {
    return 'The last app usage record is already complete and cannot be updated.';
  }

  // Step 2: Update the record
  result = await supabase
    .from('user_app_usage')
    .update({ acceptance, should_be_blocked, action, app_usage_time })
    .eq('id', result.data.id);

  if (result.error) throw result.error;

  return null;
}
  