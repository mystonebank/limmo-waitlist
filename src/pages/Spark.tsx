import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { PlusCircle, Zap } from "lucide-react";

const suggestions = [
  { key: "doubt", label: "Feeling doubtful" },
  { key: "stuck", label: "Feeling stuck" },
  { key: "boost", label: "Need a boost" },
];

type Win = { content: string };

const SparkleLoader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="sparkle-loader">
      <div></div>
      <div></div>
    </div>
  </div>
);

const Spark = () => {
  const [wins, setWins] = useState<Win[]>([]);
  const [hasCheckedWins, setHasCheckedWins] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Limmo — The Spark";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Get a personalized nudge from your past wins.");

    const checkWins = async () => {
      const { data } = await supabase.from("wins").select("content").limit(1);
      if (data) {
        setWins(data as Win[]);
      }
      setHasCheckedWins(true);
    };
    checkWins();
  }, []);

  const generate = async (mood: string) => {
    setLoading(true);
    setMessage(null);
    const { data } = await supabase
      .from("wins")
      .select("content, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    const fetchedWins = (data as Win[] | null) ?? [];
    const sample = fetchedWins.slice(0, 3).map((w) => `“${w.content}”`).join(" • ");

    const base =
      mood === "doubt"
        ? "Feeling doubtful is human."
        : mood === "stuck"
        ? "When you're stuck, remember momentum is built one small step at a time."
        : "You deserve this progress.";

    const out = `${base} Look back: ${sample}. These are proof you move forward—even on tough days. You've got this.`;

    await new Promise((r) => setTimeout(r, 800));
    setMessage(out);
    setLoading(false);
  };

  const renderContent = () => {
    if (!hasCheckedWins) {
      return <div className="h-40" />;
    }

    if (wins.length === 0) {
      return (
        <div className="text-center py-16 px-6 rounded-lg border-2 border-dashed border-border/50">
          <Zap className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-primary">Activate The Spark</h2>
          <p className="mt-2 text-muted-foreground">This feature is powered by your own wins. Capture a few to get started.</p>
          <Button asChild className="mt-6 card-glow">
            <Link to="/journal">
              <PlusCircle className="mr-2 h-4 w-4" />
              Capture Your First Win
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <>
        <p className="text-muted-foreground mb-4">What's on your mind?</p>
        <div className="flex flex-wrap gap-3 mb-6">
          {suggestions.map((s) => (
            <Button
              key={s.key}
              onClick={() => generate(s.key)}
              disabled={loading}
              variant="outline"
              className="card-glow transition-all"
            >
              {s.label}
            </Button>
          ))}
        </div>

        {loading && <SparkleLoader />}
        {message && (
          <Card className="mt-4 bg-card/50 border-ring/20 card-glow transition-all">
            <CardContent className="pt-6 text-lg leading-relaxed text-foreground">
              {message}
            </CardContent>
          </Card>
        )}
      </>
    );
  };

  return (
    // The <main> and <section> tags and the header are removed.
    <>
      {renderContent()}
    </>
  );
};

export default Spark;
