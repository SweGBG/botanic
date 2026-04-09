import styles from './Ritual.module.css'

const steps = [
  {
    num: '01',
    title: 'Cleanse',
    text: 'Begin with pure intention. Our oil cleanser dissolves impurities without stripping the skin\'s protective lipid layer.',
  },
  {
    num: '02',
    title: 'Mist + tone',
    text: 'Hydrate and balance. Apply forest mist while skin is still damp to lock in micro-moisture before serum.',
  },
  {
    num: '03',
    title: 'Serum + oil',
    text: 'Layer intelligence. Press dew serum into skin, then seal with luminous oil. Watch the transformation over 28 days.',
  },
]

const ingredients = [
  'Rosehip', 'Bakuchiol', 'Marula',
  'Birch water', 'Green tea', 'Sea buckthorn',
]

export default function Ritual() {
  return (
    <section className={styles.ritual}>
      {/* LEFT */}
      <div className={`${styles.left} anim-3`}>
        <p className={styles.eyebrow}>The method</p>
        <h2 className={styles.title}>
          The <em>Botanicatural</em><br />ritual
        </h2>

        <div className={styles.steps}>
          {steps.map((s) => (
            <div key={s.num} className={styles.step}>
              <span className={styles.stepNum}>{s.num}</span>
              <div>
                <p className={styles.stepTitle}>{s.title}</p>
                <p className={styles.stepText}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <h3 className={styles.rightTitle}>
          Pure<br />ingredients,<br />always.
        </h3>
        <p className={styles.rightText}>
          Every Botanicatural formula starts with a question: does this ingredient
          deserve a place on your skin? We source from certified organic farms
          across Scandinavia, the Mediterranean, and sub-Saharan Africa.
        </p>
        <div className={styles.tags}>
          {ingredients.map((ing) => (
            <span key={ing} className={styles.tag}>{ing}</span>
          ))}
        </div>
        <button className={styles.btn}>Explore ingredients</button>
      </div>
    </section>
  )
}
