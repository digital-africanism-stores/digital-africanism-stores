// app/layout.tsx
import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'Digital Africanism Stores',
  description: 'The easiest way to sell online in Ethiopia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Load the CORRECT Telegram Web App Script */}
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
