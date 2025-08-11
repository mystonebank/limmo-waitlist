import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

type Win = {
  id: string;
  content: string;
  tags: string[];
  created_at: string;
};

const FILTERS = ["all", "breakthroughs", "feedback", "connections"] as const;

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-primary">Memory Lane</h1>
          <Link to="/" className="text-sm text-muted-foreground hover:underline">Back</Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              size="sm"
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading memories...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((w) => (
              <Card key={w.id} className="border-border/80">
                <CardHeader>
                  <CardTitle className="text-base text-foreground">
                    {new Date(w.created_at).toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{w.content}</p>
                  {w.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {w.tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MemoryLane;
