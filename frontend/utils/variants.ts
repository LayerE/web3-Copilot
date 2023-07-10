import { Variants, animate } from "framer-motion";

export const silde = (direction: "up" | "down"): Variants => {
  return {
    initial: {
      y: direction === "down" ? "-5%" : "5%",
      opacity: 0,
    },
    animate: {
      y: 0,
      rotate: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };
};
export const rollIn = (direction: "up" | "down"): Variants => {
  return {
    initial: {
      y: "-50%",
      opacity: 0,
      rotate: 20,
      scale: 0,
    },
    animate: {
      y: 0,
      rotate: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: "easeIn",
      },
    },
  };
};
export const fadeIn = (direction: "up" | "down"): Variants => {
  return {
    initial: {
      y: direction === "up" ? 40 : -60,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  };
};
export const scaleIn = ({
  xPos,
  yPos,
  duration,
  scaleTimes,
  scaleAndHide,
}: {
  xPos?: number;
  yPos?: number;
  duration?: number;
  scaleTimes?: number;
  scaleAndHide?: boolean;
}): Variants => {
  return {
    initial: {
      scale: 0,
      opacity: 0,
      x: xPos ?? 0,
      y: yPos ?? 0,
    },
    animate: {
      scale: scaleTimes ?? 1,
      opacity: scaleAndHide ? [1, 0] : 1,

      x: 0,
      y: 0,
      transitionEnd: {
        display: scaleAndHide ? "none" : "initial",
      },
      transition: {
        duration: duration ?? 1,
        ease: "linear",
      },
    },
  };
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.25,
    },
  },
};
export const clipart: Variants = {
  initial: {
    y: 0,
    rotate: 0,
  },
  animate: (i: number) => ({
    y: [10, 0, 10],
    rotate: [10, 0, 10],
    transition: {
      delay: 2,
      duration: 2 * i,
      ease: "linear",
      repeat: Infinity,
    },
  }),
};

export const fadeInPage: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: "easeIn",
    },
  },
};
