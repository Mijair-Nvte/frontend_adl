// Fade in animation
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Slide up animation
export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

// Scale animation
export const scale = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};

// Slide from left animation
export const slideFromLeft = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
};

// Slide from right animation
export const slideFromRight = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
};

// Pop animation
export const pop = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

// Shared transition settings
export const transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

// List item animation
export const listItem = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
};

// Stagger children animation
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Button hover animation
export const buttonHover = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// View switch animation
export const viewSwitchAnimation = {
  initial: { scale: 0.8, opacity: 0, rotate: -5 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
  exit: { scale: 0.8, opacity: 0, rotate: 5 },
};

// Calendar view transition
export const calendarViewTransition = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
};

// Badge animation
export const badgeAnimation = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
};
