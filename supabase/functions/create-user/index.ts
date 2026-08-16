import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const ASSIGNABLE_ROLES = ["admin", "hod", "librarian"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user: caller } } = await supabaseClient.auth.getUser();
    if (!caller) return json({ error: "Unauthorized" }, 401);

    const { data: roleCheck } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleCheck) return json({ error: "Admin access required" }, 403);

    const body = await req.json().catch(() => ({}));
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const role = String(body.role ?? "").trim().toLowerCase();
    const department = String(body.department ?? "").trim();

    if (!name || name.length > 120) return json({ error: "Valid full name is required" }, 400);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "Valid email is required" }, 400);
    if (password.length < 6) return json({ error: "Password must be at least 6 characters" }, 400);

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: name },
    });
    if (authError) return json({ error: authError.message }, 400);

    if (ASSIGNABLE_ROLES.includes(role)) {
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: authData.user.id, role });
      if (roleError) {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        return json({ error: roleError.message }, 400);
      }
    }

    if (department) {
      await supabaseAdmin.from("profiles").update({ department }).eq("user_id", authData.user.id);
    }

    return json({ user: { id: authData.user.id, email, name, role } });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
