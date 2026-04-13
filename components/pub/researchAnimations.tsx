"use client"
import { useEffect } from "react"
import Script from "next/script"

declare global {
  interface Window {
    gsap: any
    ScrollTrigger: any
  }
}

function initAnimations() {
  const gsap = window.gsap
  const ScrollTrigger = window.ScrollTrigger
  if (!gsap || !ScrollTrigger) return

  gsap.registerPlugin(ScrollTrigger)

  // ─── PAGE LOAD ANIMATIONS (no ScrollTrigger) ───
  const headerLeft = document.querySelector('[data-anim="header-left"]')
  const headerRight = document.querySelector('[data-anim="header-right"]')
  const filterBar = document.querySelector('[data-anim="filter-bar"]')

  if (headerLeft) {
    gsap.fromTo(headerLeft, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" })
  }

  if (headerRight) {
    gsap.fromTo(headerRight, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" })
  }

  if (filterBar) {
    gsap.fromTo(filterBar, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.3, ease: "power2.out" })
  }

  // ─── CARDS: stagger on scroll ───
  const cards = document.querySelectorAll(".project-card")
  if (cards.length) {
    ScrollTrigger.batch(cards, {
      start: "top 88%",
      onEnter: (batch: Element[]) => {
        gsap.from(batch, {
          opacity: 0,
          y: 28,
          stagger: 0.08,
          duration: 0.6,
          ease: "power2.out"
        })
      },
      once: true
    })
  }
}

export default function ResearchAnimations() {
  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
      initAnimations()
    }
  }, [])

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          setTimeout(initAnimations, 50)
        }}
      />
    </>
  )
}
