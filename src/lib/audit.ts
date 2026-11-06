import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Append-only audit trail. Inserts run as the signed-in user; the database
 * stamps the actor and server time itself, so neither can be forged.
 */
export async function writeAudit(
  supabase: SupabaseClient,
  action: string,
  entity: string,
  entityId: string | null,
  details: Record<string, unknown> = {},
) {
  const { error } = await supabase.rpc("log_audit", {
    p_action: action,
    p_entity: entity,
    p_entity_id: entityId,
    p_details: details,
  });
  if (error) console.error("[audit] failed to write", action, error.message);
}
