import "./globals.css";
import { APP_CONFIG } from "@/config/constants";

export const metadata = {
  title: `${APP_CONFIG.name} — ${APP_CONFIG.title}`,
  description: APP_CONFIG.tagline,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen bg-blue-50/40 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
