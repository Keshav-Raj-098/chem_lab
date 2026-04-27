"use client"
import { motion, useInView, useMotionValue, useTransform, animate, type HTMLMotionProps } from "framer-motion"
import { useEffect, useRef } from "react"

const EASE = [0.22, 1, 0.36, 1] as const

type RevealProps = HTMLMotionProps<"div"> & {
  y?: number
  x?: number
  delay?: number
  duration?: number
  once?: boolean
  amount?: number
}

export function Reveal({
  y = 24,
  x = 0,
  delay = 0,
  duration = 0.7,
  once = true,
  amount = 0.2,
  children,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function HeroReveal({
  y = 24,
  delay = 0,
  duration = 0.8,
  children,
  ...rest
}: Omit<RevealProps, "x" | "once" | "amount">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function StatCounter({
  to,
  suffix = "",
  label,
  delay = 0,
}: {
  to: number
  suffix?: string
  label: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => Math.round(v) + suffix)

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, to, { duration: 1.5, ease: EASE, delay })
    return () => controls.stop()
  }, [inView, to, delay, mv])

  return (
    <motion.div
      ref={ref}
      className="stat-item"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      <motion.div className="stat-number">{text}</motion.div>
      <div className="stat-label">{label}</div>
    </motion.div>
  )
}
