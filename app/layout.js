import './globals.css'

export const metadata = {
  title: 'YoYo Guild - Battle Arena',
  description: 'Premium blockchain-based battling game with Tevans',
}

export default function RootLayout({ children }) {
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