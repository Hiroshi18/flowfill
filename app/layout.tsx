import "./globals.css";
import { Inter } from "next/font/google";
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
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        {/* DO NOT wrap {children} in Suspense here; it breaks the global CSS application */}
        {children}
      </body>
    </html>
  );
}
