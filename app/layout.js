import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'YoYo Guild - Blockchain Battle Arena',
  description: 'Premium blockchain-based battling game with Guilders',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}