import ProductCard from './ProductCard'
import styles from './ProductGrid.module.css'

const products = [
  {
    variant: 'p1',
    tag: 'Serum · Hydration',
    name: 'Dew Serum No. 3',
    desc: 'Deep hydration complex with hyaluronic acid and cold-pressed rosehip. Restores skin\'s natural moisture barrier overnight.',
    price: '890 kr',
  },
  {
    variant: 'p2',
    tag: 'Oil · Radiance',
    name: 'Luminous Face Oil',
    desc: 'Bakuchiol and marula oil blend that works like retinol — without the harshness. Visible glow from the first application.',
    price: '1 190 kr',
  },
  {
    variant: 'p3',
    tag: 'Mist · Toning',
    name: 'Forest Toning Mist',
    desc: 'Nordic birch water and green tea extract. Balances pH and preps skin to absorb serums up to 3× more effectively.',
    price: '590 kr',
  },
]

export default function ProductGrid() {
  return (
    <section className={styles.section}>
      <div className={`${styles.header} anim-3`}>
        <div>
          <p className={styles.eyebrow}>The collection</p>
          <h2 className={styles.title}>Formulated with intent</h2>
        </div>
        <a href="#" className={styles.link}>View all products</a>
      </div>

      <div className={styles.grid}>
        {products.map((p, i) => (
          <ProductCard key={i} {...p} />
        ))}
      </div>
    </section>
  )
}
