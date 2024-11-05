import { motion } from "framer-motion";

function BackgroundOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-40 min-h-full w-full bg-black"
      initial="closed"
      animate="opened"
      exit="closed"
      variants={{
        opened: {
          backdropFilter: "blur(1px)",
          opacity: 0.7,
          transition: { duration: 0.3 },
        },
        closed: {
          backdropFilter: "blur(0px)",
          opacity: 0,
          transition: { duration: 0.3 },
        },
      }}
      style={{ height: "100%" }}
    />
  );
}

export default BackgroundOverlay;
