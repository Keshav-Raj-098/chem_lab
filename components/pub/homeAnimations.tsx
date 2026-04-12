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

  // ─── HERO TIMELINE (no ScrollTrigger) ───
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } })

  heroTl
    .fromTo('[data-anim="hero-badge"]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.2)
    .fromTo('[data-anim="hero-title"]', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1 }, 0.4)
    .fromTo('[data-anim="hero-subtitle"]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.7)
    .fromTo('[data-anim="hero-buttons"]', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.9)
    .fromTo('[data-anim="hero-scroll"]', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.1)

  // Scroll indicator bounce
  const scrollEl = document.querySelector('[data-anim="hero-scroll"]')
  if (scrollEl) {
    gsap.to(scrollEl, { y: 8, duration: 1.5, repeat: -1, yoyo: true, ease: "sine.inOut" })
  }

  // Molecular SVG
  const molEl = document.querySelector('[data-anim="hero-molecular"]')
  if (molEl) {
    gsap.fromTo(molEl, { opacity: 0, rotation: -15 }, { opacity: 0.06, rotation: 0, duration: 2, delay: 0.5, ease: "power2.out" })
  }

  // ─── STATS: count-up + fade ───
  const statItems = document.querySelectorAll('[data-anim="stat"]')
  if (statItems.length) {
    ScrollTrigger.batch(statItems, {
      start: "top 85%",
      onEnter: (batch: Element[]) => {
        gsap.fromTo(batch, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" })

        batch.forEach((el: Element) => {
          const target = parseInt(el.getAttribute("data-count") || "0", 10)
          const suffix = el.getAttribute("data-suffix") || ""
          const numberEl = el.querySelector(".stat-number")
          if (!numberEl) return

          const obj = { val: 0 }
          gsap.to(obj, {
            val: target,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => {
              numberEl.textContent = Math.round(obj.val) + suffix
            },
          })
        })
      },
      once: true,
    })
  }

  // ─── ABOUT: left/right slide ───
  const aboutLeft = document.querySelector('[data-anim="about-left"]')
  const aboutRight = document.querySelector('[data-anim="about-right"]')
  if (aboutLeft) {
    gsap.fromTo(aboutLeft, { opacity: 0, x: -40 }, {
      opacity: 1, x: 0, duration: 0.9, ease: "power2.out",
      scrollTrigger: { trigger: aboutLeft, start: "top 80%" },
    })
  }
  if (aboutRight) {
    gsap.fromTo(aboutRight, { opacity: 0, x: 40 }, {
      opacity: 1, x: 0, duration: 0.9, ease: "power2.out",
      scrollTrigger: { trigger: aboutRight, start: "top 80%" },
    })
  }

  // ─── RESEARCH CARDS: stagger ───
  const researchCards = document.querySelectorAll(".research-card")
  if (researchCards.length) {
    ScrollTrigger.batch(researchCards, {
      start: "top 85%",
      onEnter: (batch: Element[]) => {
        gsap.fromTo(batch, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" })
      },
      once: true,
    })
  }

  // ─── FACILITIES CARDS: stagger ───
  const facilityCards = document.querySelectorAll(".facility-card")
  if (facilityCards.length) {
    ScrollTrigger.batch(facilityCards, {
      start: "top 85%",
      onEnter: (batch: Element[]) => {
        gsap.fromTo(batch, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" })
      },
      once: true,
    })
  }

  // ─── NEWS CARDS: stagger ───
  const newsCards = document.querySelectorAll(".news-card")
  if (newsCards.length) {
    ScrollTrigger.batch(newsCards, {
      start: "top 85%",
      onEnter: (batch: Element[]) => {
        gsap.fromTo(batch, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" })
      },
      once: true,
    })
  }

  // ─── GENERIC fade-up ───
  document.querySelectorAll('[data-anim="fade-up"]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 80%" },
    })
  })

  // ─── fade-left / fade-right ───
  document.querySelectorAll('[data-anim="fade-left"]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, x: -40 }, {
      opacity: 1, x: 0, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 80%" },
    })
  })
  document.querySelectorAll('[data-anim="fade-right"]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, x: 40 }, {
      opacity: 1, x: 0, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 80%" },
    })
  })

  // ─── CTA heading word split ───
  const ctaHeading = document.querySelector('[data-anim="cta-heading"]')
  if (ctaHeading) {
    const text = ctaHeading.textContent || ""
    const words = text.split(" ")
    ctaHeading.innerHTML = words.map((w) => `<span style="display:inline-block;opacity:0">${w}&nbsp;</span>`).join("")
    const spans = ctaHeading.querySelectorAll("span")
    gsap.fromTo(spans, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power2.out",
      scrollTrigger: { trigger: ctaHeading, start: "top 80%" },
    })
  }

  // ─── Section headings + paragraphs generic ───
  document.querySelectorAll(".section-heading").forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    })
  })
  document.querySelectorAll(".section-label").forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 16 }, {
      opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    })
  })
}

export default function HomeAnimations() {
  useEffect(() => {
    // If scripts already loaded (e.g. hot reload)
    if (window.gsap && window.ScrollTrigger) {
      initAnimations()
    }
  }, [])

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Load ScrollTrigger after gsap is ready — it's loaded by the next Script tag
        }}
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Both scripts loaded, init animations
          setTimeout(initAnimations, 50)
        }}
      />
    </>
  )
}
