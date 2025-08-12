import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { PlusCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  // This function now calls our new Edge Function
  const generate = async (mood: string) => {
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.functions.invoke("generate-spark", {
      body: { mood },
    });

    if (error) {
      console.error("Error invoking function:", error);
      setMessage("Sorry, something went wrong. Please try again in a moment.");
    } else {
      setMessage(data.message);
    }

    setLoading(false);
  };

  const renderContent = () => {
    if (!hasCheckedWins) {
      return <div className="h-40" />;
    }

    if (wins.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 px-6 rounded-lg border-2 border-dashed border-border/50"
        >
          <Zap className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-primary">Activate The Spark</h2>
          <p className="mt-2 text-muted-foreground">This feature is powered by your own wins. Capture a few to get started.</p>
          <Button asChild className="mt-6 card-glow">
            <Link to="/journal">
              <PlusCircle className="mr-2 h-4 w-4" />
              Capture Your First Win
            </Link>
          </Button>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

        <AnimatePresence>
          {loading && (
            <motion.div key="loader" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <SparkleLoader />
            </motion.div>
          )}
          {message && (
            <motion.div key="message" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="mt-4 bg-card/50 border-ring/20 card-glow transition-all">
                <CardContent className="pt-6 text-lg leading-relaxed text-foreground">
                  {message}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return <>{renderContent()}</>;
};

export default Spark;
