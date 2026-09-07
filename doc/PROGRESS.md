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

## 2026-09-07 (secondo blocco) — Logo, roadmap, repo

### Repo e Sheet

Repo `Rary96/ADM-personal-brand-identity-onboarding` (pubblico, come il
gemello) collegato e pushato. `.env.local` compilato: 4 valori copiati dal
gemello + il `GOOGLE_SHEET_ID` del foglio nuovo.

Aggiunto `doc/sheet-headers.tsv` con le 51 intestazioni tab-separate, pronte
da incollare in A1 del tab `Risposte`: `appendSubmissionRow` fa un append
cieco e non le scrive da sé. Verificato che le 51 intestazioni corrispondono
esattamente ai 51 valori prodotti da `buildRow`.

### Lacuna trovata: l'email al cliente non conteneva le risposte

Segnalato dall'utente che il campo `email` del form serve a mandare al cliente
**la copia delle sue risposte** — il contatto è già noto, non è una richiesta
di recapito. Ma `ClientConfirmationEmail` mandava solo ringraziamento e
prossimi passi.

Corretto: il template riceve ora l'intero `data` e rende il riepilogo con lo
stesso `buildEmailSections()` dell'email interna, così le due non possono
divergere quando cambia una domanda. Anche la label della domanda ora dice a
cosa serve l'indirizzo, per non sembrare una richiesta di dati già forniti.

### Logo

Trovati gli asset reali in `ADM/Peronal Brand identity/Responsiveness`, che è
un vero sistema di responsiveness del marchio (versione estesa con cerchio,
versione breve/monogramma, icona quadrata). Scelte:

- **Header persistente: versione BREVE (monogramma).** A 24px di altezza il
  logotipo esteso sarebbe largo ~43px e del tutto illeggibile. È esattamente
  il caso d'uso per cui la versione corta esiste.
- **Email: versione ESTESA**, dove c'è spazio in larghezza (140px).
- **Favicon**: monogramma quadrato ritagliato dall'icona ad alta risoluzione
  (8266px) invece che upscalato dal `ADM_Logo favicon.png` a 134px.

Il logo nelle email ha richiesto `lib/site-url.ts` e la env var
`NEXT_PUBLIC_SITE_URL`: i client di posta non risolvono percorsi relativi,
serve un URL assoluto pubblico. Con fallback sul dominio di produzione, così
un'email non si rompe se la variabile non è impostata.

### Deviazione: `app/icon.png` rompe il build

Primo tentativo con la convenzione Next `app/icon.png`. `next build` fallisce
con `Cannot find module for page: /icon.png` e, a cache pulita, con un ENOENT
su `pages-manifest.json`. Il build passa appena si rimuove il file, quindi la
causa è quella route di metadata — molto probabilmente il percorso assoluto
della cartella, che contiene una pipe e delle & ("ADM | Design & Digital").

Risolto servendo le icone da `public/` e dichiarandole in `metadata.icons`,
senza passare dal codegen delle metadata route. Verificato su build di
produzione: `<link rel="icon">` presente nel markup, i quattro asset
rispondono 200 `image/png`, il logo dell'header viene preloadato.

Nota: il commit `17e7720` è stato pushato con il build rotto (una catena `&&`
con un `grep` che ha comunque avuto successo ha nascosto il fallimento).
Riparato subito dopo in `3314435`.

### Copy allineato alla roadmap del servizio

Ricevuta la roadmap della proposta approvata
(`PersonalBrandIdentity_proposal`). La sequenza reale è: raccolta materiale +
**questionario preliminare** (questo form) → visione del materiale → **meeting
di kickoff operativo** → **Ricerca & Analisi** → output brief riassuntivo + 2
proposte di moodboard → 1° meeting di confronto.

Prima l'outro prometteva *"ti scrivo entro 1-2 giorni lavorativi per fissare
la call di kickoff"*, che non corrispondeva. Riscritti `outroCopy` e i punti
dell'intro sui passaggi reali, e uniformata la terminologia da "call" a
"meeting di kickoff operativo".

---

## Cosa resta da fare

Tutto in mano all'utente, il codice non è bloccato da nulla di tecnico.

1. **Preparare il Google Sheet** — condividerlo *in modifica* con
   `onboarding-form@onboarding-brand-identity.iam.gserviceaccount.com`,
   rinominare il tab in `Risposte`, incollare `doc/sheet-headers.tsv` in A1.
2. **Progetto Vercel** — importare il repo dalla dashboard (team ADM Design,
   piano Hobby) e impostare le 6 env var su Production e Preview.
3. **Test end-to-end in produzione** — una submission reale con allegato, come
   fatto sul gemello: verificare la riga su Sheets, la ricezione di entrambe le
   email e che il logo nell'header delle email si veda davvero (è il punto più
   fragile: dipende da `NEXT_PUBLIC_SITE_URL` e dal fatto che l'immagine sia
   pubblicamente raggiungibile).
