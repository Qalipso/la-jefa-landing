import { sequenceConfig } from '../../config/sequence'
import { storySteps } from '../../config/story'
import styles from './FrameSequence.module.css'

/**
 * prefers-reduced-motion fallback: one representative still
 * plus the full story as ordinary stacked sections. All content and CTAs stay.
 */
export function StaticStory() {
  const cfg = sequenceConfig
  const poster = `${cfg.frameDirectory}/${cfg.frameFile(cfg.reducedMotionFrameIndex)}`
  return (
    <section aria-label="Historia: del tambor del lavarropas a la ciudad al atardecer">
      <div className={styles.staticPoster}>
        <img
          src={poster}
          alt="Calle empedrada de Montevideo al atardecer, luz cálida de un farol en la esquina"
        />
      </div>
      <div className={styles.staticFlow}>
        {storySteps.map((step, i) => {
          const Heading = i === 0 ? 'h1' : 'h2'
          if (step.variant === 'reviews') {
            return (
              <div key={step.id} className={styles.staticStep}>
                {step.reviews?.map((review) => (
                  <blockquote className={styles.review} key={review.author}>
                    <p>{review.quote}</p>
                    <footer>
                      <strong>{review.author}</strong>
                      <span>{review.meta}</span>
                    </footer>
                  </blockquote>
                ))}
              </div>
            )
          }
          return (
            <div key={step.id} className={styles.staticStep}>
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
          )
        })}
      </div>
    </section>
  )
}
