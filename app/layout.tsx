import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shisha Flavor Search',
  description: 'Find your perfect shisha flavor from our extensive collection',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}