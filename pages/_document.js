import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="OpenTV - TV Aberta Legalizada" />
        <meta property="og:type" content="website" />
      </Head>
      <body className="bg-neutral-950 text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
