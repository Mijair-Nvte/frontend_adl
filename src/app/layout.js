import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; // 👈 importa tu contexto

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ACADEMIA DE LIMPIEZA",
  description: "AUTOCLIENTE",
};

export default function RootLayout({ children }) {
  return (
    
 <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
  <body className="antialiased">
    <AuthProvider>
      {children}
    </AuthProvider>
  </body>
</html>

  );
}
