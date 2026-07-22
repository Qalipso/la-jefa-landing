import { useEffect, useRef, useState } from 'react'
import { sequenceConfig } from '../../config/sequence'
import { storySteps } from '../../config/story'
import { FrameLoader } from '../../lib/frameLoader'
import { drawCover } from '../../lib/drawCover'
import { LoadingIndicator } from './LoadingIndicator'
import { StoryOverlays } from './StoryOverlays'
import { StaticStory } from './StaticStory'
import styles from './FrameSequence.module.css'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

const CANVAS_LABEL =
  'Animación cuadro a cuadro: la cámara sale del tambor de un lavarropas hacia una calle empedrada de Montevideo al atardecer y se eleva sobre los techos de tejas.'

export function FrameSequence() {
  const reducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const introGifRef = useRef<HTMLVideoElement>(null)
  const stepRefs = useRef(new Map<string, HTMLDivElement>())

  const [loadPct, setLoadPct] = useState(0)
  const [loadDone, setLoadDone] = useState(false)
  const [firstFrameReady, setFirstFrameReady] = useState(false)

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    const canvas = canvasRef.current
    const introGif = introGifRef.current
    if (!section || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cfg = sequenceConfig
    const urls = Array.from(
      { length: cfg.frameCount },
      (_, i) => `${cfg.frameDirectory}/${cfg.frameFile(i)}`,
    )
    const loader = new FrameLoader(urls)

    // All mutable animation state lives in plain refs/locals — never React state.
    let drawnIndex = -1
    let rafId = 0
    let rafPending = false
    let cssW = 0
    let cssH = 0
    let disposed = false
    const mobileMq = window.matchMedia('(max-width: 768px)')

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      cssW = Math.round(rect.width)
      cssH = Math.round(rect.height)
      const dpr = Math.min(window.devicePixelRatio || 1, cfg.maxDevicePixelRatio)
      const bw = Math.round(cssW * dpr)
      const bh = Math.round(cssH * dpr)
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw
        canvas.height = bh
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      drawnIndex = -1 // resizing clears the canvas — force redraw
    }

    const currentProgress = () => {
      const rect = section.getBoundingClientRect()
      const denom = rect.height - window.innerHeight
      if (denom <= 0) return 0
      return clamp01(-rect.top / denom)
    }

    const updateOverlays = (p: number) => {
      for (const step of storySteps) {
        const el = stepRefs.current.get(step.id)
        if (!el) continue
        const local = (p - step.start) / (step.end - step.start)
        const atStart = step.start <= 0 // visible immediately on load
        const atEnd = step.end >= 1 // stays visible until the scene releases
        if ((local <= 0 && !atStart) || (local >= 1 && !atEnd)) {
          el.style.opacity = '0'
          el.style.pointerEvents = 'none'
          continue
        }
        // Phases inside the range: 0–15% fade in · 15–70% visible · 70–100% fade out
        const fadeIn = atStart ? 1 : local / 0.15
        const fadeOut = atEnd ? 1 : (1 - local) / 0.3
        const visible = clamp01(Math.min(fadeIn, fadeOut))
        const entering = local < 0.5
        const shift = entering ? (1 - visible) * 20 : -(1 - visible) * 16
        el.style.opacity = visible.toFixed(3)
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`
        el.style.filter = entering
          ? `blur(${((1 - visible) * 4).toFixed(1)}px)`
          : 'none'
        el.style.pointerEvents = visible > 0.4 ? 'auto' : 'none'
      }
    }

    const tick = () => {
      rafPending = false
      if (disposed) return
      const p = currentProgress()
      updateOverlays(p)
      if (introGif) {
        const gifOpacity = clamp01(1 - p / 0.14)
        introGif.style.opacity = gifOpacity.toFixed(3)
        introGif.style.visibility = gifOpacity <= 0 ? 'hidden' : 'visible'
      }
      const wanted = Math.round(p * (cfg.frameCount - 1))
      const src = loader.nearestLoaded(wanted)
      if (src >= 0 && src !== drawnIndex) {
        const img = loader.images[src]
        if (img) {
          const focal = mobileMq.matches
            ? cfg.focalPoint.mobile
            : cfg.focalPoint.desktop
          drawCover(ctx, img, cssW, cssH, focal)
          drawnIndex = src
        }
      }
    }

    const schedule = () => {
      if (!rafPending) {
        rafPending = true
        rafId = requestAnimationFrame(tick)
      }
    }

    const onResize = () => {
      setupCanvas()
      schedule()
    }

    loader.onFrameLoaded = (index) => {
      if (index === 0) setFirstFrameReady(true)
      schedule() // the freshly loaded frame may be (closer to) the wanted one
    }
    loader.onProgress = (settled, total) => {
      setLoadPct(Math.round((settled / total) * 100))
      if (settled >= total) setLoadDone(true)
    }

    setupCanvas()
    loader.start(cfg.preloadAhead)
    schedule()

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(onResize)
    ro.observe(canvas)

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
      loader.abort()
    }
  }, [reducedMotion])

  if (reducedMotion) {
    return <StaticStory />
  }

  return (
    <section
      ref={sectionRef}
      className={styles.scene}
      style={{ height: `${sequenceConfig.scrollHeightVh}vh` }}
      aria-label="Historia scroll: del tambor del lavarropas a la ciudad al atardecer"
    >
      <div className={styles.sticky}>
        {/* Intro loop: MP4 (~0.7 MB) instead of the source GIF (~18 MB) */}
        <video
          ref={introGifRef}
          className={styles.introAnimation}
          src={`${import.meta.env.BASE_URL}la-jefa-intro.mp4`}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <canvas
          ref={canvasRef}
          className={`${styles.canvas} ${firstFrameReady ? styles.canvasReady : ''}`}
          role="img"
          aria-label={CANVAS_LABEL}
        />
        <LoadingIndicator percent={loadPct} done={loadDone} />
        <StoryOverlays
          registerRef={(id, el) => {
            if (el) stepRefs.current.set(id, el)
            else stepRefs.current.delete(id)
          }}
        />
      </div>
    </section>
  )
}
