import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, Calendar, Zap, ArrowRight, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Waitlist = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [challenge, setChallenge] = useState("");
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [countLoading, setCountLoading] = useState(true);
  const [recentEmails, setRecentEmails] = useState<string[]>([]);
  const [currentSparkExample, setCurrentSparkExample] = useState(0);

  // Spark examples for the demo
  const sparkExamples = [
    {
      quote: "pitched 5 investors despite nerves",
      message: "That shows courage in action — each step like that builds momentum. Keep leaning into the discomfort, it's working."
    },
    {
      quote: "shipped onboarding fix after three late nights",
      message: "That's proof you can push through stuck points and deliver. Today's challenge is just another step on that path."
    },
    {
      quote: "turned feedback into new beta signup flow",
      message: "That's your adaptability shining through. Keep shaping and learning — progress follows iteration."
    },
    {
      quote: "met with 3 founders and got product validation",
      message: "That connection power is already yours. Keep reaching out — your network is one of your strongest assets."
    },
    {
      quote: "first 10 paying customers in a week",
      message: "That traction is proof the market wants what you're building. Doubt less, share more — momentum is on your side."
    },
    {
      quote: "landed first paying customer after 12 demos",
      message: "That's proof you turn persistence into traction—take one small step today."
    }
  ];

  // Cycle through Spark examples
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSparkExample((prev) => (prev + 1) % sparkExamples.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch initial waitlist count and recent emails
  useEffect(() => {
    const fetchWaitlistData = async () => {
      try {
        // Fetch total count
        const { count, error: countError } = await supabase
          .from("waitlist")
          .select("*", { count: "exact", head: true });

        // Fetch recent emails
        const { data, error: dataError } = await supabase
          .from("waitlist")
          .select("email")
          .order("created_at", { ascending: false })
          .limit(20);

        if (countError || dataError) {
          console.error("Error fetching waitlist data:", countError || dataError);
          setWaitlistCount(0);
          setRecentEmails([]);
        } else {
          setWaitlistCount(count || 0);
          setRecentEmails(data?.map(item => item.email) || []);
        }
      } catch (error) {
        console.error("Error:", error);
        setWaitlistCount(0);
        setRecentEmails([]);
      } finally {
        setCountLoading(false);
      }
    };

    fetchWaitlistData();
  }, []);

    const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: "Please enter your email", description: "We need your email to add you to the waitlist." });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("waitlist")
        .insert([{ email: email.trim() }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({ title: "Already on the waitlist!", description: "You're already signed up. We'll notify you when we launch." });
        } else {
          throw error;
        }
      } else {
        setSubmitted(true);
        // Increment the waitlist count and add email to recent list after successful submission
        setWaitlistCount(prevCount => prevCount + 1);
        setRecentEmails(prevEmails => [email.trim(), ...prevEmails.slice(0, 19)]);
        toast({ title: "Welcome to the waitlist!", description: "You're now on the list for early access." });
      }
    } catch (error) {
      console.error("Waitlist signup error:", error);
      toast({ title: "Something went wrong", description: "Please try again or contact us directly." });
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge.trim()) return;

    setChallengeLoading(true);
    
    try {
      console.log("Attempting to update challenge for email:", email);
      
      // First, check if the email exists in the waitlist
      const { data: existingData, error: selectError } = await supabase
        .from("waitlist")
        .select("email, biggest_challenge")
        .eq('email', email)
        .maybeSingle();

      console.log("Existing record check:", { existingData, selectError });

      if (selectError) {
        console.error("Error checking existing record:", selectError);
        throw selectError;
      }

      if (!existingData) {
        console.error("Email not found in waitlist:", email);
        toast({ title: "Email not found", description: "Please join the waitlist first." });
        return;
      }

      console.log("Found existing record:", existingData);

      // Try to update the existing record
      const { error, data } = await supabase
        .from("waitlist")
        .update({ 
          biggest_challenge: challenge.trim() 
        })
        .eq('email', email)
        .select(); // Add select to return the updated data

      console.log("Update result:", { error, data });

      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }
      
      toast({ title: "Thanks for sharing!", description: "This helps us build Limmo for founders like you." });
      setChallenge("");
      setChallengeSubmitted(true);
    } catch (error) {
      console.error("Challenge submission error:", error);
      toast({ title: "Couldn't save your response", description: "No worries, we'll still keep you updated!" });
    } finally {
      setChallengeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-silver">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-silver/5 via-transparent to-silver/10"></div>
        
        <div className="relative z-10 container mx-auto px-6 sm:px-4 py-20 flex items-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left max-w-4xl mx-auto flex-1"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-silver relative mb-12">
              <span className="relative z-10 drop-shadow-[0_0_20px_rgba(210,210,210,0.4)]">
                Limmo
              </span>
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-bold text-silver mb-4">
              Your pocket cheerleader. Designed for first-time founders.
            </h2>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mb-12">
              Capture wins, revisit proof, and get AI-powered sparks when doubt hits.
            </p>

            {/* Interactive Section - Progress Bar + Email Form + Firefly */}
            <div className="flex flex-col lg:flex-row items-start gap-8 max-w-5xl">
              {/* Left Column - Progress Bar + Email Form */}
              <div className="flex-1 max-w-md w-full">
                {/* Progress Bar or Avatar Strip */}
                {waitlistCount < 20 ? (
                  <div className="mb-8 px-4 sm:px-0">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex -space-x-2">
                        {recentEmails.slice(0, 7).map((email, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 bg-gradient-to-br from-silver/20 to-silver/40 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs font-medium text-silver"
                          >
                            {email.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {waitlistCount > 7 && (
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs font-medium text-gray-300">
                            +{waitlistCount - 7}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-400 ml-2">
                        {waitlistCount} founders already joined
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-silver h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${countLoading ? 0 : Math.min((waitlistCount / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 px-4 sm:px-0">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>
                        {countLoading ? "Loading..." : `${waitlistCount} founders already on the waitlist`}
                      </span>
                      <span>Join them today!</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-silver h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${countLoading ? 0 : Math.min((waitlistCount / 100) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Email Form */}
                {!submitted ? (
                  <form onSubmit={handleEmailSubmit} className="px-4 sm:px-0">
                    <div className="flex gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-gray-900 border-gray-700 text-silver placeholder-gray-500"
                        disabled={loading}
                      />
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="px-8 bg-silver text-black hover:bg-gray-300 transition-all duration-300"
                      >
                        {loading ? "Joining..." : "Join Waitlist"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 sm:px-0"
                  >
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <h3 className="font-semibold text-silver">You're on the waitlist!</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    {challengeSubmitted 
                      ? "We'll send your invite as we roll out early access."
                      : "We'll notify you when Limmo launches. Want to help us build it better?"
                    }
                  </p>
                  {!challengeSubmitted ? (
                    <form onSubmit={handleChallengeSubmit} className="space-y-3">
                      <Input
                        placeholder="What's your biggest founder challenge right now?"
                        value={challenge}
                        onChange={(e) => setChallenge(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-silver placeholder-gray-500"
                        disabled={challengeLoading}
                      />
                      <Button 
                        type="submit" 
                        size="sm"
                        disabled={challengeLoading || !challenge.trim()}
                        className="w-full bg-silver text-black hover:bg-gray-300 border-gray-600"
                      >
                        {challengeLoading ? "Sending..." : "Share Challenge"}
                      </Button>
                    </form>
                  ) : null}
                </div>
              </motion.div>
            )}
              </div>

              {/* Right Column - Firefly */}
              <div className="flex-shrink-0 flex items-center justify-center lg:justify-center self-end lg:self-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="relative"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-radial from-yellow-400/20 via-yellow-300/10 to-transparent rounded-full blur-xl scale-150"></div>
                  
                  {/* Firefly image */}
                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 7,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative z-10 firefly-animation"
                    style={{
                      animationPlayState: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'paused' : 'running'
                    }}
                  >
                    <img
                      src="/firefly.png"
                      alt="Limmo firefly mascot"
                      className="w-40 h-40 lg:w-48 lg:h-48 object-contain"
                      style={{
                        filter: 'drop-shadow(0 0 12px rgba(255, 255, 0, 0.4))'
                      }}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Why Join Limmo Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 text-silver"
          >
            Why Join Limmo?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Calendar,
                title: "See Your Progress Clearly",
                description: "Turn quick wins into a Memory Lane you can lean on when it’s tough."
              },
              {
                icon: Sparkles,
                title: "Motivation That's Yours",
                description: "Sparks reference your actual victories, not generic pep talks."
              },
              {
                icon: Zap,
                title: "Fit Into Your Workflow",
                description: "Capture in seconds, reflect more, and share updates faster."
              }
            ].map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-black border-gray-700 h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <pillar.icon className="h-6 w-6 text-silver" />
                    </div>
                    <h3 className="font-semibold mb-2 text-silver">{pillar.title}</h3>
                    <p className="text-sm text-gray-400">{pillar.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg font-medium mb-4 text-silver">
              "Built by founders, for founders... because resilience is a founder's superpower."
            </p>
{/*         <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Users className="h-4 w-4" />
              <span>Launching with early founders from YC & Indie Hackers</span>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 text-silver"
          >
            How It Works
          </motion.h2>

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Steps */}
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Capture your wins in seconds",
                  description: "Voice or text - whatever works for your flow."
                },
                {
                  step: "2", 
                  title: "Revisit your memory lane",
                  description: "See your breakthroughs and progress over time."
                },
                {
                  step: "3",
                  title: "Get AI sparks when you need them",
                  description: "When you need them most, backed by your own wins."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start gap-6"
                >
                  <div className="w-12 h-12 bg-silver rounded-full flex items-center justify-center text-black font-bold text-lg flex-shrink-0 mt-1">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 text-silver">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column - Spark Demo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center lg:justify-end relative"
            >
              {/* Firefly floating next to demo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute -top-16 lg:-top-4 -left-4 z-10"
              >
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                    rotate: [0, 2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-radial from-yellow-400/15 via-yellow-300/8 to-transparent rounded-full blur-lg scale-125"></div>
                  
                  <img
                    src="/firefly_smile.png"
                    alt="Limmo firefly mascot"
                    className="w-32 h-32 lg:w-40 lg:h-40 object-contain relative z-10"
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(255, 255, 0, 0.3))'
                    }}
                  />
                </motion.div>
              </motion.div>

              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-black" />
                  </div>
                  <span className="text-sm font-medium text-silver">Spark</span>
                </div>
                
                <div className="space-y-3">
                  <motion.div
                    key={`quote-${currentSparkExample}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 1.5 }}
                    className="text-sm text-gray-300"
                  >
                    You wrote{' '}
                    <span className="text-silver font-medium bg-gray-800 px-2 py-1 rounded">
                      '{sparkExamples[currentSparkExample].quote}.'
                    </span>
                  </motion.div>
                  
                  <motion.div
                    key={`message-${currentSparkExample}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-sm text-gray-300"
                  >
                    {sparkExamples[currentSparkExample].message}
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 2.4 }}
                  className="mt-4 pt-4 border-t border-gray-700"
                >
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>AI-powered motivation</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-700">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 mb-4">
            Limmo is the stigma-free motivation companion for first-time founders.
          </p>
          <p className="text-sm text-gray-400">
            Your data, your wins, your spark. Private and secure.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Waitlist;
