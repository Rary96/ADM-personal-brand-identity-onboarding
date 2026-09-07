/**
 * Copy italiano del questionario — separato dallo schema (lib/schema.ts) così
 * i testi si possono modificare senza toccare la logica di validazione.
 *
 * Ogni domanda ha: id (mappa 1:1 con un campo dello schema), label, guida
 * (sottotesto/placeholder) e obbligatorietà "di contenuto" (badge in UI).
 *
 * CONTESTO — questo form non è un modulo di preventivo: chi lo compila è un
 * cliente GIÀ acquisito, e il form serve a raccogliere materiale PRIMA della
 * call di kickoff operativa (dove le risposte vengono verificate e
 * approfondite insieme). Da qui due conseguenze sul copy, da non perdere in
 * eventuali revisioni:
 *   1. Niente domande su budget, deliverable o decisore finale — appartengono
 *      alla fase commerciale, già chiusa.
 *   2. Il tono dice esplicitamente che le risposte non devono essere perfette,
 *      perché si rivedono in call. Abbassare la pressione alza la sincerità
 *      delle risposte, che è esattamente ciò che serve per orientare lo stile.
 *
 * Tono di voce: la persona che compila resta sempre al centro. I testi di
 * sezione (`intro`), `midFormReminder` e `outroCopy` possono contenere il
 * token `{{nome}}`, interpolato a runtime col SOLO nome di battesimo estratto
 * da `nomeCognome` (vedi lib/personalize.ts) — usato "ogni tanto", non su ogni
 * domanda, per non diventare ripetitivo.
 */

export type FieldType =
  | "text-short"
  | "text-long"
  | "email"
  | "single-choice"
  | "multi-choice"
  | "scale"
  | "grid-2d"
  | "upload"
  | "color-picker";

export interface Question {
  id: string;
  label: string;
  guida?: string;
  type: FieldType;
  required: boolean;
  options?: { value: string; label: string }[];
}

export interface Section {
  id: string;
  title: string;
  intro?: string;
  questions: Question[];
}

export const introCopy = {
  titolo: "Prima di iniziare, parlami di te",
  sottotitolo:
    "Le basi per costruire un'identità che ti somigli davvero — non un personaggio.",
  tempoStimato: "15-20 minuti",
  punti: [
    "Non deve essere perfetto: quello che scrivi qui lo verifichiamo e approfondiamo insieme nella call di kickoff.",
    "Le domande facoltative puoi saltarle. Meglio una risposta sincera in tre righe che una costruita in venti.",
    "Più sei specifico, più la direzione visiva che ti proporrò sarà tua e non di chiunque altro.",
  ],
  bottone: "Iniziamo",
  nota: "I tuoi dati sono trattati nel rispetto del GDPR.",
};

export const midFormReminder =
  "Sei a metà, {{nome}}: altri 7-8 minuti e hai finito. Ricorda che le domande facoltative puoi saltarle.";

