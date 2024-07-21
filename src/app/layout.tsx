import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';

import "../styles/theme.css";
import AppWrapper from "@/layout/mainLayout";
import { SessionProvider } from "@/context";
import { AuditProvider } from "@/shared/tools/auditMonit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LEGEND TIME MANAGEMENT",
  description: "Solving Customer Problems and Completing Company Tasks",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <SessionProvider>
        <AuditProvider>
          <body className={`${inter.className} p-0 m-0 overflow-hidden bg-gray-100`}>
            <AppWrapper>
              {children}
              <Toaster
                position="bottom-center"
                reverseOrder={false}
              />
            </AppWrapper>
          </body>
        </AuditProvider>
      </SessionProvider>
    </html>
  );
}
