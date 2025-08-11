import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

type Win = {
  id: string;
  content: string;
  tags: string[];
  created_at: string;
};

const FILTERS = ["all", "breakthroughs", "feedback", "connections"] as const;

// A new component for the skeleton loading state
const SkeletonCard = () => (
  <div className="p-4 rounded-xl border border-border/50 bg-card/50">
    <div className="h-4 bg-muted/50 rounded w-1/3 mb-4 animate-pulse"></div>
    <div className="space-y-2">
      <div className="h-3 bg-muted/50 rounded w-full animate-pulse"></div>
      <div className="h-3 bg-muted/50 rounded w-5/6 animate-pulse"></div>
    </div>
  </div>
);

const MemoryLane = () => {
  const [wins, setWins] = useState<Win[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Limmo — Memory Lane";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Revisit your wins and reflect on your journey.");
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("wins")
        .select("id, content, tags, created_at")
        .order("created_at", { ascending: false });
      if (!error && data) setWins(data as Win[]);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return wins;
    return wins.filter((w) => w.tags?.includes(filter));
  }, [wins, filter]);

  return (
    <main className="min-h-screen bg-background">
      <section className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-primary text-glow tracking-tight">Memory Lane</h1>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Back to Hub
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              size="sm"
              className="capitalize transition-all duration-200"
            >
              {f}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((w) => (
              <Card key={w.id} className="bg-card/50 border-border/70 card-glow transition-all duration-300 flex flex-col">
                <CardHeader>
                  <p className="text-sm font-semibold text-primary">
                    {new Date(w.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <p className="text-base text-foreground whitespace-pre-wrap flex-grow">{w.content}</p>
                  {w.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {w.tags.map((t) => (
                        <span key={t} className="text-xs capitalize px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // This is the new "empty state"
          <div className="text-center py-20 px-6 rounded-lg border-2 border-dashed border-border/50">
            <h2 className="text-2xl font-semibold text-primary">Your Lane is Clear</h2>
            <p className="mt-2 text-muted-foreground">You haven't captured any wins yet. Every great journey starts with a single step.</p>
            <Button asChild className="mt-6 card-glow">
              <Link to="/journal">
                <PlusCircle className="mr-2 h-4 w-4" />
                Capture Your First Win
              </Link>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
};

export default MemoryLane;
