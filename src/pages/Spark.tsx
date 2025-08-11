import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const suggestions = [
  { key: "doubt", label: "Feeling doubtful" },
  { key: "stuck", label: "Feeling stuck" },
  { key: "boost", label: "Need a boost" },
];

type Win = { content: string };

const Spark = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Limmo — The Spark";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Get a personalized nudge from your past wins.");
  }, []);

  const generate = async (mood: string) => {
    setLoading(true);
    setMessage(null);
    const { data } = await supabase
      .from("wins")
      .select("content, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    const wins = (data as Win[] | null) ?? [];
    const sample = wins.slice(0, 3).map((w) => `“${w.content}”`).join(" • ");

    const base =
      mood === "doubt"
        ? "Feeling doubtful is human."
        : mood === "stuck"
        ? "When you're stuck, remember momentum is built one small step at a time."
        : "You deserve this progress."

    const out = wins.length
      ? `${base} Look back: ${sample}. These are proof you move forward — even on tough days. You've got this.`
      : `${base} Start by capturing a tiny win in your Journal. Future-you will thank you.`;

    // Small delay to simulate thinking
    await new Promise((r) => setTimeout(r, 600));
    setMessage(out);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="container py-10 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-primary">The Spark</h1>
          <Link to="/" className="text-sm text-muted-foreground hover:underline">Back</Link>
        </div>

        <p className="text-muted-foreground mb-4">What's on your mind?</p>

        <div className="flex flex-wrap gap-3 mb-6">
          {suggestions.map((s) => (
            <Button key={s.key} onClick={() => generate(s.key)} disabled={loading} variant="outline">
              {s.label}
            </Button>
          ))}
        </div>

        {loading && <p className="text-muted-foreground">Thinking...</p>}
        {message && (
          <Card className="mt-4">
            <CardContent className="pt-6 text-foreground">{message}</CardContent>
          </Card>
        )}
      </section>
    </main>
  );
};

export default Spark;
