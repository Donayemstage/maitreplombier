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
      <div className="min-h-screen w-full flex flex-col bg-white relative">
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

        {/* 1. Navbar (fixed/sticky géré directement dans le composant Navbar) */}
        <Navbar />

        {/* 2. Contenu principal avec décalage pour la navbar fixe */}
        <main className="flex-1 pt-16 md:pt-20">
          {children}
        </main>

        {/* 3. Footer */}
        <NavFooter />

        {/* 4. Bouton WhatsApp flottant */}
        <FloatingWhatsapp whatsappNumber="237678953071" />
      </div>
    </SidebarProvider>
  );
}