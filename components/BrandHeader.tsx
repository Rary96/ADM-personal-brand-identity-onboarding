import Image from "next/image";

/**
 * Logo ADM in alto a sinistra, persistente per tutta la compilazione
 * (intro, domande, consenso, outro).
 *
 * Sta volutamente sotto la ProgressBar (`fixed top-0`, alta 1.5) e resta
 * piccolo e desaturato: durante il form l'utente valuta stili e colori, e un
 * logo troppo presente influenzerebbe le risposte estetiche — stesso
 * principio per cui la palette del form è quasi tutta neutra.
 *
 * ATTENZIONE: `public/logo-adm.svg` è un SEGNAPOSTO generato per non lasciare
 * un 404. Va sostituito con il logo reale prima del deploy.
 */
export function BrandHeader() {
  return (
    <div className="fixed left-0 top-0 z-10 flex items-center px-5 pt-5 sm:px-6 sm:pt-6">
      <Image
        src="/logo-adm.svg"
        alt="ADM Design &amp; Digital"
        width={96}
        height={24}
        priority
        className="h-5 w-auto opacity-60 transition-opacity hover:opacity-100 sm:h-6"
      />
    </div>
  );
}
