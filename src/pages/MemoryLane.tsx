import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Win = {
  id: string;
  content: string;
  tags: string[];
  created_at: string;
};

const FILTERS = ["all", "breakthroughs", "feedback", "connections"] as const;

// Helper function to format the date into a relative time string
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) {
    return "now";
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else if (days < 7) {
    return `${days}d`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
};

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
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
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <AnimatePresence>
          {filtered.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-4"
            >
              {filtered.map((w) => (
                <motion.div key={w.id} variants={itemVariants} layout>
                  <Card className="bg-card/50 border-border/70 card-glow transition-all duration-300 flex flex-col h-full">
                    <CardHeader>
                      {/* Using the new function and muted text color */}
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(w.created_at)}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between pt-0">
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
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-6 rounded-lg border-2 border-dashed border-border/50"
            >
              <h2 className="text-2xl font-semibold text-primary">Your Lane is Clear</h2>
              <p className="mt-2 text-muted-foreground">You haven't captured any wins yet. Every great journey starts with a single step.</p>
              <Button asChild className="mt-6 card-glow">
                <Link to="/journal">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Capture Your First Win
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default MemoryLane;
