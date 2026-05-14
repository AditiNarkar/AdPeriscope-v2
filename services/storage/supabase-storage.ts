import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { log } from "@/lib/logger";

export function getSupabaseAdmin() {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function uploadReport(path: string, content: Blob | Buffer) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    log("warn", "Supabase credentials missing; returning demo report URL", { path });
    return { path, publicUrl: `/reports/${path}` };
  }
  log("info", "Uploading report to Supabase Storage", { path });
  const { error } = await supabase.storage.from("reports").upload(path, content, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("reports").getPublicUrl(path);
  log("info", "Report upload completed", { path, publicUrl: data.publicUrl });
  return { path, publicUrl: data.publicUrl };
}
