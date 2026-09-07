import { Heading, Hr, Section, Text } from "@react-email/components";
import { EmailLayout } from "@/emails/components/EmailLayout";
import { SectionBlock } from "@/emails/components/SectionBlock";
import { outroCopy } from "@/content/questionnaire";
import { buildEmailSections } from "@/lib/email-sections";
import { personalize, primoNome } from "@/lib/personalize";
import { colors } from "@/lib/design-tokens";
import type { Questionario } from "@/lib/schema";

interface ClientConfirmationEmailProps {
  data: Questionario;
}

/**
 * Email di conferma al cliente. Include il **riepilogo completo delle
 * risposte**, non solo il ringraziamento: il campo `email` del form esiste
 * proprio per recapitare questa copia (il contatto del cliente è già noto),
 * e riceverla permette di rileggere le proprie risposte prima della call.
 *
 * Usa lo stesso `buildEmailSections()` del riepilogo interno, quindi le due
 * email non possono divergere quando cambia una domanda.
 */
export function ClientConfirmationEmail({ data }: ClientConfirmationEmailProps) {
  const nomeCliente = data.nomeCognome;
  const titolo = personalize(outroCopy.titolo, nomeCliente);
  const corpo = personalize(outroCopy.corpo, nomeCliente);
  // Il saluto usa il solo nome di battesimo: qui il destinatario è sempre una
  // persona, non un'azienda, quindi non serve il fallback del progetto gemello.
  const saluto = primoNome(nomeCliente);
  const emailSections = buildEmailSections(data);

  return (
    <EmailLayout preview={corpo}>
      <Heading as="h2" style={{ fontSize: 20, color: colors.neutral[900], margin: "0 0 16px" }}>
        {titolo}
      </Heading>
      <Text style={{ fontSize: 15, lineHeight: 1.6, color: colors.neutral[700], margin: "0 0 12px" }}>
        Ciao {saluto},
      </Text>
      <Text style={{ fontSize: 15, lineHeight: 1.6, color: colors.neutral[700], margin: "0 0 12px" }}>
        {corpo}
      </Text>

      <Heading as="h3" style={{ fontSize: 14, color: colors.neutral[900], margin: "0 0 12px" }}>
        Cosa succede adesso
      </Heading>
      <Section style={{ margin: "0 0 28px" }}>
        {outroCopy.prossimiPassi.map((step, i) => (
          <Text
            key={step}
            style={{ fontSize: 14, lineHeight: 1.6, color: colors.neutral[700], margin: "0 0 10px" }}
          >
            <span
              style={{
                display: "inline-block",
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: colors.accent[300],
                color: colors.neutral[900],
                fontSize: 12,
                fontWeight: 700,
                textAlign: "center",
                lineHeight: "20px",
                marginRight: 8,
              }}
            >
              {i + 1}
            </span>
            {step}
          </Text>
        ))}
      </Section>

      <Text style={{ fontSize: 15, lineHeight: 1.6, color: colors.neutral[700], margin: 0 }}>
        A presto,
        <br />
        Arianna
      </Text>

      <Hr style={{ borderColor: colors.neutral[200], margin: "32px 0 8px" }} />

      <Heading as="h3" style={{ fontSize: 14, color: colors.neutral[900], margin: "0 0 4px" }}>
        La copia delle tue risposte
      </Heading>
      <Text style={{ fontSize: 13, lineHeight: 1.6, color: colors.neutral[500], margin: "0 0 8px" }}>
        Rileggile con calma prima della call: se ti viene in mente qualcosa da
        aggiungere o correggere, segnatelo e ne parliamo lì.
      </Text>
      {emailSections.map((section) => (
        <SectionBlock key={section.title} section={section} />
      ))}
    </EmailLayout>
  );
}

export default ClientConfirmationEmail;
