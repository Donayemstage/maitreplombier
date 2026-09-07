import { Card, CardContent } from "@/components/ui/card"
import { Link } from "@inertiajs/react"
import { ArrowRight, Wrench, Droplets, Flame, ShowerHead, Bath, ShieldCheck } from "lucide-react"

export interface ServiceItem {
  id: number;
  nom_service: string;
  description_service: string;
  icone_service?: string;
  prix_service?: string | number;
  image_service: string;
}

interface ExpertiseSectionProps {
  services?: ServiceItem[];
}

const DEFAULT_SERVICES = [
  {
    id: 1,
    title: "Dépannage d'urgence & Fuites",
    description: "Détection et réparation immédiate de fuites d'eau visibles ou encastrées sans dégât inutile.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=500&auto=format&fit=crop",
    price: "15 000"
  },
  {
    id: 2,
    title: "Entretien chauffe-eau & Chaudière",
    description: "Détartrage, remplacement et installation sécurisée de chauffe-eau électriques et solaires.",
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=500&auto=format&fit=crop",
    price: "25 000"
  },
  {
    id: 3,
    title: "Installation & Rénovation Sanitaire",
    description: "Création de salles de bain, pose de WC, éviers, robinetterie et tuyauteries de qualité.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=500&auto=format&fit=crop",
    price: "35 000"
  }
];

export function ExpertiseSection({ services }: ExpertiseSectionProps) {
  const hasDynamic = services && services.length > 0;

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* En-tête de section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <span className="text-blue-600 font-bold uppercase tracking-wider text-xs">Savoir-faire artisanal</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1">
              Nos Domaines d'Expertise
            </h2>
            <p className="text-slate-600 text-sm md:text-base mt-2">
              Des solutions complètes pour répondre à toutes vos exigences en matière de plomberie et de chauffage.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:gap-3 transition-all"
          >
            <span>Voir tous nos services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grille de Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hasDynamic ? (
            services.slice(0, 3).map((service) => (
              <Card key={service.id} className="overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition duration-300 rounded-3xl flex flex-col justify-between bg-white group">
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={
                        service.image_service.startsWith('http')
                          ? service.image_service
                          : `/storage/services/${service.image_service}`
                      } 
                      alt={service.nom_service} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=500";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {service.prix_service && (
                      <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md backdrop-blur-sm">
                        À partir de {Number(service.prix_service).toLocaleString('fr-FR')} FCFA
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                      {service.nom_service}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {service.description_service}
                    </p>
                  </CardContent>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>En savoir plus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            DEFAULT_SERVICES.map((service) => (
              <Card key={service.id} className="overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition duration-300 rounded-3xl flex flex-col justify-between bg-white group">
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md backdrop-blur-sm">
                      À partir de {service.price} FCFA
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </CardContent>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>En savoir plus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>

      </div>
    </section>
  )
}