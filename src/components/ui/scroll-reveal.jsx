import { motion, useReducedMotion } from "framer-motion";

const directions = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

// Only opacity + transform animate, so the compositor does the work.
// `margin` fires the reveal as an edge enters the viewport; a fractional
// `amount` made tall sections wait until they were mostly on screen.
const viewport = { once: true, margin: "0px 0px -12% 0px" };

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  as = "div",
}) {
  const reduceMotion = useReducedMotion();
  const MotionElement = motion[as];
  const offset = directions[direction] ?? directions.up;

  return (
    <MotionElement
      className={className}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.97, ...offset }}
      whileInView={
        reduceMotion ? undefined : { opacity: 1, scale: 1, x: 0, y: 0 }
      }
      viewport={viewport}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionElement>
  );
}
