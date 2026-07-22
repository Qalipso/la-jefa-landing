/**
 * Single source of truth for the scroll-driven frame sequence.
 * Frames live in public/frames/ as web-optimized WebP (originals: 1080×1920 PNG).
 */
export const sequenceConfig = {
  /** Base path of the frame images (served from public/). */
  frameDirectory: `${import.meta.env.BASE_URL}frames`,
  /** frame_001.webp … frame_121.webp */
  frameCount: 121,
  /** Padded index → file name. Index is 0-based, files are 1-based. */
  frameFile: (index: number) =>
    `frame_${String(index + 1).padStart(3, '0')}.webp`,
  /** FPS of the source footage — characterizes natural duration only.
   *  Playback is driven by scroll progress, not by time. */
  fps: 30,
  /** Natural duration of the source sequence in seconds (121 / 30 ≈ 4.03s). */
  get naturalDurationSec() {
    return this.frameCount / this.fps
  },
  /** Height of the scroll scene. ~5vh of scroll per frame → deliberate pace. */
  scrollHeightVh: 600,
  /** Intrinsic frame size (all frames verified identical). */
  frameWidth: 1080,
  frameHeight: 1920,
  fit: 'cover' as const,
  /** Focal point used by the cover-crop math (0..1 in image space). */
  focalPoint: {
    desktop: { x: 0.5, y: 0.5 },
    mobile: { x: 0.5, y: 0.55 },
  },
  /** How many frames around the current one get priority loading. */
  preloadAhead: 12,
  /** Cap canvas backing-store resolution on very dense displays. */
  maxDevicePixelRatio: 2,
  /** Frame shown as the static poster under prefers-reduced-motion. */
  reducedMotionFrameIndex: 60,
}
