'use client'

import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* LEFT */}
      <div className={styles.heroLeft}>
        <p className={`${styles.eyebrow} anim-2`}>
          Clean beauty · Est. 2024
        </p>
        <h1 className={`${styles.title} anim-2`}>
          Skin that<br />
          <em>remembers</em><br />
          nature.
        </h1>
        <p className={`${styles.sub} anim-3`}>
          Botanicatural formulates with certified organic botanicals and zero
          compromise. Each ritual is a return to what skin has always known —
          the intelligence of plants, distilled.
        </p>
        <div className={`${styles.btns} anim-4`}>
          <a href="/discover" className={styles.btnPrimary}>Discover the ritual</a>
          <button className={styles.btnText}>Our ingredients</button>
        </div>
      </div>

      {/* RIGHT — animated product stage */}
      <div className={styles.heroRight}>
        <div className={`${styles.orbitRing} ${styles.ring3}`} />
        <div className={`${styles.orbitRing} ${styles.ring2}`}>
          <span className={`${styles.ringDot} ${styles.ringDotGold}`} />
        </div>
        <div className={`${styles.orbitRing} ${styles.ring1}`}>
          <span className={styles.ringDot} />
        </div>

        <div className={styles.productStage}>
          <div className={styles.bottleCap} />
          <div className={styles.bottle}>
            <div className={styles.bottleFill} />
            <div className={styles.bottleLabel}>
              <span className={styles.labelLine} />
              <span className={styles.labelName}>Dew Serum<br />No. 3</span>
              <span className={styles.labelSub}>Hydration · 30ml</span>
              <span className={styles.labelLine} />
            </div>
          </div>
        </div>

        <div className={styles.badge}>
          <div className={styles.badgeNum}>98%</div>
          <div className={styles.badgeLabel}>Natural origin</div>
        </div>
      </div>
    </section>
  )
}
