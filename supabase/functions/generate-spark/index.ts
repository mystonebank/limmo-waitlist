import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import { corsHeaders } from "../_shared/cors.ts";

// Note: You will need to create an OpenAI account and get an API key.
// We will add this key as a secret in the Supabase dashboard later.
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  // This is needed to handle CORS preflight requests.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the user's access token.
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Get the user from the access token.
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Get the 'mood' from the request body.
    const { mood } = await req.json();
    if (!mood) {
      return new Response(JSON.stringify({ error: "Missing mood" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Fetch the user's 10 most recent wins from the database.
    const { data: wins, error } = await supabaseClient
      .from("wins")
      .select("content")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    // Construct the prompt for the AI model.
    const winsText = wins.map((w: { content: string }) => `- ${w.content}`).join("\n");
    const prompt = `
      You are Limmo, a friendly and encouraging "pocket cheerleader" for a tech founder.
      The user is feeling: "${mood}".
      Based on their past wins below, write a short, personalized, and uplifting message (2-3 sentences).
      Directly reference one or two of their specific wins to remind them of their capabilities.
      Do not be generic. Be specific and empathetic.

      Past wins:
      ${winsText}
    `;

    // Call the OpenAI API.
    const completionResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const completionData = await completionResponse.json();
    const message = completionData.choices[0].message.content.trim();

    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
