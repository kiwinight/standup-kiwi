import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type UseInViewOptions,
  type MotionProps,
} from "motion/react";
import { useRef } from "react";

type MarginType = UseInViewOptions["margin"];

interface ScrollFadeProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  inViewMargin?: MarginType;
  threshold?: number;
  parallaxIntensity?: number; // How much the section follows scroll (0 = no parallax, 1 = full parallax)
  enableParallax?: boolean;
  // Note: Fade effects removed for better performance - now only provides parallax movement
}

export function ScrollFade({
  children,
  className,
  duration = 0.6,
  delay = 0,
  offset = 50,
  direction = "up",
  inViewMargin = "-100px",
  threshold = 0.1,
  parallaxIntensity = 0.3,
  enableParallax = false,
  ...props
}: ScrollFadeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false, // Allow repeated animations
    margin: inViewMargin,
    amount: threshold,
  });

  // Track scroll progress for parallax effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // Better range for fade effects
  });

  // Transform scroll progress to y movement
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [offset, 0, -offset]
  );

  // No opacity animation for better performance
  // const scrollOpacity = useTransform(
  //   scrollYProgress,
  //   fadeRange, // Use configurable fade range
  //   [0, 1, 1, 1] // Fade in and stay visible (no fade out)
  // );

  // Debug logging - commented out for production
  // useEffect(() => {
  //   const unsubscribe = scrollYProgress.on("change", (value) => {
  //     console.log(
  //       "ScrollFade - scrollYProgress:",
  //       value,
  //       "opacity:",
  //       scrollOpacity.get(),
  //       "y:",
  //       parallaxY.get()
  //     );
  //   });
  //   return unsubscribe;
  // }, [scrollYProgress, scrollOpacity, parallaxY]);

  const getInitialValues = () => {
    switch (direction) {
      case "down":
        return { y: -offset, x: 0 };
      case "left":
        return { x: offset, y: 0 };
      case "right":
        return { x: -offset, y: 0 };
      case "up":
      default:
        return { y: offset, x: 0 };
    }
  };

  const initialValues = getInitialValues();

  if (enableParallax) {
    // For parallax mode, use motion values directly (no fade for performance)
    return (
      <motion.div
        ref={ref}
        style={{
          y: parallaxY, // Only parallax movement, no opacity animation
          position: "relative", // Fix positioning for scroll calculation
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  } else {
    // For non-parallax mode, use regular animations
    return (
      <motion.div
        ref={ref}
        initial={{
          opacity: 0,
          ...initialValues,
        }}
        animate={{
          opacity: isInView ? 1 : 0,
          x: isInView ? 0 : initialValues.x,
          y: isInView ? 0 : initialValues.y,
        }}
        transition={{
          duration,
          delay,
          ease: "easeOut",
          opacity: { duration: duration * 0.8 },
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
}
