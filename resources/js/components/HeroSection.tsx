import { buttonVariants } from "@/components/ui/button"

interface HeroSectionProps {
  backgroundImage?: string;
  badgeText?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export function HeroSection({
  backgroundImage = "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1600&auto=format&fit=crop",
  title = "Expertise et Réactivité",
  titleHighlight = "pour votre Plomberie",
  description = "Intervention rapide 24/7 pour tous vos besoins en plomberie et chauffage. Une équipe de professionnels qualifiés à votre service.",
  primaryButtonText = "Demander un devis gratuitement",
  primaryButtonHref = "/contact",
  secondaryButtonText = "Nos Services",
  secondaryButtonHref = "/services",
}: HeroSectionProps) {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-20 md:py-32 text-white"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.35)), url('${backgroundImage}')`
      }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex flex-col items-start gap-4">
          
          {/* Titre */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-md">
            {title} <br />
            <span className="text-blue-400">{titleHighlight}</span>
          </h1>

          {/* Description */}
          <p className="text-slate-100 text-base md:text-lg drop-shadow">
            {description}
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-4 pt-4">
            {/* Bouton Principal : Orange Vif */}
            <a
              href={primaryButtonHref}
              className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-11 px-8 py-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-colors"
            >
              {primaryButtonText}
            </a>

            {/* Bouton Secondaire : Vert ou contour clair */}
            <a
              href={secondaryButtonHref}
              className="inline-flex items-center justify-center rounded-md text-sm font-semibold h-11 px-8 py-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-colors"
            >
              {secondaryButtonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}