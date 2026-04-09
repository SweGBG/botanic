import styles from './Footer.module.css'

const nav = {
  Products: ['Serums', 'Face oils', 'Mists', 'Rituals'],
  Company: ['Our story', 'Ingredients', 'Sustainability', 'Press'],
  Support: ['FAQ', 'Shipping', 'Returns', 'Contact'],
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.brandName}>Botanicatural</div>
          <p className={styles.tagline}>
            Skin intelligence rooted in nature. Formulated without compromise
            for people who care what goes on their skin.
          </p>
          <div className={styles.social}>
            <button className={styles.socialBtn}>Ig</button>
            <button className={styles.socialBtn}>Tt</button>
            <button className={styles.socialBtn}>Pi</button>
          </div>
        </div>

        {Object.entries(nav).map(([col, links]) => (
          <div key={col} className={styles.col}>
            <h5 className={styles.colHead}>{col}</h5>
            {links.map((l) => (
              <a key={l} href="#" className={styles.colLink}>{l}</a>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>© 2026 Botanicatural. All rights reserved.</p>
        <p className={styles.copy}>Formulated in Scandinavia</p>
      </div>
    </footer>
  )
}
