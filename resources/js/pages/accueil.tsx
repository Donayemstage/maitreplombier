import { Head } from "@inertiajs/react"
import React from "react"
import EmergencyBanner from "@/components/EmergencyBanner"
import type { ServiceItem } from "@/components/ExpertiseSection";
import { ExpertiseSection } from "@/components/ExpertiseSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { HeroSection } from "@/components/HeroSection"
import type { TestimonialItem } from "@/components/Testimonials";
import { Testimonials } from "@/components/Testimonials"
import AppLayout from "@/layouts/AppLayout"

interface AccueilProps {
  featuredServices?: ServiceItem[];
  testimonialsList?: TestimonialItem[];
}

export default function Accueil({ featuredServices, testimonialsList }: AccueilProps) {
  return (
    <>
      {/* Titre de l'onglet */}
      <Head title="Accueil - Donayem Plomberie" />

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
