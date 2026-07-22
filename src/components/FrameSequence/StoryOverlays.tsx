import { storySteps } from '../../config/story'
import styles from './FrameSequence.module.css'

interface Props {
  registerRef: (id: string, el: HTMLDivElement | null) => void
}

/**
 * Text blocks over the sticky canvas. Visibility/transform are driven
 * imperatively from the FrameSequence rAF loop — no React re-renders on scroll.
 */
export function StoryOverlays({ registerRef }: Props) {
  return (
    <div className={styles.overlays}>
      {storySteps.map((step, i) => {
        const Heading = i === 0 ? 'h1' : 'h2'
        if (step.variant === 'reviews') {
          return (
            <div
              key={step.id}
              ref={(el) => registerRef(step.id, el)}
              className={`${styles.step} ${styles.reviewsStep}`}
              data-step={step.id}
            >
              {step.reviews?.map((review) => (
                <article className={styles.review} key={review.author}>
                  <p>{review.quote}</p>
                  <footer>
                    <strong>{review.author}</strong>
                    <span>{review.meta}</span>
                  </footer>
                </article>
              ))}
            </div>
          )
        }
        return (
          <div
            key={step.id}
            ref={(el) => registerRef(step.id, el)}
            className={styles.step}
            data-step={step.id}
            data-align={step.align}
          >
            <div className={styles.stepInner}>
              <p className={styles.eyebrow}>{step.eyebrow}</p>
              <Heading className={i === 0 ? styles.titleH1 : styles.titleH2}>
                {step.title}
              </Heading>
              <p className={styles.text}>{step.text}</p>
              {step.cta && (
                <a className={styles.cta} href={step.cta.href}>
                  {step.cta.label}
                </a>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
