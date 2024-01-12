import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@1.33.1";

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
