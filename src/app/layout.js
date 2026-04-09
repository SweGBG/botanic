import './globals.css'

export const metadata = {
  title: 'Botanicatural — Botanical & Natural Skincare',
  description: 'Clean beauty formulated with certified organic botanicals. Zero compromise.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
