import "./globals.css";
import Navbar from "./components/navgation";
import { ClerkProvider } from "@clerk/nextjs";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="w-full px-4 py-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 shadow-2xl">
            <Navbar />
          </div>
          <main className="w-full px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
