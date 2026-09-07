import Image from "next/image";

/**
 * Logo ADM in alto a sinistra, persistente per tutta la compilazione
 * (intro, domande, consenso, outro).
 *
 * Usa la **versione breve (monogramma)** del logo, non quella estesa: è
 * esattamente il caso d'uso per cui esiste il sistema di responsiveness del
 * marchio. A 24px di altezza il logotipo esteso "arianna dal monte" sarebbe
 * largo ~43px e del tutto illeggibile; il monogramma no. La versione estesa
 * è usata nelle email, dove c'è spazio in larghezza.
 *
 * Sta volutamente sotto la ProgressBar (`fixed top-0`, alta 1.5) e resta
 * piccolo e leggermente desaturato: durante il form l'utente valuta stili e
 * colori, e un logo troppo presente influenzerebbe le risposte estetiche —
 * stesso principio per cui la palette del form è quasi tutta neutra.
 */
export function BrandHeader() {
  return (
    <div className="fixed left-0 top-0 z-10 flex items-center px-5 pt-5 sm:px-6 sm:pt-6">
      <Image
        src="/logo-adm.png"
        alt="ADM — Arianna Dal Monte, Design &amp; Digital"
        width={480}
        height={221}
        priority
        className="h-5 w-auto opacity-70 transition-opacity hover:opacity-100 sm:h-6"
      />
    </div>
  );
}
