import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import AppLogo from '@/components/app-logo';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, Phone, Lock, Home, Wrench, Info, Mail, Copy, Check, MessageSquare, X, ShieldCheck, Sparkles } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import { cn } from "@/lib/utils"

interface NavbarProps {
  phoneNumber?: string
  whatsappNumber?: string
}

export function Navbar({
  phoneNumber = "+237 678 95 30 71",
  whatsappNumber = "237678953071",
}: NavbarProps) {
  const page = usePage()
  const currentUrl = page.url

  // États pour la Modal Desktop d'appel
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const prefilledMessage = "Bonjour Maître Plombier, j'ai une demande de devis ou d'urgence. Merci de me contacter !"

  const rawPhoneNumber = phoneNumber.replace(/\s+/g, "")

  const handleCallClick = (e: React.MouseEvent) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (!isMobile) {
      e.preventDefault()
      setIsModalOpen(true)
    } else {
      window.location.href = "tel:" + rawPhoneNumber
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(phoneNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      {/* Navigation Desktop */}
      <nav className="hidden md:flex md:items-center md:justify-between md:px-6 py-3 bg-white antialiased">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex flex-col leading-tight">
            <AppLogo />
          </Link>
        </div>

        {/* Liens de navigation */}
        <div className="hidden md:flex md:items-center md:space-x-1">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-1.5 text-[13.5px] font-semibold tracking-tight transition-colors px-3 py-2 rounded-md antialiased",
              currentUrl === "/" ? "text-blue-600 bg-slate-100" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
            )}
          >
            <Home className="h-4 w-4 text-blue-600" />
            Accueil
          </Link>

          <Link
            href="/services"
            className={cn(
              "flex items-center gap-1.5 text-[13.5px] font-semibold tracking-tight transition-colors px-3 py-2 rounded-md antialiased",
              currentUrl === "/services" ? "text-blue-600 bg-slate-100" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
            )}
          >
            <Wrench className="h-4 w-4 text-blue-600" />
            Nos Services
          </Link>

          <Link
            href="/projets"
            className={cn(
              "flex items-center gap-1.5 text-[13.5px] font-semibold tracking-tight transition-colors px-3 py-2 rounded-md antialiased",
              currentUrl === "/projets" || currentUrl === "/galerie" ? "text-blue-600 bg-slate-100" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
            )}
          >
            <Sparkles className="h-4 w-4 text-blue-600" />
            Réalisations
          </Link>

          <Link
            href="/a-propos"
            className={cn(
              "flex items-center gap-1.5 text-[13.5px] font-semibold tracking-tight transition-colors px-3 py-2 rounded-md antialiased",
              currentUrl === "/a-propos" ? "text-blue-600 bg-slate-100" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
            )}
          >
            <Info className="h-4 w-4 text-blue-600" />
            À propos
          </Link>

          <Link
            href="/contact"
            className={cn(
              "flex items-center gap-1.5 text-[13.5px] font-semibold tracking-tight transition-colors px-3 py-2 rounded-md antialiased",
              currentUrl === "/contact" ? "text-blue-600 bg-slate-100" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
            )}
          >
            <Mail className="h-4 w-4 text-blue-600" />
            Contact
          </Link>
        </div>

        {/* Bouton d'action */}
        <div className="hidden md:flex md:items-center pl-4 border-l border-slate-200">
          <Button
            onClick={handleCallClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider gap-2 px-4 py-2 shadow-sm antialiased"
          >
            <Phone className="h-4 w-4" />
            Appeler maintenant
          </Button>
        </div>
      </nav>

      {/* Navigation Mobile */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white">
        <Link href="/" className="flex flex-col leading-tight">
          <AppLogo />
        </Link>

        <Sheet>
          <SheetTrigger className="inline-flex items-center justify-center p-2 rounded-md border border-slate-200 bg-white hover:bg-slate-100 focus:outline-none">
            <Menu className="h-6 w-6 text-slate-800" />
          </SheetTrigger>

          <SheetContent side="right" className="flex flex-col justify-between">
            <div>
              <SheetHeader className="text-left border-b pb-4">
                <SheetTitle className="flex flex-col leading-tight">
                  <AppLogo />
                </SheetTitle>
                <SheetDescription>
                  Services de plomberie & dépannage 24/7
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-4 my-6">
                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-3 text-base font-semibold transition-colors p-2 rounded-md",
                    currentUrl === "/" ? "text-blue-600 bg-slate-100" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
                  )}
                >
                  <Home className="h-5 w-5 text-blue-600" />
                  Accueil
                </Link>

                <Link
                  href="/services"
                  className={cn(
                    "flex items-center gap-3 text-base font-semibold transition-colors p-2 rounded-md",
                    currentUrl === "/services" ? "text-blue-600 bg-slate-100" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
                  )}
                >
                  <Wrench className="h-5 w-5 text-blue-600" />
                  Nos Services
                </Link>

                <Link
                  href="/projets"
                  className={cn(
                    "flex items-center gap-3 text-base font-semibold transition-colors p-2 rounded-md",
                    currentUrl === "/projets" || currentUrl === "/galerie" ? "text-blue-600 bg-slate-100" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
                  )}
                >
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Réalisations (Avant / Après)
                </Link>

                <Link
                  href="/a-propos"
                  className={cn(
                    "flex items-center gap-3 text-base font-semibold transition-colors p-2 rounded-md",
                    currentUrl === "/a-propos" ? "text-blue-600 bg-slate-100" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
                  )}
                >
                  <Info className="h-5 w-5 text-blue-600" />
                  À propos
                </Link>

                <Link
                  href="/contact"
                  className={cn(
                    "flex items-center gap-3 text-base font-semibold transition-colors p-2 rounded-md",
                    currentUrl === "/contact" ? "text-blue-600 bg-slate-100" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
                  )}
                >
                  <Mail className="h-5 w-5 text-blue-600" />
                  Contact
                </Link>
              </nav>
            </div>

            <SheetFooter className="flex-col gap-3 sm:flex-col border-t pt-4">
              <Button
                onClick={handleCallClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2"
              >
                <Phone className="h-4 w-4" />
                Appeler maintenant
              </Button>

              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-500 hover:text-blue-600"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Espace Administration</span>
              </Link>

              <SheetClose className="w-full mt-2 inline-flex items-center justify-center py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                Fermer
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Modal Contact Desktop */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4 pt-2">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Contactez Maître Plombier</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Composez ce numéro directement ou lancez une discussion WhatsApp pour un devis gratuit.
                </p>
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 mt-4">
                <span className="font-mono text-lg font-bold text-blue-900">{phoneNumber}</span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs bg-white text-slate-700 px-3 py-1.5 rounded-lg border shadow-sm hover:bg-slate-50 transition-colors font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600">Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefilledMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Demander un devis via WhatsApp</span>
                </a>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2 text-left mt-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-800 leading-tight">
                  <strong>Service Officiel Maître Plombier :</strong> Réponse rapide pour vos demandes d'intervention et de devis.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}