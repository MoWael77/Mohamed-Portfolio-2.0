import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mohamed Wael Portfolio",
  description: "Interactive terminal portfolio of Mohamed Wael, Software & Cybersecurity Engineer",
  icons: {
    // Use your profile.jpg as favicon
    icon: "/profile.jpg",
    // For better compatibility, you might want to add specific sizes
    shortcut: "/profile.jpg",
    apple: "/profile.jpg",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
