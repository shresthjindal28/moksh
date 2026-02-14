import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOKSH Admin",
  description: "Admin panel for Moksh catalogue",
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
