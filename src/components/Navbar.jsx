'use client'

import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={`${styles.nav} anim-1`}>
      <div className={styles.logo}>
        <div className={styles.logoOrb}>
          <span className={styles.logoOrbDot} />
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoMain}>Botanicatural</span>
          <span className={styles.logoSub}>Botanical &amp; Natural</span>
        </div>
      </div>

      <ul className={styles.navLinks}>
        <li><a href="#">Serums</a></li>
        <li><a href="#">Rituals</a></li>
        <li><a href="#">Ingredients</a></li>
        <li><a href="#">Journal</a></li>
      </ul>

      <button className={styles.navCta}>Shop now</button>
    </nav>
  )
}
