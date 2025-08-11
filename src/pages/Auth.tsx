import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "Limmo — Sign in";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Sign in to Limmo to capture your wins.");
  }, []);

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUrl },
    });
    if (error) {
      toast({ title: "Google sign-in failed", description: error.message });
    }
  };

  const signUpWithEmail = async () => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    if (error) toast({ title: "Sign up failed", description: error.message });
    else toast({ title: "Check your email", description: "Confirm to complete sign up." });
  };

  const signInWithEmail = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Sign in failed", description: error.message });
  };

  return (
    <main className="min-h-screen grid place-items-center bg-background p-4">
      <section 
        className="w-full max-w-md p-8 rounded-xl border border-border bg-card/60 backdrop-blur card-glow transition-shadow"
      >
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-primary text-glow">Limmo</h1>
          <p className="text-sm text-muted-foreground mt-2">Your pocket cheerleader</p>
        </header>

        <div className="space-y-3">
          <Button className="w-full font-semibold card-glow transition-all" onClick={signInWithGoogle} variant="default">
            Continue with Google
          </Button>
        </div>

        <div className="my-6 flex items-center gap-4 text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent input-glow" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-transparent input-glow" />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button onClick={signUpWithEmail} variant="secondary" className="transition-colors hover:border-ring/20">Sign up</Button>
            <Button onClick={signInWithEmail} variant="outline" className="transition-colors hover:border-ring/40">Sign in</Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Auth;
