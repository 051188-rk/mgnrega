import './globals.css'

export const metadata = {
  title: 'District Performance Insights',
  description: 'A new dashboard for tracking district-level metrics.'
}

// Add font face definitions in a style tag
const fontStyles = `
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('/fonts/poppins-v20-latin-regular.woff2') format('woff2');
  }
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url('/fonts/poppins-v20-latin-600.woff2') format('woff2');
  }
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: url('/fonts/poppins-v20-latin-700.woff2') format('woff2');
  }
`

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}