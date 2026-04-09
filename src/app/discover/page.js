import styles from './discover.module.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Discover the Ritual — Botanicatural',
  description: 'The natural path to skin that remembers what it feels like to be nourished.',
}

export default function DiscoverPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>

        {/* OPENING */}
        <section className={styles.opening}>
          <div className={styles.openingLeft}>
            <p className={styles.tag}>The ritual</p>
            <h1 className={styles.openingTitle}>
              Your skin<br />
              has a<br />
              <em>memory.</em>
            </h1>
          </div>
          <div className={styles.openingRight}>
            <p className={styles.openingLead}>
              Before synthetic formulas. Before preservatives and petroleum
              derivatives and chemicals engineered to simulate what plants
              do naturally — your skin already knew how to thrive.
            </p>
            <p className={styles.openingBody}>
              It remembered rosehip. It recognised marula. It absorbed
              bakuchiol the way it absorbs nothing else. The Botanicatural
              ritual is not a new invention. It is an old conversation, resumed.
            </p>
          </div>
        </section>

        {/* STATEMENT */}
        <div className={styles.statement}>
          <div className={styles.statementInner}>
            <span className={styles.statementPre}>We believe</span>
            <p className={styles.statementText}>
              The most advanced skincare technology on earth<br />
              is a plant that has spent ten thousand years<br />
              <em>learning how to survive.</em>
            </p>
          </div>
          <div className={styles.statementOrb} />
        </div>

        {/* THREE STEPS */}
        <section className={styles.steps}>
          <div className={styles.stepsHeader}>
            <p className={styles.tag}>The three steps</p>
            <h2 className={styles.stepsTitle}>
              Sixty seconds.<br />Every morning.<br />
              <em>Everything changes.</em>
            </h2>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepVisual}>
                <div className={styles.stepCircle}>
                  <span className={styles.stepCircleInner} style={{background:'rgba(74,90,58,0.5)'}} />
                </div>
              </div>
              <div className={styles.stepContent}>
                <span className={styles.stepNum}>01</span>
                <h3 className={styles.stepName}>Cleanse</h3>
                <p className={styles.stepText}>
                  Most cleansers strip skin to zero — removing bacteria, yes,
                  but also the lipids your skin spent all night rebuilding.
                  Our oil-based formula dissolves impurities through the
                  principle of like dissolving like. Dirt leaves. Everything vital stays.
                </p>
                <div className={styles.stepIngredients}>
                  <span>Jojoba oil</span>
                  <span>Vitamin E</span>
                  <span>Sea buckthorn</span>
                </div>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepVisual}>
                <div className={styles.stepCircle}>
                  <span className={styles.stepCircleInner} style={{background:'rgba(138,158,114,0.4)'}} />
                </div>
              </div>
              <div className={styles.stepContent}>
                <span className={styles.stepNum}>02</span>
                <h3 className={styles.stepName}>Mist & Tone</h3>
                <p className={styles.stepText}>
                  Apply while skin is still warm and damp. Nordic birch water —
                  harvested once a year in Lapland when the trees first wake from winter —
                  carries xylitol and saponins deep into the dermis.
                  Think of it as opening a door. Everything that follows walks through it.
                </p>
                <div className={styles.stepIngredients}>
                  <span>Birch water</span>
                  <span>Green tea</span>
                  <span>Niacinamide</span>
                </div>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepVisual}>
                <div className={styles.stepCircle}>
                  <span className={styles.stepCircleInner} style={{background:'rgba(200,169,110,0.35)'}} />
                </div>
              </div>
              <div className={styles.stepContent}>
                <span className={styles.stepNum}>03</span>
                <h3 className={styles.stepName}>Serum & Oil</h3>
                <p className={styles.stepText}>
                  Press — do not rub — the Dew Serum into skin using your fingertips.
                  The warmth of your hands activates the hyaluronic acid complex.
                  Then seal with three drops of Luminous Face Oil. The marula penetrates
                  in seconds. What remains is not a film — it is your skin, finally fed.
                </p>
                <div className={styles.stepIngredients}>
                  <span>Hyaluronic acid</span>
                  <span>Bakuchiol</span>
                  <span>Marula oil</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className={styles.scienceStrip}>
          <div className={styles.scienceStat}>
            <span className={styles.scienceNum}>28</span>
            <span className={styles.scienceLabel}>days to visible transformation</span>
          </div>
          <div className={styles.scienceDivider} />
          <div className={styles.scienceStat}>
            <span className={styles.scienceNum}>98%</span>
            <span className={styles.scienceLabel}>natural origin ingredients</span>
          </div>
          <div className={styles.scienceDivider} />
          <div className={styles.scienceStat}>
            <span className={styles.scienceNum}>0</span>
            <span className={styles.scienceLabel}>synthetic fragrances or parabens</span>
          </div>
          <div className={styles.scienceDivider} />
          <div className={styles.scienceStat}>
            <span className={styles.scienceNum}>6</span>
            <span className={styles.scienceLabel}>certified organic source plants</span>
          </div>
        </div>

        {/* DEEP DIVE */}
        <section className={styles.deepDive}>
          <div className={styles.deepDiveIntro}>
            <p className={styles.tag}>Why natural works</p>
            <h2 className={styles.deepDiveTitle}>
              The science of<br /><em>trusting plants.</em>
            </h2>
          </div>

          <div className={styles.deepCards}>
            <div className={styles.deepCard}>
              <h3 className={styles.deepCardName}>Biocompatibility</h3>
              <p className={styles.deepCardText}>
                Plant-derived oils share molecular structures with your skin's own sebum.
                Marula oil is 70% oleic acid — the same fatty acid that makes up over
                a third of your skin's natural lipid barrier. Your skin does not perceive
                a foreign substance. It perceives a replenishment.
              </p>
            </div>
            <div className={styles.deepCard}>
              <h3 className={styles.deepCardName}>Phytonutrient density</h3>
              <p className={styles.deepCardText}>
                A rosehip grown in Chilean Patagonia contains trans-retinoic acid,
                vitamin C, tocopherols, and carotenoids — simultaneously. No single
                synthetic ingredient can replicate this density. The plant delivers
                a whole ecosystem of benefit in one press of serum.
              </p>
            </div>
            <div className={styles.deepCard}>
              <h3 className={styles.deepCardName}>The barrier principle</h3>
              <p className={styles.deepCardText}>
                Your skin barrier is your first immune system. Most conventional
                skincare — through sulphates, alcohols, and synthetic emulsifiers —
                quietly erodes it over years. Natural formulas feed it instead.
                The difference shows at 40. Or 50. Or whenever you start.
              </p>
            </div>
            <div className={styles.deepCard}>
              <h3 className={styles.deepCardName}>Bakuchiol vs retinol</h3>
              <p className={styles.deepCardText}>
                Clinical research showed bakuchiol performed equivalently to retinol
                in reducing fine lines and improving skin elasticity — with significantly
                less irritation, peeling, and photosensitivity. The plant version works.
                It just does not punish you while doing it.
              </p>
            </div>
          </div>
        </section>

        {/* PULL QUOTE */}
        <section className={styles.pullQuote}>
          <div className={styles.pullQuoteOrb} />
          <blockquote className={styles.pullQuoteText}>
            "Beautiful skin is not a beauty standard.<br />
            It is a health outcome —<br />
            <em>and health has always been botanical."</em>
          </blockquote>
        </section>

        {/* VOICES */}
        <section className={styles.voices}>
          <p className={styles.tag} style={{marginBottom:'56px'}}>Real skin, real results</p>
          <div className={styles.voicesGrid}>
            <div className={styles.voice}>
              <p className={styles.voiceQuote}>
                "I stopped wearing foundation after three weeks.
                Not because I forced myself — because I didn't feel like I needed it anymore."
              </p>
              <div className={styles.voiceMeta}>
                <span className={styles.voiceName}>Maja R.</span>
                <span className={styles.voiceAge}>34 · Göteborg</span>
              </div>
            </div>
            <div className={styles.voice}>
              <p className={styles.voiceQuote}>
                "My dermatologist asked what I changed. I told her: everything synthetic, out.
                Everything botanical, in. She said keep doing it."
              </p>
              <div className={styles.voiceMeta}>
                <span className={styles.voiceName}>Astrid K.</span>
                <span className={styles.voiceAge}>41 · Stockholm</span>
              </div>
            </div>
            <div className={styles.voice}>
              <p className={styles.voiceQuote}>
                "The serum absorbs faster than water. I kept pressing more thinking
                I wasn't applying enough. I was. It just loves skin that much."
              </p>
              <div className={styles.voiceMeta}>
                <span className={styles.voiceName}>Linnea S.</span>
                <span className={styles.voiceAge}>28 · Malmö</span>
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className={styles.closing}>
          <div className={styles.closingContent}>
            <p className={styles.tag}>Begin your ritual</p>
            <h2 className={styles.closingTitle}>
              The skin you want<br />
              is the skin<br />
              <em>you already have.</em>
            </h2>
            <p className={styles.closingText}>
              Give it sixty seconds. Give it plants. Give it twenty-eight days.
            </p>
            <a href="/" className={styles.closingBtn}>Shop the collection</a>
          </div>
          <div className={styles.closingDeco}>
            <div className={styles.closingRing} />
            <div className={styles.closingRing2} />
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
