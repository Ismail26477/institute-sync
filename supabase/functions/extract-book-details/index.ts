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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI is not configured" }, 500);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user } } = await client.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
    const isStaff = (roles ?? []).some((r) => r.role === "admin" || r.role === "librarian");
    if (!isStaff) return json({ error: "Library staff access required" }, 403);

    const body = await req.json().catch(() => ({}));
    const imageDataUrl = String(body.imageDataUrl ?? "");
    if (!imageDataUrl.startsWith("data:image/")) {
      return json({ error: "A valid image is required" }, 400);
    }
    if (imageDataUrl.length > 8_000_000) {
      return json({ error: "Image is too large. Please use an image under 5MB." }, 400);
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        messages: [
          {
            role: "system",
            content:
              "You read photographs of physical books and extract bibliographic metadata that is actually VISIBLE in the image. Never guess, never invent an ISBN or any other value. If a field is not clearly visible, return an empty string for it.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  "Extract the book details from this photo. Respond ONLY with a JSON object using exactly these keys: title, author, isbn, publisher, edition, category, language, publication_year, description. Use an empty string for anything not visible. category should be one of: Nursing, Basic Sciences, Pharmacology, Physiotherapy, General Reference (choose the closest, or empty if unclear).",
              },
              { type: "image_url", image_url: { url: imageDataUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) return json({ error: "AI rate limit reached. Please try again shortly." }, 429);
    if (res.status === 402) return json({ error: "AI credits exhausted. Please add credits to continue." }, 402);
    if (!res.ok) {
      const text = await res.text();
      return json({ error: `AI request failed: ${text.slice(0, 300)}` }, 502);
    }

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = String(raw).match(/\{[\s\S]*\}/);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch { parsed = {}; }
      }
    }

    const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
    const result = {
      title: str(parsed.title),
      author: str(parsed.author),
      isbn: str(parsed.isbn),
      publisher: str(parsed.publisher),
      edition: str(parsed.edition),
      category: str(parsed.category),
      language: str(parsed.language),
      publication_year: str(parsed.publication_year),
      description: str(parsed.description),
    };

    await admin.from("library_audit_log").insert({
      user_id: user.id,
      user_name: user.email ?? "",
      action: "AI Book Scan Used",
      record_type: "book",
      details: result.title ? `Detected: ${result.title}` : "No title detected",
    });

    return json({ result });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
