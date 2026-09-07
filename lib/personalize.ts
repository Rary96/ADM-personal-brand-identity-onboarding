/**
 * Interpolazione del token `{{nome}}` nei testi di content/questionnaire.ts
 * (section intro, midFormReminder, outroCopy) col nome di chi compila,
 * inserito in Sezione 1 — sempre disponibile da lì in poi, essendo
 * `nomeCognome` un campo obbligatorio validato prima di poter avanzare.
 *
 * A differenza del progetto gemello (dove il token era `{{azienda}}` e si
 * interpolava la ragione sociale per intero), qui si usa il SOLO nome di
 * battesimo: `nomeCognome` contiene "Mario Rossi", ma "Sei a metà, Mario
 * Rossi" suona come una raccomandata. Vedi `primoNome()`.
 */

/**
 * Estrae il nome di battesimo da una stringa "Nome Cognome".
 * Fallback sull'intera stringa ripulita se non c'è uno spazio.
 */
export function primoNome(nomeCognome: string): string {
  return nomeCognome.trim().split(/\s+/)[0] ?? "";
}

export function personalize(template: string, nomeCognome: string): string {
  return template.replace(/\{\{nome\}\}/g, primoNome(nomeCognome));
}
