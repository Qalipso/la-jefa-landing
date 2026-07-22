import styles from './FrameSequence.module.css'

interface Props {
  percent: number
  done: boolean
}

export function LoadingIndicator({ percent, done }: Props) {
  return (
    <div
      className={`${styles.loader} ${done ? styles.loaderDone : ''}`}
      aria-hidden={done}
    >
      <span aria-live="polite">Loading {percent}%</span>
      <span className={styles.loaderBar}>
        <span
          className={styles.loaderFill}
          style={{ transform: `scaleX(${percent / 100})` }}
        />
      </span>
    </div>
  )
}
