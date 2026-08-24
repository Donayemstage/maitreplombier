import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/components/Navbar";
import { NavFooter } from "@/components/nav-footer";
import { FloatingWhatsapp } from "@/components/FloatingWhatsapp";
import { Toaster } from 'sonner';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-white relative">

        <Toaster 
          position="top-right"
          richColors
          closeButton
          expand={false}
          duration={4000}
          toastOptions={{
            style: {
              borderRadius: '10px',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
        {/* Navbar collée en haut */}
        <header className="border-b sticky top-0 bg-white z-40">
          <Navbar />
        </header>

        {/* Contenu principal */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer complet */}
        <NavFooter />

        {/* Bouton WhatsApp flottant fixe en bas à droite */}
        <FloatingWhatsapp whatsappNumber="237678953071" />
      </div>
    </SidebarProvider>
  );
}