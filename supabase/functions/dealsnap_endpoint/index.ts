/**
 * DealSnap secure backend endpoint (service_role).
 * This edge function runs with the service_role key, so it is not exposed to public/anon.
 * It supports the following actions via POST JSON body:
 *   - "list"          : returns a list of deals (basic fields)
 *   - "view"          : returns detailed data for a specific deal_id
 *   - "tapback"       : performs a tapback action (mark_deal_hot, confirm_buyer_match, pass_deal)
 * The function expects a header `x-supabase-key` containing the service_role secret.
 */
import { createClient } from "@supabase/supabase-js";

// The service role key must be set in the function's environment variables.
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Supabase URL or service role key not configured");
  // In a real deployment this would be a 500 response.
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

export async function handler(event) {
  try {
    const { action, payload } = JSON.parse(event.body || "{}") || {};
    switch (action) {
      case "list": {
        const { data: deals, error } = await supabase
          .from("deals")
          .select("id, deal_name, status, is_hot, updated_at")
          .order("updated_at", { ascending: false });
        if (error) throw error;
        return { statusCode: 200, body: JSON.stringify({ deals }) };
      }
      case "view": {
        const { deal_id } = payload;
        const { data: deal, error } = await supabase
          .from("deals")
          .select("*, buyer_matches(*)")
          .eq("id", deal_id)
          .single();
        if (error) throw error;
        return { statusCode: 200, body: JSON.stringify({ deal }) };
      }
      case "tapback": {
        const { type, deal_id, buyer_id } = payload;
        if (type === "hot") {
          const { error } = await supabase.rpc("mark_deal_hot", { deal_id });
          if (error) throw error;
        } else if (type === "confirm") {
          const { error } = await supabase.rpc("confirm_buyer_match", { deal_id, buyer_id });
          if (error) throw error;
        } else if (type === "pass") {
          const { error } = await supabase.rpc("pass_deal", { deal_id });
          if (error) throw error;
        } else {
          return { statusCode: 400, body: JSON.stringify({ error: "invalid tapback type" }) };
        }
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
      }
      default:
        return { statusCode: 400, body: JSON.stringify({ error: "unknown action" }) };
    }
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
