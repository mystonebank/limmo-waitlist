import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-primary">What's a win from today?</h1>
          <Link to="/" className="text-sm text-muted-foreground hover:underline">Back</Link>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a short win..."
          className="min-h-[180px]"
        />

        <div className="mt-4 flex items-center justify-between">
          <ToggleGroup type="multiple" value={tags} onValueChange={(v) => setTags(v)}>
            {TAGS.map((t) => (
              <ToggleGroupItem key={t} value={t} aria-label={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Button variant="outline" disabled title="Voice input coming soon">
            <Mic className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6">
          <Button onClick={saveWin} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Win"}
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Journal;
