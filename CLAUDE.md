# Progetto: Questionario Onboarding — Personal Brand Identity

Modulo di onboarding stile Typeform (una domanda alla volta, transizioni fluide,
barra di progresso) per raccogliere il brief di un progetto di **personal brand
identity**.

Progetto gemello, da cui questo eredita l'architettura:
`../onboarding-brand-identity` (brand identity aziendale). Stack e pattern
identici, **contenuto del questionario completamente diverso**.

## Ruolo

Agisci da Senior Full-Stack Developer + Expert UX/UI Designer.

## Contesto d'uso (determina quasi tutte le scelte di copy)

Chi compila **è già un cliente acquisito**, non un lead da valutare: la fase
commerciale è chiusa. Il form serve a raccogliere materiale **prima della call
di kickoff operativa**, dove Arianna e il cliente verificano insieme le
risposte, le approfondiscono e da lì decidono la direzione visiva.

Due conseguenze da non perdere in eventuali revisioni:

1. **Niente domande su budget, deliverable, decisore finale o tempistiche
   contrattuali** — appartengono alla fase di preventivo, già superata.
   Rimosse deliberatamente rispetto al progetto gemello.
2. **Il copy dice esplicitamente che le risposte non devono essere perfette**,
   perché si rivedono in call (vedi `introCopy.punti` in
   `content/questionnaire.ts`). Abbassare la pressione alza la sincerità delle
   risposte, che è esattamente ciò che serve per orientare lo stile.

## Stack tecnico

- **Framework & Styling**: Next.js 14 (App Router), Tailwind CSS, Framer Motion
  per le transizioni tra step.
- **UI Library**: shadcn/ui versione classica (Radix + `tailwind.config.ts`),
  non l'ultima major — vedi la voce dedicata sotto.
- **Integrazioni & Backend**:
  - Google Sheets API (Service Account) — salvataggio risposte
  - Nodemailer via SMTP Gmail (App Password) + React Email — notifiche,
    allegati diretti inclusi (max 2 file, 2MB ciascuno, solo email interna)
  - Zod — validazione client **e** server-side

## Regole di ingaggio

1. Fai riferimento a `lib/schema.ts`, `content/questionnaire.ts`,
   `lib/design-tokens.ts` e `README.md` come fonte di verità su dati,
   contenuti e decisioni già prese. Non rimetterle in discussione senza chiedere.
2. Procedi **step by step**. Non generare tutto il codice in un unico blocco.
3. Sicurezza, non negoziabile:
   - Nessun secret nel codice sorgente.
   - Credenziali solo in `.env.local` (gitignored) e nelle Environment
     Variables di Vercel — mai committate.
   - Validazione dati sempre anche server-side con Zod.

## Cosa è già stato deciso (non ridiscutere senza motivo)

- **Nessun branching.** A differenza del progetto gemello (che sdoppiava le
  domande su "nuovo brand / restyling"), qui il percorso è unico. Le domande
  che dovrebbero distinguere i casi sono formulate per funzionare in entrambi:
  vedi `presenzaAttuale`, che accetta esplicitamente "non ho ancora nulla" come
  risposta valida. Di conseguenza `buildSteps()` non prende argomenti e non
  esiste `superRefine` condizionale a un campo discriminante.
- **Target**: freelance/liberi professionisti e creator/divulgatori. Non
  manager dipendenti né founder che affiancano un brand aziendale — le domande
  su convivenza brand personale/aziendale sono volutamente assenti.
- **35 domande su 8 sezioni**, 15-20 minuti stimati. Solo **9 obbligatorie**:
  `nomeCognome`, `email`, `professione`, `obiettivoPersonalBrand`, `percorso`,
  `valori`, `riferimentoSu`, `pubblicoTarget`, `riferimentiVisivi`. Tutto il
  resto è facoltativo: quello che manca si recupera in call, che è lo scopo
  stesso del form.
- **`livelloEsposizione` è la domanda più importante del questionario**
  (Sezione 7). Quanto la persona è disposta a esporsi determina se l'identità
  potrà appoggiarsi su di lei (direzione fotografica) o dovrà reggersi su un
  sistema grafico autoportante. È in evidenza nell'email di riepilogo interno.
  Non declassarla a domanda facoltativa qualunque.
