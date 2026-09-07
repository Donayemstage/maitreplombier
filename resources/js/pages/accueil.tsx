import React from "react"
import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/AppLayout"
import { HeroSection } from "@/components/HeroSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { ExpertiseSection, ServiceItem } from "@/components/ExpertiseSection"
import { Testimonials, TestimonialItem } from "@/components/Testimonials"
import EmergencyBanner from "@/components/EmergencyBanner"

interface AccueilProps {
  featuredServices?: ServiceItem[];
  testimonialsList?: TestimonialItem[];
}

export default function Accueil({ featuredServices, testimonialsList }: AccueilProps) {
  return (
    <>
      {/* Titre de l'onglet */}
      <Head title="Accueil - Maître Plombier" />

      {/* Contenu principal */}
      <HeroSection />
      <FeaturesSection />
      <ExpertiseSection services={featuredServices} />
      <Testimonials testimonialsList={testimonialsList} />
      <EmergencyBanner />
    </>
  )
}

// Layout Persistant Inertia
Accueil.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>
