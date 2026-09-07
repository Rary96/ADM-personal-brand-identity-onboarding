# Questionario Onboarding — Personal Brand Identity

Modulo di onboarding stile Typeform (una domanda per schermata, transizioni
fluide, barra di progresso) per raccogliere il brief di un progetto di
**personal brand identity**.

**Stato**: codice completo, `npm run build` verde, **non ancora deployato**.
Mancano il logo reale, il Google Sheet e il collegamento GitHub/Vercel — vedi
[`doc/PROGRESS.md`](doc/PROGRESS.md).

Progetto gemello, da cui questo eredita tutta l'architettura:
`../onboarding-brand-identity` (brand identity **aziendale**), in produzione su
[adm-brand-identity-onboarding.vercel.app](https://adm-brand-identity-onboarding.vercel.app).

## A cosa serve (e a cosa no)

Chi compila **è già un cliente acquisito**. Il form non serve a valutare un
lead o a fare un preventivo: raccoglie materiale **prima della call di kickoff
operativa**, dove le risposte vengono verificate, approfondite e usate per
decidere la direzione visiva.

Per questo, rispetto al gemello, **non ci sono domande su budget, deliverable,
decisore finale o tempistiche contrattuali**: appartengono a una fase già
chiusa. E per questo il copy dice esplicitamente che le risposte non devono
essere perfette — si rivedono insieme in call.

## Cosa cambia rispetto al gemello aziendale

Le domande sono nuove per circa il 70%. Non è un rinominare "azienda" in
"persona": il personal branding ha dimensioni che nel form aziendale non
esistono.

| Dimensione | Perché è specifica del personal brand |
|---|---|
| **Il nome non è progettabile** | Un'azienda sceglie il naming, una persona no. Via `namingStatus`, dentro `nomeBrand`: nome e cognome, solo il nome, un alias, il nome dello studio. |
| **La visibilità è una scelta** | `livelloEsposizione` + `confini` + `comfortVoltoVideo`. È **la domanda che determina il sistema visivo**: chi non ci mette la faccia ha bisogno di un'identità grafica autoportante, chi ci sta ha bisogno di direzione fotografica. |
| **Autorevolezza al posto di USP** | Non "cosa vendete di diverso" ma `riferimentoSu`, `credenziali`, `opinioneControcorrente`. |
| **Chi segue ≠ chi paga** | Nel personal brand pubblico e cliente spesso divergono (`seguePaga`). |
| **Obiettivo esplicito** | `obiettivoPersonalBrand` (max 3): clienti, tariffe, autorevolezza, speaking, prodotto. Nel form aziendale era implicito; qui orienta tutto il resto. |
| **Vincoli deontologici** | Ordini professionali italiani (avvocati, medici, psicologi) hanno regole su come ci si può presentare: `vincoliDeontologici`. |

Altre differenze strutturali:

- **Nessun branching** — percorso unico per tutti. `presenzaAttuale` è formulata
  per funzionare sia per chi parte da zero sia per chi si sta riposizionando.
- **Bottoni con stati espliciti** — nel gemello attivo e disabilitato erano lo
  stesso colore a opacità diversa, quasi indistinguibili. Qui sono due token
  (`accent.500` / `accent.200`), che risolve anche un problema di contrasto.
- **Logo ADM in header persistente**, assente nel gemello.
- **Token di personalizzazione `{{nome}}`** col solo nome di battesimo, non
  `{{azienda}}` con la ragione sociale intera.

## Struttura del questionario

35 domande su 8 sezioni, 15-20 minuti stimati, **9 obbligatorie**.

| # | Sezione | Domande |
|---|---|---|
| 1 | Chi sei | 5 |
| 2 | Obiettivi e punto di partenza | 3 |
| 3 | Storia e valori | 3 |
| 4 | Expertise e posizionamento | 3 |
| 5 | Pubblico | 3 |
| 6 | Riferimenti | 3 |
| 7 | Personalità, voce e visibilità | 7 |
| 8 | Stile visivo e materiale | 8 |

Obbligatorie: `nomeCognome`, `email`, `professione`, `obiettivoPersonalBrand`,
`percorso`, `valori`, `riferimentoSu`, `pubblicoTarget`, `riferimentiVisivi`.
Tutto il resto è facoltativo — quello che manca si recupera in call.

## Decisioni tecniche (ereditate dal gemello)

- **Salvataggio risposte**: Google Sheets via Service Account
  (`lib/google-sheets.ts`), append-only, una riga per submission. Le
  intestazioni sono in `SHEET_HEADERS` e vanno incollate a mano nella prima
  riga del tab "Risposte".
- **Upload file**: niente Google Drive. Ogni campo upload accetta allegato
  diretto via email (tetto globale 2 file, 2MB ciascuno, solo sull'email
  interna — limite del body serverless su Vercel) oppure link incollato
  (Drive, WeTransfer, Pinterest) senza limiti. Vedi `lib/attachment-limits.ts`.
- **Notifiche email**: doppio invio (riepilogo interno + conferma cliente) via
  **Nodemailer + SMTP Gmail (App Password)**, non Resend — nessun dominio da
  verificare. Vedi `lib/mailer.tsx`.
- **Nessun salvataggio progressi tra sessioni**: stato in memoria, nessun DB.
- **Cookie banner**: non integrato (nessun cookie non tecnico in uso).
- **Solo italiano.**

## Setup

```bash
npm install
cp .env.local.example .env.local   # e compila i 5 valori
npm run dev
```

Variabili d'ambiente richieste: `GOOGLE_SERVICE_ACCOUNT_EMAIL`,
`GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`.
Quattro su cinque si copiano identiche dal progetto gemello: solo
`GOOGLE_SHEET_ID` è nuovo.

## Documentazione

- [`CLAUDE.md`](CLAUDE.md) — regole di ingaggio e decisioni non ridiscutibili
  senza motivo (fonte di verità per Claude Code).
- [`doc/PROGRESS.md`](doc/PROGRESS.md) — log cronologico: cosa è stato fatto,
  le deviazioni dal progetto gemello e il perché, cosa resta da fare.
- [`doc/ARCHITECTURE.md`](doc/ARCHITECTURE.md) — riferimento generico e
  portabile (stack, pattern, razionale), ereditato dal gemello.
