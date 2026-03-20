import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Flowfill",
  description: "Intelligent studio management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background antialiased selection:bg-primary/10"
        )}
      >
        {/* We keep the layout shell outside of any specific page suspense */}
        {children}
      </body>
    </html>
  );
}
