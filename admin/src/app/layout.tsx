import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.mokshwear.shop"),
  title: "MOKSH Admin",
  description: "Admin panel for Moksh catalogue",
  openGraph: {
    title: "MOKSH Admin",
    description: "Admin panel for Moksh catalogue",
    url: "https://app.mokshwear.shop",
    siteName: "Mokshwear",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOKSH Admin",
    description: "Admin panel for Moksh catalogue",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-deep text-foreground">
        {children}
        <Toaster position="top-center" theme="dark" />
      </body>
    </html>
  );
}
