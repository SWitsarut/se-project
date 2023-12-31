import "@mantine/core/styles.css";

import type { Metadata } from "next";
import "./globals.css";
import { ColorSchemeScript } from "@mantine/core";

import ProviderWrapper from "@/components/ProviderWrapper";
import SessionProvider from "@/components/SessionProvider"

import { authOption } from "@/libs/authOption";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "E-book store",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOption);
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript/>
      </head>
      <body className="min-h-screen">
        <SessionProvider session={session}>
          <ProviderWrapper>{children}</ProviderWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
