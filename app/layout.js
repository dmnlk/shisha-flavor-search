import './globals.css';

export const metadata = {
  title: 'Shisha Flavor Search',
  description: 'Find your perfect shisha flavor from our extensive collection',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
