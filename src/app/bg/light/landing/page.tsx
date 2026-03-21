import {
  Nunito,
  Libre_Baskerville,
  Aleo,
  Fraunces,
  Playfair_Display,
  Cormorant_Garamond,
  Lora,
  DM_Serif_Display,
  Josefin_Slab,
  Bitter,
  Raleway,
  Sora,
  Outfit,
  Bodoni_Moda,
  Cormorant,
  Italiana,
  Spectral,
  Zilla_Slab,
  Crete_Round,
  Rokkitt,
  Rubik,
  Arvo,
  Eczar,
} from 'next/font/google'

const nunito = Nunito({ subsets: ['latin'] })
const libreBaskerville = Libre_Baskerville({ subsets: ['latin'] })
const aleo = Aleo({ subsets: ['latin'] })
const fraunces = Fraunces({ subsets: ['latin'] })
const playfairDisplay = Playfair_Display({ subsets: ['latin'] })
const cormorantGaramond = Cormorant_Garamond({ subsets: ['latin'], weight: '600' })
const lora = Lora({ subsets: ['latin'] })
const dmSerifDisplay = DM_Serif_Display({ subsets: ['latin'], weight: '400' })
const josefinSlab = Josefin_Slab({ subsets: ['latin'] })
const bitter = Bitter({ subsets: ['latin'] })
const raleway = Raleway({ subsets: ['latin'] })
const sora = Sora({ subsets: ['latin'] })
const outfit = Outfit({ subsets: ['latin'] })
const bodoniModa = Bodoni_Moda({ subsets: ['latin'] })
const cormorant = Cormorant({ subsets: ['latin'] })
const italiana = Italiana({ subsets: ['latin'], weight: '400' })
const spectral = Spectral({ subsets: ['latin'], weight: '600' })
const zillaSlab = Zilla_Slab({ subsets: ['latin'], weight: '600' })
const creteRound = Crete_Round({ subsets: ['latin'], weight: '400' })
const rokkitt = Rokkitt({ subsets: ['latin'] })
const rubik = Rubik({ subsets: ['latin'] })
const arvo = Arvo({ subsets: ['latin'], weight: '700' })
const eczar = Eczar({ subsets: ['latin'] })

export default function LandingPage() {
  return (
    <div className="m-20 flex flex-col gap-10 text-5xl font-semibold text-black">
      <h1 className={nunito.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={libreBaskerville.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={aleo.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={fraunces.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={playfairDisplay.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={cormorantGaramond.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={lora.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={dmSerifDisplay.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={josefinSlab.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={bitter.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={raleway.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={sora.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={outfit.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={bodoniModa.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={cormorant.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={italiana.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={spectral.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={zillaSlab.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={creteRound.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={rokkitt.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={rubik.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={arvo.className}>Your cookbook for the modern kitchen</h1>
      <h1 className={eczar.className}>Your cookbook for the modern kitchen</h1>
    </div>
  )
}
