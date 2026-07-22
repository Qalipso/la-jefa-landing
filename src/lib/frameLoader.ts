/**
 * Prioritized, concurrency-limited preloader for the frame sequence.
 * Image objects are created exactly once, never during scroll.
 */
export class FrameLoader {
  readonly images: (HTMLImageElement | null)[]
  /** 0 = pending, 1 = loaded, 2 = error */
  private status: Uint8Array
  private settled = 0
  private aborted = false
  private started = false

  onProgress?: (settled: number, total: number) => void
  onFrameLoaded?: (index: number) => void

  private urls: string[]

  constructor(urls: string[]) {
    this.urls = urls
    this.images = new Array(urls.length).fill(null)
    this.status = new Uint8Array(urls.length)
  }

  get total() {
    return this.urls.length
  }

  get isComplete() {
    return this.settled >= this.urls.length
  }

  /** First frame → near window → everything else, `concurrency` at a time. */
  start(priorityWindow: number, concurrency = 6) {
    if (this.started) return
    this.started = true
    const order: number[] = []
    const seen = new Set<number>()
    const push = (i: number) => {
      if (i >= 0 && i < this.urls.length && !seen.has(i)) {
        seen.add(i)
        order.push(i)
      }
    }
    push(0)
    for (let i = 1; i <= priorityWindow; i++) push(i)
    for (let i = 0; i < this.urls.length; i++) push(i)

    let cursor = 0
    const worker = async () => {
      while (!this.aborted) {
        const index = order[cursor++]
        if (index === undefined) return
        await this.loadOne(index)
      }
    }
    for (let k = 0; k < concurrency; k++) void worker()
  }

  private loadOne(index: number): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = async () => {
        try {
          await img.decode()
        } catch {
          /* decode failure still leaves a drawable image */
        }
        if (!this.aborted) {
          this.images[index] = img
          this.status[index] = 1
          this.settled++
          this.onFrameLoaded?.(index)
          this.onProgress?.(this.settled, this.total)
        }
        resolve()
      }
      img.onerror = () => {
        if (!this.aborted) {
          // One broken image must not break the page: count it settled,
          // nearestLoaded() will substitute a neighbour at draw time.
          this.status[index] = 2
          this.settled++
          this.onProgress?.(this.settled, this.total)
        }
        resolve()
      }
      img.src = this.urls[index]
    })
  }

  /** Closest successfully loaded frame to `index`, or -1 if none yet. */
  nearestLoaded(index: number): number {
    if (this.status[index] === 1) return index
    for (let d = 1; d < this.urls.length; d++) {
      if (this.status[index - d] === 1) return index - d
      if (this.status[index + d] === 1) return index + d
    }
    return -1
  }

  abort() {
    this.aborted = true
  }
}
