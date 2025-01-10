import type { Variants } from "framer-motion"

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export const slideIn: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500
    }
  }
}

export const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  }
}

export const buttonHover = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 10
  }
}

export const cardHover = {
  y: -5,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 17
  }
} 