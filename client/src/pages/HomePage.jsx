import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import WelcomeSection from '../components/WelcomeSection.jsx'
import CollectionsSection from '../components/CollectionsSection.jsx'
import ValuesSection from '../components/ValuesSection.jsx'
import BestSellers from '../components/BestSellers.jsx'
import Footer from '../components/Footer.jsx'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WelcomeSection />
        <CollectionsSection />
        <ValuesSection />
        <BestSellers />
      </main>
      <Footer />
    </>
  )
}
