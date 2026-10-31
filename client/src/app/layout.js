import './globals.css'

export const metadata = {
  title: 'ODYSSEY',
  description: 'A journey beyond time',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}