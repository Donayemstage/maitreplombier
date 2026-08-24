import { Clock, ShieldCheck, Tag } from "lucide-react"
import { features } from "@/constants/features"

export function FeaturesSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            let icon;
            switch (feature.id) {
              case "intervention-24-7":
                icon = <Clock className="h-6 w-6 text-blue-600" />;
                break;
              case "artisans-certifies":
                icon = <ShieldCheck className="h-6 w-6 text-blue-600" />;
                break;
              case "tarifs-transparents":
                icon = <Tag className="h-6 w-6 text-blue-600" />;
                break;
              default:
                icon = <Clock className="h-6 w-6 text-blue-600" />;
            }

            return (
              <div
                key={feature.id}
                className="p-6 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-3"
              >
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  {icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}