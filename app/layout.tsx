import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Prima di iniziare, parlami di te — Onboarding Personal Brand",
  description:
    "Questionario preparatorio al meeting di kickoff per lo sviluppo della tua personal brand identity.",
  // Icone dichiarate a mano e servite da `public/`, NON con la convenzione
  // `app/icon.png`: quella genera una route di metadata che in Next 14.2.35
  // fa fallire `next build` in questo progetto (il percorso assoluto della
  // cartella contiene una pipe e delle & — "ADM | Design & Digital").
  // Questa via non passa dal codegen delle metadata route ed è equivalente
  // per il browser. Non "semplificare" reintroducendo app/icon.png.
  icons: {
    icon: "/favicon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={montserrat.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