export const sections: Section[] = [
  {
    id: "chi-sei",
    title: "Chi sei",
    intro: "Le basi, per non perderci nulla.",
    questions: [
      {
        id: "nomeCognome",
        label: "Come ti chiami?",
        guida: "Nome e cognome — è il punto di partenza di tutto il resto.",
        type: "text-short",
        required: true,
      },
      {
        id: "nomeBrand",
        label: "Con quale nome vuoi essere riconosciuto?",
        guida:
          "Nome e cognome, solo il nome, un alias, o il nome del tuo studio/progetto. Se non hai ancora deciso, scrivilo pure: è una cosa che possiamo definire insieme.",
        type: "text-short",
        required: false,
      },
      {
        // Il contatto del cliente è già noto (proposta approvata, prima call
        // di allineamento già fatta): questo campo NON serve a farsi lasciare
        // un recapito, serve solo a recapitare la copia delle risposte. Il
        // copy lo dice, così non sembra una richiesta di dati già dati.
        id: "email",
        label: "A quale indirizzo vuoi ricevere una copia delle tue risposte?",
        guida:
          "Il tuo contatto ce l'ho già: serve solo per mandarti il riepilogo di quello che scrivi qui, così puoi rileggerlo con calma prima della call.",
        type: "email",
        required: true,
      },
      {
        id: "professione",
        label: "In una riga: cosa fai?",
        guida:
          "Come lo diresti a una persona appena conosciuta, senza gergo tecnico e senza il titolo sul biglietto da visita.",
        type: "text-short",
        required: true,
      },
      {
        id: "profiliOnline",
        label: "Dove ti si trova oggi online?",
        guida:
          "LinkedIn, Instagram, sito, newsletter, YouTube, podcast... incolla i link che hai, anche quelli che non ti piacciono più.",
        type: "text-short",
        required: false,
      },
    ],
  },
  {
    id: "obiettivi",
    title: "Obiettivi e punto di partenza",
    intro: "Dove vuoi arrivare, e da dove partiamo.",
    questions: [
      {
        id: "obiettivoPersonalBrand",
        label: "Cosa vuoi ottenere dal tuo personal brand?",
        guida:
          "Scegline al massimo 3: se sono tutti prioritari, nessuno lo è davvero.",
        type: "multi-choice",
        required: true,
        options: [
          { value: "trovare_clienti", label: "Trovare clienti senza rincorrerli" },
          { value: "alzare_tariffe", label: "Poter alzare le tariffe" },
          { value: "autorevolezza", label: "Essere riconosciuto come esperto" },
          { value: "speaking", label: "Essere invitato a parlare (eventi, podcast, media)" },
          { value: "opportunita_lavoro", label: "Aprire opportunità di lavoro o collaborazione" },
          { value: "lanciare_prodotto", label: "Lanciare un prodotto, un corso o un libro" },
          { value: "community", label: "Costruire una community attorno a un tema" },
          { value: "coerenza", label: "Smettere di sembrare improvvisato" },
        ],
      },
      {
        id: "perchePropioOra",
        label: "Perché proprio adesso?",
        guida:
          "È cambiato qualcosa — un salto professionale, una frustrazione che si ripete, un'occasione da cogliere?",
        type: "text-long",
        required: false,
      },
      {
        id: "presenzaAttuale",
        label: "Com'è la tua presenza online oggi, e cosa non ti convince?",
        guida:
          "Se non hai ancora nulla, scrivilo: è un'informazione utile quanto le altre. Se invece c'è già qualcosa, dimmi cosa salveresti e cosa butteresti.",
        type: "text-long",
        required: false,
      },
    ],
  },
  {
    id: "storia-valori",
    title: "Storia e valori",
    intro: "Il materiale grezzo della tua identità, {{nome}}.",
    questions: [
      {
        id: "percorso",
        label: "Come sei arrivato a fare quello che fai oggi?",
        guida:
          "Non serve una biografia: bastano i 3-4 passaggi che hanno contato davvero, anche quelli storti.",
        type: "text-long",
        required: true,
      },
      {
        id: "momentoSvolta",
        label:
          "C'è un momento, un errore o un incontro che ha cambiato il tuo modo di lavorare?",
        guida:
          "Sono le storie che le persone ricordano di te — e spesso il materiale migliore da cui far nascere un'identità.",
        type: "text-long",
        required: false,
      },
      {
        id: "valori",
        label: "Quali sono i 3-5 valori su cui non scendi a compromessi?",
        guida:
          "Scegli valori che ti farebbero rifiutare un cliente ben pagato, non parole generiche come 'qualità' o 'passione'.",
        type: "multi-choice",
        required: true,
      },
    ],
  },
  {
    id: "expertise",
    title: "Expertise e posizionamento",
    intro: "Dove vuoi essere collocato nella testa delle persone.",
    questions: [
      {
        id: "riferimentoSu",
        label: "Di cosa vuoi essere IL punto di riferimento?",
        guida:
          "Completa la frase: 'Quando qualcuno ha bisogno di ___, voglio che pensi a me.' Più è specifico, più funziona: 'marketing' non basta, 'email marketing per e-commerce di nicchia' sì.",
        type: "text-long",
        required: true,
      },
      {
        id: "credenziali",
        label: "Quali risultati concreti puoi mettere sul tavolo?",
        guida:
          "Numeri, clienti noti, anni di esperienza, premi, pubblicazioni, docenze. Non è vantarsi: è il materiale con cui si costruisce credibilità.",
        type: "text-long",
        required: false,
      },
      {
        id: "opinioneControcorrente",
        label: "C'è un'opinione del tuo settore su cui sei in disaccordo?",
        guida:
          "Es. 'tutti dicono che serva pubblicare ogni giorno, io penso il contrario'. È spesso il seme di una voce riconoscibile.",
        type: "text-long",
        required: false,
      },
    ],
  },
  {
    id: "pubblico",
    title: "Pubblico",
    intro: "A chi parli davvero.",
    questions: [
      {
        id: "pubblicoTarget",
        label: "A chi vuoi parlare? Descrivi la persona che vuoi raggiungere",
        guida:
          "Ruolo, momento professionale, cosa la tiene sveglia la notte. Se ti aiuta, pensa a un cliente reale che vorresti clonare.",
        type: "text-long",
        required: true,
      },
      {
        id: "seguePaga",
        label: "Chi ti segue e chi ti paga sono la stessa persona?",
        guida:
          "Nel personal branding spesso no: puoi avere un pubblico ampio e pochi clienti molto specifici. Sapere se coincidono cambia parecchio le scelte.",
        type: "text-long",
        required: false,
      },
      {
        id: "cosaDicanoDiTe",
        label: "Cosa vorresti che dicessero di te quando non sei nella stanza?",
        guida: "Una frase sola, come la direbbe davvero una persona parlando con un'altra.",
        type: "text-long",
        required: false,
      },
    ],
  },
  {
    id: "riferimenti",
    title: "Riferimenti",
    intro: "Per costruirti un'identità differenziata, non simile per caso.",
    questions: [
      {
        id: "personeAmmirate",
        label:
          "Indica 2-3 persone che secondo te si presentano bene, e spiega perché",
        guida:
          "Anche di settori diversi dal tuo. Nome + link se ce l'hai. Interessa come si posizionano e si raccontano, non quanto sono brave nel mestiere.",
        type: "text-long",
        required: false,
      },
      {
        id: "nonVoglioSomigliare",
        label: "A chi non vuoi assolutamente somigliare?",
        guida:
          "Anche senza fare nomi, se preferisci: descrivi l'atteggiamento o lo stile che vuoi evitare. Spesso è più facile del contrario, e altrettanto utile.",
        type: "text-long",
        required: false,
      },
      {
        id: "mappaPosizionamento",
        label:
          "Su una mappa 'istituzionale vs. personale' e 'tecnico vs. divulgativo', dove ti vuoi collocare?",
        guida:
          "Se non sei sicuro, posizionati dove NON vuoi stare e poi spostati: a volte è più facile partire da lì.",
        type: "grid-2d",
        required: false,
      },
    ],
  },
  {
    id: "personalita-visibilita",
    title: "Personalità, voce e visibilità",
    intro: "Il ponte tra chi sei e come apparirai.",
    questions: [
      {
        id: "aggettivi",
        label: "Se dovessi descriverti in 5 aggettivi, quali sceglieresti?",
        guida:
          "Es. 'diretto, curioso, paziente, ironico, concreto'. Bonus: chiedi anche a due persone che ti conoscono bene e confronta — le differenze sono spesso la parte interessante.",
        type: "text-short",
        required: false,
      },
      {
        id: "archetipo",
        label: "Se dovessi scegliere un archetipo, quale ti rappresenta di più?",
        guida:
          "Non serve conoscerli in dettaglio: scegli d'istinto, il ragionamento lo facciamo in call.",
        type: "single-choice",
        required: false,
        options: [
          { value: "eroe", label: "Eroe" },
          { value: "saggio", label: "Saggio" },
          { value: "esploratore", label: "Esploratore" },
          { value: "ribelle", label: "Ribelle" },
          { value: "creatore", label: "Creatore" },
          { value: "sovrano", label: "Sovrano" },
          { value: "mago", label: "Mago" },
          { value: "innocente", label: "Innocente" },
          { value: "amante", label: "Amante" },
          { value: "giullare", label: "Giullare" },
          { value: "uomo_comune", label: "Uomo comune" },
          { value: "custode", label: "Custode" },
        ],
      },
      {
        id: "archetipoMotivazione",
        label: "Perché senti che questo archetipo ti rappresenta?",
        guida: "Facoltativo, ma anche una riga aiuta a orientare il tono visivo.",
        type: "text-long",
        required: false,
      },
      {
        id: "toneEParole",
        label: "Come parli al tuo pubblico — e ci sono parole che useresti sempre o mai?",
        guida:
          "Pensa a un messaggio che scriveresti davvero a un cliente: che tono ha? Anche 2-3 parole per lato bastano.",
        type: "scale",
        required: false,
      },
      {
        id: "livelloEsposizione",
        label: "Quanto vuoi metterti in mostra?",
        guida:
          "Non c'è una risposta giusta, e nessuna è meno professionale delle altre. Determina però quanto la tua identità potrà appoggiarsi su di te e quanto dovrà reggersi su un sistema grafico.",
        type: "scale",
        required: false,
        options: [
          { value: "solo_lavoro", label: "Solo il lavoro: competenze, risultati, contenuti utili" },
          {
            value: "dietro_le_quinte",
            label: "Lavoro + dietro le quinte: come lavoro, come ragiono, cosa sbaglio",
          },
          {
            value: "anche_personale",
            label: "Anche la vita personale: valori, passioni, momenti difficili",
          },
        ],
      },
      {
        id: "confini",
        label: "C'è qualcosa che non condividerai mai pubblicamente?",
        guida:
          "Temi, parti della tua vita, opinioni su cui non vuoi esporti. Meglio saperlo adesso che scoprirlo a lavoro fatto.",
        type: "text-long",
        required: false,
      },
      {
        id: "comfortVoltoVideo",
        label: "Con quali formati te la senti?",
        guida:
          "Sii onesto: se il video ti mette a disagio, costruiamo un'identità che non ne dipenda. Seleziona tutto ciò che ti sta bene.",
        type: "multi-choice",
        required: false,
        options: [
          { value: "foto_ritratto", label: "Foto ritratto" },
          { value: "video_parlato", label: "Video in cui parlo" },
          { value: "voce_podcast", label: "Solo voce (podcast, audio)" },
          { value: "dirette", label: "Dirette e webinar" },
          { value: "palco_eventi", label: "Palco ed eventi dal vivo" },
          { value: "scrittura", label: "Solo scrittura" },
          {
            value: "preferisco_grafica",
            label: "Preferirei non comparire: meglio un'identità grafica",
          },
        ],
      },
    ],
  },
  {
    id: "stile-visivo",
    title: "Stile visivo e materiale",
    intro: "Riferimenti concreti, non aggettivi astratti.",
    questions: [
      {
        id: "riferimentiVisivi",
        label:
          "Carica o linka 3-5 riferimenti visivi che ti piacciono, spiegando perché",
        guida:
          "Identità di altre persone, brand, packaging, siti, poster: non devono essere del tuo settore, cerca ciò che ti fa dire 'wow'. Puoi allegare file piccoli (JPG, PNG, WEBP, SVG, PDF fino a 2MB, max 2 in totale su tutto il form) oppure incollare un link (Drive, WeTransfer, Pinterest...) per file più grandi o numerosi.",
        type: "upload",
        required: true,
      },
      {
        id: "stiliDaEvitare",
        label: "Quali stili non ti rappresentano o vuoi assolutamente evitare?",
        guida:
          "Es. 'niente corsivi eleganti, niente estetica da coach motivazionale'. Allegato diretto fino a 2MB (JPG, PNG, WEBP, SVG, PDF) o link per file più grandi.",
        type: "upload",
        required: false,
      },
      {
        id: "tipologiaMarchio",
        label: "Che tipo di marchio immagini?",
        guida: "Se non sai scegliere, lascia 'aperto a proposta': è una risposta legittima.",
        type: "single-choice",
        required: false,
        options: [
          { value: "monogramma", label: "Monogramma / iniziali" },
          { value: "firma", label: "Firma o tratto manoscritto" },
          { value: "logotipo", label: "Il mio nome scritto (logotipo)" },
          { value: "simbolo_nome", label: "Simbolo + nome" },
          { value: "aperto_a_proposta", label: "Aperto a proposta del designer" },
        ],
      },
      {
        id: "colori",
        label: "Ci sono colori che ami, che eviteresti, o vincoli da rispettare?",
        guida:
          "Indica anche colori 'vietati' per associazioni negative nel tuo settore, o quelli che già usi e vuoi tenere.",
        type: "color-picker",
        required: false,
      },
      {
        id: "materialeFotografico",
        label: "Hai già foto ritratto o materiale di uno shooting?",
        guida:
          "Anche scatti non professionali vanno bene: mi dicono come stai davanti all'obiettivo e se conviene mettere in conto uno shooting nuovo. Allegato diretto fino a 2MB o link per file più grandi.",
        type: "upload",
        required: false,
      },
      {
        id: "vincoliDeontologici",
        label:
          "Ci sono vincoli deontologici o normativi del tuo settore da rispettare?",
        guida:
          "Regole di ordini professionali (avvocati, medici, commercialisti, psicologi) su come ci si può presentare e pubblicizzare. Se hai un dubbio, allega il regolamento nella domanda del materiale fotografico.",
        type: "text-long",
        required: false,
      },
      {
        id: "aspettativeCall",
        label: "C'è qualcosa che vuoi assolutamente affrontare nella call di kickoff?",
        guida:
          "Un dubbio che ti porti dietro, una decisione su cui sei bloccato, una domanda che non sapevi dove mettere.",
        type: "text-long",
        required: false,
      },
      {
        id: "domandaJolly",
        label: "C'è altro che vuoi dirmi e che non ti ho chiesto?",
        type: "text-long",
        required: false,
      },
    ],
  },
];

export const outroCopy = {
  titolo: "Fatto, grazie {{nome}}!",
  corpo:
    "Ho ricevuto le tue risposte. Da qui parte il lavoro vero: le leggo con calma e arrivo alla call con le idee già in ordine.",
  // Usato solo nell'email di conferma cliente (ClientConfirmationEmail),
  // non nella OutroScreen a video — dettaglio dei prossimi passi dopo l'invio.
  prossimiPassi: [
    "Leggo tutto con calma e preparo i punti da approfondire.",
    "Ti scrivo entro 1-2 giorni lavorativi per fissare la call di kickoff.",
    "Nella call verifichiamo insieme quello che hai scritto e definiamo la direzione visiva.",
  ],
};
