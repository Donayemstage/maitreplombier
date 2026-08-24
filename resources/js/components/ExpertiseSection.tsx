import { Card, CardContent } from "@/components/ui/card"

export function ExpertiseSection() {
  const services = [
    {
      title: "Dépannage d'urgence",
      description: "Détection et réparation immédiate de fuites d'eau ou canalisations bouchées.",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=500&auto=format&fit=crop"
    },
    {
      title: "Entretien chauffe-eau",
      description: "Détartrage, remplacement et installation de chauffe-eau et chaudières.",
      image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=500&auto=format&fit=crop"
    },
    {
      title: "Installation Sanitaire",
      description: "Création et rénovation complète de salles de bain et cuisines.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=500&auto=format&fit=crop"
    }
  ]

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        
        {/* En-tête de section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
            Nos Domaines d'Expertise
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Des solutions complètes pour répondre à toutes vos exigences en matière de plomberie et de chauffage.
          </p>
        </div>

        {/* Grille de Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-blue-950 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}