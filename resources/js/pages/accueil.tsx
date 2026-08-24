import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/AppLayout"
import { HeroSection } from "@/components/HeroSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { ExpertiseSection } from "@/components/ExpertiseSection"
import Testimonials from "@/components/Testimonials"
import EmergencyBanner from "@/components/EmergencyBanner"

export default function Accueil() {
  return (
    <>
      {/* Titre de l'onglet */}
      <Head title="Accueil - Maître Plombier" />

      {/* Contenu principal uniquement */}
      <HeroSection />
      <FeaturesSection />
      <ExpertiseSection />
      <Testimonials />
      <EmergencyBanner />
    </>
  )
}

// Layout Persistant Inertia (Ne se recharche pas lors de la navigation)
Accueil.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>
