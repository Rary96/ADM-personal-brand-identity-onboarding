/**
 * URL pubblico assoluto del sito.
 *
 * Serve **solo alle email**: un client di posta non può risolvere un percorso
 * relativo come `/logo-adm-esteso.png`, quindi il logo nell'header dei
 * template dev'essere un URL assoluto e raggiungibile pubblicamente.
 * Nella UI del form continua a valere il percorso relativo (vedi BrandHeader).
 *
 * Ordine di risoluzione:
 * 1. `NEXT_PUBLIC_SITE_URL`, se impostata — è il dominio di produzione, e
 *    l'unico valore giusto per le email inviate dalla produzione.
 * 2. `VERCEL_URL`, l'URL della singola deployment: utile in preview, ma
 *    cambia ad ogni deploy, quindi non va usato come valore stabile.
 * 3. Il dominio di default del progetto, come rete di sicurezza perché
 *    un'email con il logo rotto è meglio di un crash.
 */
const FALLBACK_URL = "https://adm-personal-brand-identity-onboarding.vercel.app";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return FALLBACK_URL;
}

export const siteUrl = resolveSiteUrl();
