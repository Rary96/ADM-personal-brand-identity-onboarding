import { google } from "googleapis";
import type { Questionario } from "@/lib/schema";
import { getOptionLabel, getOptionLabels } from "@/lib/questionnaire-labels";
import type { ParsedAttachment } from "@/lib/attachment-limits";

export interface SubmissionMeta {
  submissionId: string;
  submittedAt: string;
}

const join = (arr?: string[]) => (arr ?? []).join(", ");

/** Aggiunge alla nota di un campo upload l'elenco degli eventuali allegati email. */
function noteWithAttachments(
  note: string | undefined,
  fieldId: string,
  attachments: ParsedAttachment[]
): string {
  const fieldAttachments = attachments.filter((a) => a.fieldId === fieldId);
  const base = note ?? "";
  if (fieldAttachments.length === 0) return base;
  const list = `(+ ${fieldAttachments.length} allegati email: ${fieldAttachments
    .map((a) => a.filename)
    .join(", ")})`;
  return base ? `${base} ${list}` : list;
}

function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL o GOOGLE_PRIVATE_KEY mancanti");
  }
  const auth = new google.auth.JWT({
    email,
    key: rawKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

/**
 * Una colonna per ogni sotto-campo degli oggetti annidati, array serializzati
 * con "join(', ')", enum tradotti in label italiane (stessa fonte della UI).
 * L'ultima colonna è il payload JSON completo, rete di sicurezza per campi
 * non ancora "colonnati". Ordine e header vanno tenuti allineati alla prima
 * riga del tab "Risposte" nello Sheet.
 */
function buildRow(
  data: Questionario,
  meta: SubmissionMeta,
  attachments: ParsedAttachment[]
): (string | number)[] {
  return [
    meta.submittedAt,
    meta.submissionId,
    // Sezione 1 — Chi sei
    data.nomeCognome,
    data.nomeBrand ?? "",
    data.email,
    data.professione,
    data.profiliOnline ?? "",
    // Sezione 2 — Obiettivi e punto di partenza
    join(getOptionLabels("obiettivoPersonalBrand", data.obiettivoPersonalBrand.selezionati)),
    data.obiettivoPersonalBrand.altro ?? "",
    data.perchePropioOra ?? "",
    data.presenzaAttuale ?? "",
    // Sezione 3 — Storia e valori
    data.percorso,
    data.momentoSvolta ?? "",
    join(data.valori.selezionati),
    data.valori.altro ?? "",
    // Sezione 4 — Expertise e posizionamento
    data.riferimentoSu,
    data.credenziali ?? "",
    data.opinioneControcorrente ?? "",
    // Sezione 5 — Pubblico
    data.pubblicoTarget,
    data.seguePaga ?? "",
    data.cosaDicanoDiTe ?? "",
    // Sezione 6 — Riferimenti
    data.personeAmmirate ?? "",
    data.nonVoglioSomigliare ?? "",
    data.mappaPosizionamento?.istituzionalePersonale ?? "",
    data.mappaPosizionamento?.tecnicoDivulgativo ?? "",
    // Sezione 7 — Personalità, voce e visibilità
    data.aggettivi ?? "",
    getOptionLabel("archetipo", data.archetipo),
    data.archetipoMotivazione ?? "",
    data.toneEParole?.formaleInformale ?? "",
    data.toneEParole?.tecnicoSemplice ?? "",
    data.toneEParole?.serioIronico ?? "",
    data.toneEParole?.paroleSempre ?? "",
    data.toneEParole?.paroleMai ?? "",
    getOptionLabel("livelloEsposizione", data.livelloEsposizione),
    data.confini ?? "",
    join(getOptionLabels("comfortVoltoVideo", data.comfortVoltoVideo)),
    // Sezione 8 — Stile visivo e materiale
    join(data.riferimentiVisivi.urls),
    noteWithAttachments(data.riferimentiVisivi.note, "riferimentiVisivi", attachments),
    join(data.stiliDaEvitare?.urls),
    noteWithAttachments(data.stiliDaEvitare?.note, "stiliDaEvitare", attachments),
    getOptionLabel("tipologiaMarchio", data.tipologiaMarchio),
    join(data.colori?.preferiti),
    join(data.colori?.daEvitare),
    data.colori?.note ?? "",
    join(data.materialeFotografico?.urls),
    noteWithAttachments(data.materialeFotografico?.note, "materialeFotografico", attachments),
    data.vincoliDeontologici ?? "",
    data.aspettativeCall ?? "",
    data.domandaJolly ?? "",
    data.consensoPrivacy ? "Sì" : "No",
    JSON.stringify(data),
  ];
}

/**
 * Intestazioni delle colonne, nello stesso ordine di `buildRow`. Vanno
 * incollate nella prima riga del tab "Risposte" dello Sheet: `appendSubmissionRow`
 * fa un append cieco e non le scrive da sé. Tenere le due liste allineate.
 */
export const SHEET_HEADERS = [
  "Data invio",
  "ID submission",
  "Nome e cognome",
  "Nome del brand",
  "Email",
  "Professione",
  "Profili online",
  "Obiettivi",
  "Obiettivi — altro",
  "Perché adesso",
  "Presenza attuale",
  "Percorso",
  "Momento di svolta",
  "Valori",
  "Valori — altro",
  "Riferimento su",
  "Credenziali",
  "Opinione controcorrente",
  "Pubblico target",
  "Chi segue vs chi paga",
  "Cosa dicano di te",
  "Persone ammirate",
  "Non voglio somigliare a",
  "Mappa: Istituzionale↔Personale",
  "Mappa: Tecnico↔Divulgativo",
  "Aggettivi",
  "Archetipo",
  "Archetipo — perché",
  "Tono: Formale↔Informale",
  "Tono: Tecnico↔Semplice",
  "Tono: Serio↔Ironico",
  "Parole sì",
  "Parole no",
  "Livello di esposizione",
  "Confini",
  "Formati con cui è a suo agio",
  "Riferimenti visivi — link",
  "Riferimenti visivi — note",
  "Stili da evitare — link",
  "Stili da evitare — note",
  "Tipologia di marchio",
  "Colori preferiti",
  "Colori da evitare",
  "Colori — note",
  "Materiale fotografico — link",
  "Materiale fotografico — note",
  "Vincoli deontologici",
  "Aspettative sulla call",
  "Domanda jolly",
  "Consenso privacy",
  "Payload JSON",
] as const;

export async function appendSubmissionRow(
  data: Questionario,
  meta: SubmissionMeta,
  attachments: ParsedAttachment[] = []
) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) throw new Error("GOOGLE_SHEET_ID mancante");

  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Risposte!A1",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [buildRow(data, meta, attachments)] },
  });
}
