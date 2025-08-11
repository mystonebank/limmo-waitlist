import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { motion } from "framer-motion"; TO REVERT
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TAGS = ["breakthroughs", "feedback", "connections"] as const;

const Journal = () => {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "Limmo — Journal";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Capture a new winning moment in Limmo.");
  }, []);

  const saveWin = async () => {
    if (!content.trim()) {
      toast({ title: "Add some details", description: "Write a few words about your win." });
      return;
    }
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      toast({ title: "Not signed in", description: "Please sign in again." });
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("wins").insert({
      user_id: userId,
      content: content.trim(),
      tags,
    });

    setSaving(false);
    if (error) {
      toast({ title: "Could not save", description: error.message });
    } else {
      setContent("");
      setTags([]);
      toast({ title: "Win captured!", description: "Keep them coming." });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="container py-10 max-w-2xl">
      {/* Added motion.section for a smooth fade-in animation -- TO REVERT */}        
      {/*     <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="container py-10 max-w-2xl mx-auto"
      > */}
        <div className="flex items-center justify-between mb-8">
          {/* Applied the text-glow class to the header */}
          <h1 className="text-4xl font-bold text-primary text-glow tracking-tight">
            What's a win from today?
          </h1>
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            Back to Hub
          </Link>
        </div>

        {/* Applied textarea-glow and other styles for the aesthetic */}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write about a breakthrough, positive feedback, a new connection, or any small victory..."
          className="min-h-[180px] bg-card/50 border-border/70 text-lg textarea-glow transition-all duration-300 ease-in-out p-4 rounded-lg"
        />

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <ToggleGroup type="multiple" value={tags} onValueChange={(v) => setTags(v)}>
            {TAGS.map((t) => (
              <ToggleGroupItem
                key={t}
                value={t}
                aria-label={t}
                className="capitalize transition-all hover:bg-accent hover:text-accent-foreground"
              >
                {t}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Button variant="outline" size="icon" disabled title="Voice input coming soon" className="bg-transparent border-border/70">
            <Mic className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        <div className="mt-6">
          {/* Added card-glow for a hover effect on the main button */}
          <Button
            onClick={saveWin}
            disabled={saving}
            size="lg"
            className="w-full font-bold text-lg card-glow transition-all duration-300"
          >
            {saving ? "Saving..." : "Save Win"}
          </Button>
        </div>
      <section>      
    </main>
  );
};

export default Journal;
