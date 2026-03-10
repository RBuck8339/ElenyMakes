import '../../globals.css'
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>Eleny Makes | Crochet & Knitting Patterns</title>
        <meta name="description" content="Bespoke digital patterns for the modern maker." />

        {/* iMessage / Open Graph Tags */}
        <meta property="og:title" content="Eleny Makes" />
        <meta property="og:description" content="Bespoke digital patterns for the modern maker." />
        <meta property="og:url" content="https://elenymakes.com" />
        <meta property="og:site_name" content="Eleny Makes" />
        <meta property="og:type" content="website" />
        
        {/* THE PICTURE: Make sure the file is in your public folder */}
        <meta property="og:image" content="https://elenymakes.com/gallery/products/wave-top/wave_back.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/webp" />

        {/* for twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://elenymakes.com/gallery/products/wave-top/wave_back.webp" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}