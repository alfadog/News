import './globals.css';
import React from 'react';
import { DEFAULT_SITE } from '@shared';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={DEFAULT_SITE.defaultLocale}>
      <body>
        <header>
          <div className="container">
            <h1>Bazaar-esque</h1>
            <p className="tagline">Multi-site newsroom starter</p>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="container">Built with Next.js + Payload CMS.</footer>
      </body>
    </html>
  );
}
