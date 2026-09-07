# Log di progetto — Onboarding Personal Brand Identity

Log cronologico delle decisioni, delle deviazioni dal progetto gemello e del
perché. Complementare a `CLAUDE.md` (che elenca le decisioni *già prese* come
vincoli) e alle GitHub Issue (checklist operativa di cosa resta da fare).

---

## 2026-09-07 — Nascita del progetto

Richiesta: replicare la struttura di `../onboarding-brand-identity` con domande
diverse, centrate su un primo onboarding per lo sviluppo di una **personal
brand identity**.

### Ricerca preliminare

Confrontate fonti su questionari di brand discovery e sulla differenza tra
personal brand e business brand. Cinque dimensioni risultano specifiche del
personal branding e assenti dal form aziendale — sono quelle che hanno guidato
la riscrittura delle domande:

1. **Il nome non è progettabile.** Un'azienda sceglie il naming, una persona
   no: si può solo decidere *come* usarlo (nome e cognome, solo nome, alias,
   nome dello studio).
2. **La visibilità è una scelta, non un dato.** Quanto la persona è disposta a
   esporsi, cosa non condividerà mai, se è a suo agio con volto e video.
3. **Autorevolezza al posto di USP.** Non "cosa vendete di diverso" ma di cosa
   si vuole essere il riferimento, con quali credenziali.
4. **Chi ti segue ≠ chi ti paga.** Nel personal brand pubblico e cliente
   spesso divergono.
5. **Canali e pilastri di contenuto sono parte del brief**, e determinano i
   formati dei deliverable.

### Decisioni prese con l'utente

| Domanda | Risposta | Conseguenza |
|---|---|---|
| Target | Freelance/liberi professionisti + creator/divulgatori | Escluse le domande su convivenza brand personale/aziendale (founder) e su carriera interna (manager dipendenti) |
| Branching | **Nessuno** | `buildSteps()` senza argomenti, niente `superRefine` condizionale, `presenzaAttuale` formulata per coprire sia "parto da zero" sia "mi riposiziono" |
| Contesto | **Cliente già acquisito**, form preparatorio alla call di kickoff | Rimosse budget, deliverable, decisore finale, scadenza. Copy riscritto: le risposte non devono essere perfette, si rivedono in call |
| Identità visiva | Stessa struttura, ma stati bottone distinti | Attivo `accent.500`, disabilitato `accent.200` — vedi sotto |
| Deliverable | Nessuna domanda | Sezione 9 del gemello eliminata, il residuo utile assorbito in Sezione 8 |
| Fine form | Materiale fotografico + domanda jolly + aspettative sulla call | Niente domanda sulla scadenza |
| Logo ADM | Header persistente + favicon + email | `components/BrandHeader.tsx` |

### Deviazione: la domanda più importante non era prevista

`livelloEsposizione` non era nel piano iniziale ed è emersa dalla ricerca.
È la domanda che orienta più di ogni altra il sistema visivo: chi sceglie
"solo il lavoro" ha bisogno di un'identità grafica autoportante, chi sceglie
"anche la vita personale" di una direzione fotografica. Per questo:

- è renderizzata con un componente dedicato (`OrderedScaleField`, scala
  ordinata e non set di opzioni alla pari);
- è messa **in evidenza nel box di riepilogo dell'email interna**, insieme
  agli obiettivi, invece che persa in mezzo alle altre risposte.

### Deviazione: stati del bottone

Nel gemello attivo e disabilitato erano lo **stesso colore** (`accent.300`), il
secondo reso solo con `disabled:opacity-50` — praticamente indistinguibili.
Segnalato dall'utente come problema da risolvere in questo progetto.

Risolto con due token espliciti (`button.active` / `button.disabled` in
`lib/design-tokens.ts`), non con l'opacità. Effetto collaterale desiderabile:
`accent.300` con testo scuro non raggiungeva un contrasto sufficiente per
l'accessibilità, `accent.500` con testo bianco sì.

### Riuso dal gemello

Copiati e adattati: tutta `components/ui/`, il wizard e i componenti campo,
`emails/`, `lib/attachment-limits.ts`, `lib/mailer.tsx`, `lib/google-sheets.ts`,
la pagina privacy, e tutta la configurazione (Tailwind, tsconfig, postcss,
shadcn). Riscritti da zero: `content/questionnaire.ts`, `lib/schema.ts`,
`lib/email-sections.ts`, `lib/questionnaire-steps.ts`, `lib/personalize.ts`,
`components/questionnaire/FieldRenderer.tsx`, `SHEET_HEADERS` e `buildRow`.

Componenti campo eliminati perché senza più una domanda che li usi:
`PriceScaleField` (era per la fascia di prezzo — rinominato in
`OrderedScaleField` e riusato per `livelloEsposizione`), `SupportsField`
(supporti d'uso del logo), `DeadlineField` (scadenza).

### Pagina privacy

Adattata dal gemello. Oltre a sostituire i dati aziendali con quelli personali,
aggiunta una **clausola sull'art. 9 GDPR**: molte domande sono a risposta
libera e riguardano il percorso personale, quindi c'è un rischio concreto che
l'interessato inserisca spontaneamente categorie particolari di dati. Il
questionario non li richiede, ma l'informativa ora lo dice esplicitamente e
invita a non inserirli.

### Stato a fine giornata

`npm run build` verde, typecheck pulito. Il codice è completo: 35 domande su 8
sezioni, schema Zod, validazione per step, API di submit, scrittura su Sheets,
due email.

---

## Cosa resta da fare

Tutto in mano all'utente, il codice non è bloccato da nulla di tecnico.

1. **Google Sheet** — creare un foglio nuovo, condividerlo *in modifica* con la
   Service Account già in uso sul gemello, creare un tab chiamato `Risposte` e
   incollare `SHEET_HEADERS` (`lib/google-sheets.ts`) nella prima riga. Poi
   passare il `GOOGLE_SHEET_ID`. Le altre 4 env var si copiano identiche.
2. **Logo ADM** — `public/logo-adm.svg` è un **segnaposto generato** per non
   lasciare un 404 su `<BrandHeader />`. Servono: l'SVG reale (stesso nome
   file), un PNG per l'header delle due email (i client email non renderizzano
   SVG in modo affidabile), e un'icona quadrata per la favicon (`app/icon.png`).
3. **Repo GitHub** — da creare e collegare (`gh` è già autenticato come
   `Rary96`). Nome proposto: `ADM-personal-brand-onboarding`.
4. **Progetto Vercel** — importare il repo dalla dashboard (team ADM Design,
   piano Hobby) e impostare le 5 env var su Production e Preview.
5. **Test end-to-end in produzione** — una submission reale con allegato, come
   fatto sul gemello: verificare riga su Sheets e ricezione di entrambe le email.
