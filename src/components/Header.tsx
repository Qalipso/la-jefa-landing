import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <a className={styles.logo} href="#top" aria-label="La Jefa — inicio">
        LA JEFA
      </a>
      <p className={styles.tagline}>Lavandería · Salto 1249 · Montevideo</p>
    </header>
  )
}