- **`obiettivoPersonalBrand` ha un tetto di 3 selezioni** (`MAX_OBIETTIVI` in
  `lib/schema.ts`, applicato sia nello schema che in `validate-step.ts` che
  nella UI). È una scelta di contenuto — costringere a dare una priorità — non
  un vincolo tecnico.
- **Personalizzazione col token `{{nome}}`** (non `{{azienda}}` come nel
  gemello): interpolato col **solo nome di battesimo** estratto da
  `nomeCognome` tramite `primoNome()` in `lib/personalize.ts`. "Sei a metà,
  Mario Rossi" suonerebbe come una raccomandata. Usato "ogni tanto" nei testi
  di sezione e nei reminder, non su ogni domanda.
- **Bottoni: stati attivo e disabilitato sono due colori espliciti**, non lo
  stesso colore con opacità diversa (come nel gemello, dove erano quasi
  indistinguibili). Attivo `accent.500` `#8F86A0` con testo bianco, disabilitato
  `accent.200` `#DFDBE3` con testo grigio — vedi `button` in
  `lib/design-tokens.ts`, `--primary` in `app/globals.css` e la variante
  `default` in `components/ui/button.tsx`. **Non tornare a differenziare i due
  stati con la sola opacità.** L'attivo più carico risolve anche un problema di
  contrasto che il gemello aveva.
- **Logo ADM in header persistente** (`components/BrandHeader.tsx`), piccolo e
  desaturato: durante il form l'utente valuta stili e colori, un logo troppo
  presente influenzerebbe le risposte estetiche. Stesso principio per cui la
  palette del form è quasi tutta neutra.
- **Palette**: identica al gemello — Pantone 13-3905 TCX "Diaphanous Lilac"
  `#C6C2CD` come famiglia di accento su base neutra bianco/grigi. Cambia solo
  il modo in cui gli stati del bottone la usano (voce sopra).
- **Font**: Montserrat (Google Fonts), come il gemello.
- **Navigazione: solo bottone, niente scorciatoia Invio/Enter** — Invio ha
  altri usi (aggiungere un chip in `ChipsField`) o nessuno. Ereditato dal
  gemello, non reintrodurre.
- **Nessun salvataggio progressi tra sessioni**: form completabile in un'unica
  sessione, stato in memoria React.
- **Solo italiano**, tono informale in seconda persona singolare ("tu").
- **Notifiche email**: doppio invio a ogni submission — riepilogo interno a
  `dalmontearianna.96@gmail.com` (email del proprietario di QUESTO progetto,
  vedi la nota in `lib/mailer.tsx`) + conferma al cliente. Via Nodemailer +
  SMTP Gmail App Password, non Resend.
- **Campi array liberi senza opzioni predefinite** (`valori`): chip-input a
  testo libero (`ChipsField`), non checkbox con lista fissa — i valori
  personali non sono enumerabili in una tassonomia sensata.
- **`obiettivoPersonalBrand` e `comfortVoltoVideo`: multi-select chiuso**
  (`PillMultiSelectField`), perché a differenza dei valori sono enumerabili in
  modo pressoché universale.
- **Cookie banner (CookieYes): NON integrato**, stessa decisione del gemello —
  il form non usa cookie non tecnici/di profilazione.
- **Pagina privacy** (`app/informativa-privacy/page.tsx`): titolare Arianna Dal
  Monte, ereditata dal gemello e adattata ai dati effettivamente raccolti qui
  (dati personali e di percorso professionale, non aziendali). Contiene una
  clausola aggiuntiva sull'art. 9 GDPR: molte domande sono a risposta libera
  sul percorso personale, quindi si invita esplicitamente a non inserire
  spontaneamente categorie particolari di dati.
- **shadcn/ui: versione classica (Radix + Tailwind v3)**, non `shadcn@latest`
  (v4, preset "base-nova", Base UI + Tailwind v4 CSS-first) — incompatibile con
  `tailwind.config.ts`/`design-tokens.ts`. Non fare l'upgrade senza discuterne.

## Struttura file

