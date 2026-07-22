import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <h2 className={styles.title}>Ropa limpia. Día liviano.</h2>
      <p className={styles.text}>
        Encontranos en Salto 1249, 11200 Montevideo. Abrimos a las 9:00.
      </p>
      <a className={styles.cta} href="tel:098148318">
        Llamar al 098 148 318
      </a>
      <p className={styles.copyright}>© 2026 Lavadero de ropa “La Jefa”.</p>
    </footer>
  )
}
