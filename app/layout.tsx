import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { fetchStarCount, placeholderStarCount } from "@/lib/github";
import { GITHUB_REPO, OG_IMAGE, SITE_TITLE, SITE_URL, TAGLINE } from "@/lib/site";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: TAGLINE,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Databasify",
    title: SITE_TITLE,
    description: TAGLINE,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: TAGLINE,
    images: [OG_IMAGE],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const stars = (await fetchStarCount(GITHUB_REPO)) ?? placeholderStarCount(process.env.PLACEHOLDER_STAR_COUNT);

  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${jetBrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header stars={stars} />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
