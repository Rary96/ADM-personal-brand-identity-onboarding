import { Heading, Section, Text } from "@react-email/components";
import { EmailLayout } from "@/emails/components/EmailLayout";
import { outroCopy } from "@/content/questionnaire";
import { personalize, primoNome } from "@/lib/personalize";
import { colors } from "@/lib/design-tokens";

interface ClientConfirmationEmailProps {
  /** Nome e cognome di chi ha compilato (campo `nomeCognome`). */
  nomeCliente: string;
}

export function ClientConfirmationEmail({ nomeCliente }: ClientConfirmationEmailProps) {
  const titolo = personalize(outroCopy.titolo, nomeCliente);
  const corpo = personalize(outroCopy.corpo, nomeCliente);
  // Il saluto usa il solo nome di battesimo: qui il destinatario è sempre una
  // persona, non un'azienda, quindi non serve il fallback del progetto gemello.
  const saluto = primoNome(nomeCliente);

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
    </EmailLayout>
  );
}

export default ClientConfirmationEmail;
