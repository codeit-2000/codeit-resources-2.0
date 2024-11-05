import { TargetAndTransition } from "framer-motion";

export const springConfig = {
  type: "spring",
  damping: 25,
  stiffness: 200,
  mass: 0.7,
} as const;

export const closeSpringConfig = {
  type: "spring",
  damping: 25,
  stiffness: 100,
  mass: 0.7,
} as const;

export const variants = {
  closed: {
    y: "100%",
    scaleY: 0,
    transition: springConfig,
  },
  half: {
    y: 0,
    height: "50vh",
    scaleY: 1,
    transition: springConfig,
  },
  full: {
    y: 0,
    height: "100vh",
    scaleY: 1,
    transition: springConfig,
  },
} as const;

export const getCloseAnimation = (): TargetAndTransition => ({
  y: "100%",
  scaleY: 0,
  transition: closeSpringConfig,
});
