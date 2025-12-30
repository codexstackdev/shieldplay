"use client";

import { motion } from "framer-motion";

const FullPageLoader = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Rotating spinner */}
        <motion.div
          className="mb-6 h-20 w-20 rounded-full border-4 border-t-primary border-b-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        ></motion.div>

        {/* Animated text */}
        <motion.h1
          className="text-3xl font-bold mb-2"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading...
        </motion.h1>

        <motion.p
          className="text-center text-muted-foreground max-w-sm"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Please wait while we load your content. This shouldn’t take long.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default FullPageLoader;
