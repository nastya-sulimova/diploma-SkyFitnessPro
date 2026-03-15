import { Roboto } from "next/font/google";
import Header from "@/components/Header/Header";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={roboto.variable}>
      <body className={roboto.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
