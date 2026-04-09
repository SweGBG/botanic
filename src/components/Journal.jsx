import styles from './Journal.module.css'

const posts = [
  {
    variant: 'j1',
    cat: 'Science',
    title: 'Why bakuchiol is replacing retinol in clean skincare',
    date: 'March 2026',
    roman: 'I',
  },
  {
    variant: 'j2',
    cat: 'Ritual',
    title: 'The case for a 3-step skincare routine — and nothing more',
    date: 'February 2026',
    roman: 'II',
  },
  {
    variant: 'j3',
    cat: 'Sourcing',
    title: 'Inside our Nordic birch water harvest in Lapland',
    date: 'January 2026',
    roman: 'III',
  },
]

export default function Journal() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>The journal</p>
          <h2 className={styles.title}>Skin knowledge</h2>
        </div>
        <a href="#" className={styles.link}>Read all</a>
      </div>

      <div className={styles.grid}>
        {posts.map((p, i) => (
          <article key={i} className={`${styles.card} ${styles[p.variant]}`}>
            <div className={styles.imgWrap}>
              <div className={styles.imgInner}>
                <span className={styles.roman}>{p.roman}</span>
              </div>
            </div>
            <p className={styles.cat}>{p.cat}</p>
            <h4 className={styles.postTitle}>{p.title}</h4>
            <p className={styles.date}>{p.date}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
