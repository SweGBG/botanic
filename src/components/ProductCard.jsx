'use client'

import styles from './ProductCard.module.css'

export default function ProductCard({ tag, name, desc, price, variant = 'p1' }) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.iconArea}>
        <span className={styles.pulseRing} />
        <div className={styles.circle}>
          <div className={styles.circleInner} />
        </div>
      </div>
      <p className={styles.tag}>{tag}</p>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.desc}>{desc}</p>
      <div className={styles.footer}>
        <span className={styles.price}>{price}</span>
        <button className={styles.add} aria-label={`Add ${name} to cart`}>+</button>
      </div>
    </div>
  )
}
