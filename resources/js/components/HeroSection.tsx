import React from "react"
import { ArrowRight, ShieldCheck } from "lucide-react"

interface HeroSectionProps {
  cityBackgroundImage?: string;
  plumberImage?: string;
  title?: string;
  titleHighlight?: string;
  slogan?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
}

export function HeroSection({
  cityBackgroundImage = "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600&auto=format&fit=crop",
  plumberImage = "/images/remove.png", 
  title = "Le meilleur plombier",
  titleHighlight = "est déjà en chemin !",
  slogan = "L’imprévu maîtrisé. La tranquillité retrouvée.",
  description = "On s'occupe du vôtre ?",
  primaryButtonText = "J'ai besoin d'être dépanné",
  primaryButtonHref = "/contact",
}: HeroSectionProps) {
  return (
    <>
      <style>{`
        @keyframes fadeInDownCustom {
          0% {
            opacity: 0;
            transform: translate3d(0, -20px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-fade-in-down {
          animation: fadeInDownCustom 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <section className="relative isolate z-0 min-h-[600px] md:min-h-[660px] w-full bg-[#030914] flex items-center overflow-hidden text-white">
        
        {/* Arrière-plan ville */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-[1px] brightness-110 contrast-110 scale-105 z-0"
          style={{ backgroundImage: `url('${cityBackgroundImage}')` }}
        />

        {/* Overlay dégradé sombre */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030914]/98 via-[#07132b]/85 to-transparent z-1" />

        {/* Personnage PNG détouré */}
        <div className="absolute right-0 bottom-0 top-0 w-full md:w-1/2 z-2 flex items-end justify-center md:justify-end pointer-events-none">
          <img 
            src={plumberImage} 
            alt="Plombier en intervention" 
            className="h-[85%] md:h-[95%] object-contain object-bottom pr-0 md:pr-12 filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Découpe diagonale blanche */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 bg-white z-3 pointer-events-none"
          style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 40%, 0 100%)" }}
        />

        {/* Contenu principal */}
        <div className="container relative z-4 mx-auto px-6 md:px-16 max-w-7xl pt-10 pb-20">
          <div className="flex flex-col items-start text-left max-w-xl">
            
            <div className="animate-fade-in-down flex flex-col gap-4">
              
              {/* 1. PROMESSE : Titre H1 */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
                {title} <br />
                <span className="text-white">{titleHighlight}</span>
              </h1>

              {/* 2. ÉMOTION : Slogan discret */}
              <p className="text-slate-300 text-base sm:text-lg font-normal tracking-wide italic">
                {slogan}
              </p>

              {/* 3. ARGUMENTS : Les 3 engaments concrets */}
              <div className="pt-2">
                <p className="text-white text-base sm:text-lg font-semibold tracking-wide">
                  Intervention rapide <span className="text-amber-400 mx-1.5">•</span> Travail soigné <span className="text-amber-400 mx-1.5">•</span> Prix transparents
                </p>
                
                {/* 4. INCITATION : Légèrement distancée et plus douce */}
                <p className="text-slate-400 text-sm sm:text-base font-normal mt-2 tracking-wide">
                  {description}
                </p>
              </div>

            </div>

            {/* 5. ACTION : Bouton CTA Jaune */}
            <div className="pt-8">
              <a
                href={primaryButtonHref}
                className="inline-flex items-center gap-3 rounded-full text-base font-bold px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-slate-950 shadow-xl hover:scale-105 transition-all duration-300"
              >
                <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                <span>{primaryButtonText}</span>
              </a>
            </div>

            {/* 6. ENGAGEMENT QUALITÉ : Remplacement des étoiles fictives */}
            <div className="flex items-center gap-2 pt-6 text-sm text-slate-300 font-medium">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span className="text-xs sm:text-sm text-slate-300 font-semibold tracking-wide">
                La qualité au cœur de chaque intervention
              </span>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}