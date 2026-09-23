import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/Navbar";
import { NavFooter } from "@/components/nav-footer";
//import { FloatingWhatsapp } from "@/components/FloatingWhatsapp";
import { FaWhatsapp } from 'react-icons/fa';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col bg-white relative">
        {/* 1. Navbar (fixed/sticky géré directement dans le composant Navbar) */}
        <Navbar />

        {/* 2. Contenu principal avec décalage pour la navbar fixe */}
        <main className="flex-1 pt-16 md:pt-20">
          {children}
        </main>

        {/* 3. Footer */}
        <NavFooter />

        {/* 4. Bouton WhatsApp flottant */}
        <div className="animate__animated animate__pulse animate__infinite fixed bottom-6 right-6 z-50">
          <a
            href="https://wa.me/237679473691"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full text-white shadow-2xl hover:scale-110 transition-transform duration-300"
            aria-label="Discuter sur WhatsApp"
          >
            <FaWhatsapp size={32} />
          </a>
        </div>
      </div>
    </SidebarProvider>
  );
}