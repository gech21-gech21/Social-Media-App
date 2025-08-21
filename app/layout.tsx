import "./globals.css";
import Navbar from "./components/navgation";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="w-full md:px-8 lg:px-16 xl:px-32 2xl:px-64 shadow-2xl">
          <Navbar />
        </div>
        <main className="w-full px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
          {children}
        </main>
      </body>
    </html>
  );
}
