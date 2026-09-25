import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Esports Trading — The next emerging Billion Dollar Competitive Sport",
  description:
    "Esports Trading is where trading skills meet competition. Traders compete head-to-head and in organized events, putting their strategy, market knowledge, skills, and decision-making to the test.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060606",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&family=Inter:opsz,wght@14..32,100..900&display=swap"
        />
        <link rel="preload" as="image" href="/media/video/hero-poster.jpg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
