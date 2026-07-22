/**
 * Draw an image onto a canvas emulating `object-fit: cover` with a focal point.
 * Coordinates are in CSS pixels — the context transform handles DPR.
 */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cssWidth: number,
  cssHeight: number,
  focal: { x: number; y: number },
) {
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  if (!iw || !ih) return
  const scale = Math.max(cssWidth / iw, cssHeight / ih)
  const dw = iw * scale
  const dh = ih * scale
  const dx = (cssWidth - dw) * focal.x
  const dy = (cssHeight - dh) * focal.y
  ctx.drawImage(img, dx, dy, dw, dh)
}
