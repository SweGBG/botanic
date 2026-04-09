import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import ProductGrid from '@/components/ProductGrid'
import Ritual from '@/components/Ritual'
import Journal from '@/components/Journal'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      <ProductGrid />
      <Ritual />
      <Journal />
      <Footer />
    </main>
  )
}