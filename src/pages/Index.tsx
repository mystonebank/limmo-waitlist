import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit3, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

const Card = ({ to, title, subtitle, Icon }: { to: string; title: string; subtitle: string; Icon: any }) => (
  // The Link is now a positioning container for the content and background.
  <Link
    to={to}
    className="relative group block rounded-xl transition-transform duration-300 hover:-translate-y-1 overflow-hidden p-6"
  >
    {/* This div is now dedicated to the background and blur effect. */}
    <div className="absolute inset-0 bg-card/50 border border-border rounded-xl backdrop-blur card-glow group-hover:border-ring/40 transition-all duration-300"></div>

    {/* This div holds the content and sits on top of the background. */}
    <div className="relative">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary icon-glow" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
    </div>
  </Link>
);

const Index = () => {
  useEffect(() => {
    document.title = "Limmo — Magical Journal for Founders";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Capture wins, revisit memories, and spark motivation with Limmo.");
  }, []);

  // Animation variants for the container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Animate each card slightly after the previous one
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <section className="container py-20">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary text-glow">Limmo</h1>
          <p className="mt-3 text-lg text-muted-foreground">How can I help you today?</p>
        </motion.header>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card to="/journal" title="Journal" subtitle="Capture a new win" Icon={Edit3} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card to="/memory-lane" title="Memory Lane" subtitle="Revisit your journey" Icon={Star} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card to="/spark" title="The Spark" subtitle="Find your inner strength" Icon={Zap} />
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
};

export default Index;
