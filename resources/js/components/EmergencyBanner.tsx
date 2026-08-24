import React, { useState } from 'react';
import { PhoneCall, Asterisk, Copy, Check, MessageSquare, X, ShieldCheck } from 'lucide-react';

interface EmergencyBannerProps {
  phoneNumber?: string;
  whatsappNumber?: string;
  responseTime?: string;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  phoneNumber = '+237 678 95 30 71',
  whatsappNumber = '237678953071',
  responseTime = '30 min',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Message pré-rempli engageant et professionnel prêt à être envoyé par le client
  const prefilledMessage = "Bonjour Maître Plombier 🛠️, j'ai une urgence de plomberie à mon domicile. Merci de me prendre en charge rapidement !";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section className="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/50 text-white mb-2">
            <Asterisk className="w-6 h-6 animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Un problème urgent ? <br className="hidden sm:inline" />
            Nous intervenons en moins de {responseTime}.
          </h2>

          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Nos équipes sont prêtes à se déplacer immédiatement pour sécuriser votre domicile et résoudre votre problème de plomberie.
          </p>

          <div className="pt-4">
            <a
              href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
              onClick={handleClick}
              className="inline-flex items-center justify-center gap-3 bg-white text-blue-900 font-bold py-3.5 px-8 rounded-full shadow-lg hover:bg-blue-50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-base group"
            >
              <PhoneCall className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span>Appeler le {phoneNumber}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Modal sur-mesure pour Desktop */}
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
                <PhoneCall className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Contactez notre service d'urgence</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Composez ce numéro sur votre téléphone ou discutez directement via WhatsApp.
                </p>
              </div>

              {/* Bloc Téléphone */}
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

              {/* Bouton d'action WhatsApp universel */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefilledMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contacter via WhatsApp</span>
                </a>
              </div>

              {/* Message de réassurance & guidance pour le client */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2 text-left mt-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-800 leading-tight">
                  <strong>Service Officiel Maître Plombier :</strong> Vous allez être redirigé vers l'application ou la version web de WhatsApp. Votre message d'urgence est déjà préparé !
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyBanner;