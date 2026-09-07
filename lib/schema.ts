import { z } from "zod";

/**
 * Schema del questionario di onboarding Personal Brand Identity.
 *
 * Note architetturali:
 * - **Nessun branching.** A differenza del progetto gemello sul brand identity
 *   aziendale (che sdoppiava le domande su "nuovo brand / restyling"), qui il
 *   percorso è unico: le domande che dovrebbero distinguere i due casi sono
 *   formulate per funzionare in entrambi (vedi `presenzaAttuale`, che accetta
 *   esplicitamente "non ho ancora nulla" come risposta valida). Di conseguenza
 *   non c'è nessun `superRefine` condizionale a un campo-discriminante e
 *   `lib/questionnaire-steps.ts` non filtra nulla. Non reintrodurre un
 *   branching senza che l'utente lo chieda.
 * - Il form è compilato da un cliente GIÀ acquisito, prima della call di
 *   kickoff: niente campi budget / deliverable / decisore finale, che
 *   appartengono alla fase commerciale già chiusa.
 * - I campi di upload (`riferimentiVisivi`, `stiliDaEvitare`,
 *   `materialeFotografico`) accettano sia URL (link a Drive/Pinterest/
 *   WeTransfer) sia allegati diretti via email (vedi lib/attachment-limits.ts).
 * - Solo 9 campi sono `required` a livello di contenuto strategico:
 *   nomeCognome, email, professione, obiettivoPersonalBrand, percorso, valori,
 *   riferimentoSu, pubblicoTarget, riferimentiVisivi. Tutto il resto è
 *   facoltativo — le risposte mancanti si recuperano in call, che è proprio lo
 *   scopo di questo form.
 */

/** Tetto di obiettivi selezionabili — condiviso tra validazione e UI. */
export const MAX_OBIETTIVI = 3;

export const archetipoEnum = z.enum([
  "eroe",
  "saggio",
  "esploratore",
  "ribelle",
  "creatore",
  "sovrano",
  "mago",
  "innocente",
  "amante",
  "giullare",
  "uomo_comune",
  "custode",
]);

/**
 * Quanto la persona è disposta a esporsi. È la domanda che orienta più di
 * ogni altra il sistema visivo: chi sceglie `solo_lavoro` ha bisogno di
 * un'identità grafica autoportante, chi sceglie `anche_personale` di una
 * direzione fotografica. Scala ordinata (non un set di opzioni alla pari),
 * per questo è renderizzata con `OrderedScaleField`.
 */
export const livelloEsposizioneEnum = z.enum([
  "solo_lavoro",
  "dietro_le_quinte",
  "anche_personale",
]);

export const tipologiaMarchioEnum = z.enum([
  "monogramma",
  "firma",
  "logotipo",
  "simbolo_nome",
  "aperto_a_proposta",
]);

const uploadOrLink = z.object({
  urls: z.array(z.string().url()).default([]),
  note: z.string().optional(),
});

const selezioneConAltro = z.object({
  selezionati: z.array(z.string()).default([]),
  altro: z.string().optional(),
});

export const questionarioSchema = z
  .object({
    // Sezione 1 — Chi sei
    nomeCognome: z.string().min(2, "Campo obbligatorio"),
    nomeBrand: z.string().optional(),
    email: z.string().email("Email non valida"),
    professione: z.string().min(1, "Campo obbligatorio"),
    profiliOnline: z.string().optional(),

    // Sezione 2 — Obiettivi e punto di partenza
    obiettivoPersonalBrand: selezioneConAltro,
    perchePropioOra: z.string().optional(),
    presenzaAttuale: z.string().optional(),

    // Sezione 3 — Storia e valori
    percorso: z.string().min(1, "Campo obbligatorio"),
    momentoSvolta: z.string().optional(),
    valori: selezioneConAltro,

    // Sezione 4 — Expertise e posizionamento
    riferimentoSu: z.string().min(1, "Campo obbligatorio"),
    credenziali: z.string().optional(),
    opinioneControcorrente: z.string().optional(),

    // Sezione 5 — Pubblico
    pubblicoTarget: z.string().min(1, "Campo obbligatorio"),
    seguePaga: z.string().optional(),
    cosaDicanoDiTe: z.string().optional(),

    // Sezione 6 — Riferimenti
    personeAmmirate: z.string().optional(),
    nonVoglioSomigliare: z.string().optional(),
    mappaPosizionamento: z
      .object({
        istituzionalePersonale: z.number().min(0).max(100),
        tecnicoDivulgativo: z.number().min(0).max(100),
      })
      .optional(),

    // Sezione 7 — Personalità, voce e visibilità
    aggettivi: z.string().optional(),
    archetipo: archetipoEnum.optional(),
    archetipoMotivazione: z.string().optional(),
    toneEParole: z
      .object({
        formaleInformale: z.number().min(0).max(100).optional(),
        tecnicoSemplice: z.number().min(0).max(100).optional(),
        serioIronico: z.number().min(0).max(100).optional(),
        paroleSempre: z.string().optional(),
        paroleMai: z.string().optional(),
      })
      .optional(),
    livelloEsposizione: livelloEsposizioneEnum.optional(),
    confini: z.string().optional(),
    comfortVoltoVideo: z.array(z.string()).optional(),

    // Sezione 8 — Stile visivo e materiale
    riferimentiVisivi: uploadOrLink,
    stiliDaEvitare: uploadOrLink.optional(),
    tipologiaMarchio: tipologiaMarchioEnum.optional(),
    colori: z
      .object({
        preferiti: z.array(z.string()).default([]),
        daEvitare: z.array(z.string()).default([]),
        note: z.string().optional(),
      })
      .optional(),
    materialeFotografico: uploadOrLink.optional(),
    vincoliDeontologici: z.string().optional(),
    aspettativeCall: z.string().optional(),
    domandaJolly: z.string().optional(),

    // Consenso privacy (obbligatorio)
    consensoPrivacy: z.literal(true, {
      errorMap: () => ({
        message: "Devi accettare l'informativa privacy per continuare",
      }),
    }),
  })
  .superRefine((data, ctx) => {
    if (
      data.obiettivoPersonalBrand.selezionati.length === 0 &&
      !data.obiettivoPersonalBrand.altro
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["obiettivoPersonalBrand"],
        message: "Indica almeno un obiettivo",
      });
    }
    // Il tetto di 3 è una scelta di contenuto (costringere a dare una priorità),
    // non un vincolo tecnico: vive qui e in `MAX_OBIETTIVI` sotto, usato dalla UI.
    if (data.obiettivoPersonalBrand.selezionati.length > MAX_OBIETTIVI) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["obiettivoPersonalBrand"],
        message: `Scegline al massimo ${MAX_OBIETTIVI}`,
      });
    }
    if (data.valori.selezionati.length === 0 && !data.valori.altro) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["valori"],
        message: "Indica almeno un valore",
      });
    }
  });

export type Questionario = z.infer<typeof questionarioSchema>;

/** Campi realmente obbligatori a livello di contenuto (per UI: badge "obbligatoria"). */
export const campiObbligatoriStrategici = [
  "nomeCognome",
  "email",
  "professione",
  "obiettivoPersonalBrand",
  "percorso",
  "valori",
  "riferimentoSu",
  "pubblicoTarget",
  "riferimentiVisivi",
] as const;
