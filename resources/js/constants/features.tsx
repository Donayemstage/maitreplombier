import { Clock, ShieldCheck, Tag } from "lucide-react";
export const features = [
  {
    id: "intervention-24-7",
    title: "Intervention 24/7",
    description: "Une urgence ? Nos équipes sont prêtes à intervenir 24/7 pour limiter les dégâts d'eau.",
  },
  {
    id: "artisans-certifies",
    title: "Artisans Certifiés",
    description: "Tous nos plombiers sont qualifiés et régulièrement formés aux normes de sécurité.",
  },
  {
    id: "tarifs-transparents",
    title: "Tarifs Transparents",
    description: "Pas de mauvaises surprises. Devis gratuit avant intervention, sans frais cachés.",
  }
];

export const featureIcons = {
  "intervention-24-7": <Clock className="h-6 w-6 text-blue-600" />,
  "artisans-certifies": <ShieldCheck className="h-6 w-6 text-blue-600" />,
  "tarifs-transparents": <Tag className="h-6 w-6 text-blue-600" />
};