import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dove Glitters — Nail Artistry & Wonderland Dance Academy',
  description: "Luxury nails, expert nail training, and Wonderland Dance Academy with Dove in Ogbomosho. Book online or DM @dove_glitters.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}