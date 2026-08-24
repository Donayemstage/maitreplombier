import React from 'react';
import { MessageSquare } from 'lucide-react';

interface FloatingWhatsappProps {
  whatsappNumber?: string;
}

export function FloatingWhatsapp({ whatsappNumber = '237678953071' }: FloatingWhatsappProps) {
  const prefilledMessage = "Bonjour Maître Plombier 🛠️, j'ai besoin d'une assistance ou d'un devis. Êtes-vous disponible ?";
  const cleanWhatsappNumber = whatsappNumber.replace(/\D/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Infobulle informative au survol */}
      <div className="mr-3 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg pointer-events-none hidden sm:block">
        <p className="font-bold text-emerald-400">Plombier disponible 24/7</p>
        <p className="text-[10px] text-slate-300">Cliquez pour discuter sur WhatsApp</p>
      </div>

      {/* Bouton principal WhatsApp */}
      <a
        href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(prefilledMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter le plombier 24/7 sur WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        {/* Badge 24/7 sur l'icône */}
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm tracking-tighter uppercase">
          24/7
        </span>

        {/* Icône de message Shadcn / Lucide */}
        <MessageSquare className="w-7 h-7 fill-white stroke-emerald-500 group-hover:rotate-12 transition-transform duration-200" />
      </a>
    </div>
  );
}

export default FloatingWhatsapp;