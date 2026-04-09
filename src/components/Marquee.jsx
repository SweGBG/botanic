import styles from './Marquee.module.css'

const items = [
  'Clean formulas',
  'Certified organic',
  'Zero compromise',
  'Botanically sourced',
  'Cruelty free',
  'Refillable packaging',
  'Dermatologist tested',
  'Carbon neutral',
]

export default function Marquee() {
  const doubled = [...items, ...items]

  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <span className={styles.dot} />
          </span>
        ))}
      </div>
    </div>
  )
}
