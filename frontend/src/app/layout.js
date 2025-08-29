import './globals.css'

export const metadata = {
  title: 'AI Document Insight Tool',
  description: 'Upload PDFs and get AI-powered insights',
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