```
onboarding-personal-brand-identity/
├── app/
│   ├── layout.tsx                  # font Montserrat, metadata
│   ├── page.tsx                    # monta <QuestionnaireWizard />
│   ├── globals.css                 # tema shadcn (HSL vars) sopra palette lilla/neutri
│   ├── api/submit/route.ts         # valida (Zod), scrive su Sheets, invia le due email
│   └── informativa-privacy/        # pagina privacy policy
├── components/
│   ├── BrandHeader.tsx             # logo ADM persistente in alto a sinistra
│   ├── ui/                         # primitive shadcn/ui (Radix + cva)
│   └── questionnaire/
│       ├── QuestionnaireWizard.tsx # state machine: intro → domande → consenso → outro
│       ├── QuestionCard.tsx        # layout singola domanda + validazione + nav
│       ├── FieldRenderer.tsx       # smista ogni domanda al componente campo giusto
│       ├── ProgressBar/IntroScreen/OutroScreen/ConsentStep.tsx
│       ├── AttachmentsContext.tsx  # stato allegati email (tetto globale)
│       └── fields/                 # ChipsField, PillMultiSelectField, OrderedScaleField,
│                                   # ToneScaleField, GridPositionField, UploadLinkField,
│                                   # ColorField, SimpleFields
├── lib/
│   ├── schema.ts                   # Zod schema + tipi, MAX_OBIETTIVI, campi obbligatori
│   ├── design-tokens.ts            # palette, stati bottone, font, radii, timing
│   ├── questionnaire-steps.ts      # flatten domande (nessun filtro: niente branching)
│   ├── validate-step.ts            # validazione "leggera" per step
│   ├── attachment-limits.ts        # tetto/tipi ammessi per allegati email
│   ├── google-sheets.ts            # scrittura riga + SHEET_HEADERS
│   ├── mailer.tsx                  # invio email via Nodemailer/Gmail SMTP
│   ├── email-sections.ts           # riepilogo email da content/questionnaire.ts
│   ├── questionnaire-labels.ts     # enum → label italiane (condiviso Sheets/email)
│   └── personalize.ts              # token {{nome}} + primoNome()
├── emails/                         # template React Email (riepilogo interno, conferma)
├── content/
│   └── questionnaire.ts            # Copy IT: sezioni, domande, guida, intro/outro
├── public/
│   └── logo-adm.svg                # ⚠️ SEGNAPOSTO — da sostituire col logo reale
└── doc/
    ├── PROGRESS.md                 # log cronologico specifico di questo progetto
    └── ARCHITECTURE.md             # riferimento portabile, ereditato dal gemello
```

## Stato

**Codice completo e buildabile.** Tutte le 35 domande, schema, validazione,
API, email e Sheets sono implementati e `npm run build` passa.

**Non ancora deployato.** Mancano tre cose, tutte in mano all'utente — vedi
`doc/PROGRESS.md` per il dettaglio:

1. `GOOGLE_SHEET_ID` di un foglio nuovo, condiviso con la Service Account già
   in uso sul gemello (le altre 4 env var si copiano identiche).
2. Il **logo ADM reale** — `public/logo-adm.svg` è un segnaposto generato per
   non lasciare un 404. Serve anche una versione PNG per le email e
   un'icona per la favicon (`app/icon.png`).
3. Repo GitHub e progetto Vercel da creare e collegare.

## Variabili d'ambiente

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=      # identica al progetto gemello
GOOGLE_PRIVATE_KEY=                # identica al progetto gemello
GOOGLE_SHEET_ID=                   # ⚠️ NUOVA — foglio dedicato a questo form
GMAIL_USER=                        # identica al progetto gemello
GMAIL_APP_PASSWORD=                # identica al progetto gemello
```

Questi valori li genera/recupera l'utente — non vanno inventati né richiesti
come input di codice. Vivono solo in `.env.local` (gitignored) in locale e
nelle Environment Variables di Vercel in produzione.

Le intestazioni di colonna del foglio sono in `SHEET_HEADERS`
(`lib/google-sheets.ts`) e vanno incollate nella prima riga del tab
**"Risposte"**: `appendSubmissionRow` fa un append cieco e non le scrive da sé.

## Workflow post-deploy: issue tracking e branching

Stesse regole del progetto gemello, da applicare una volta che il repo esiste:

- Ogni problema (bug, revisione, feature) si traccia come **GitHub Issue**,
  etichettata `UI` / `UX` / `BACK` (combinabili) più le label di default
  GitHub quando pertinenti.
- Ogni intervento non banale su un **branch dedicato**, merge in `main` solo a
  lavoro completato — `main` sarà collegato al deploy automatico su Vercel.
- Ad ogni commit/push, verificare se risolve Issue aperte e **chiuderle subito**
  con `gh issue close <N> --comment "..."` citando l'hash del commit. Non usare
  la keyword `Closes #N`, che chiude solo al merge sul branch default.
