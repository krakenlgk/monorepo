import type { Metadata } from 'next';
import React from 'react';
import { GraphQLProvider } from '../lib/apollo-provider';

export const metadata: Metadata = {
  title: 'Monorepo Frontend',
  description: 'Next.js frontend application in monorepo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GraphQLProvider>{children}</GraphQLProvider>
      </body>
    </html>
  );
}
