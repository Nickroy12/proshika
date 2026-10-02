import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import StoreProvider from "@/lib/redux/StoreProvider";

export const metadata: Metadata = {
  title: "Expense Tracker & Finance Manager",
  description: "Manage, track, and categorize your daily expenses with interactive analytics and realtime database syncing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-semibold" style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}>
      <body className="min-h-full flex flex-col bg-slate-50/50 text-foreground font-semibold dark:bg-background" style={{ fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" }}>
        <StoreProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
        </StoreProvider>
      </body>
    </html>
  );
}
