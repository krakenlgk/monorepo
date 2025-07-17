import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Monorepo Frontend',
  description: 'Next.js frontend application in monorepo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}