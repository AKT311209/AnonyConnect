import { Html, Head, Main, NextScript } from 'next/document'

export default function Document () {
  return (
    <Html>
      <Head data-bs-theme='light' lang='en'>
        <link rel='stylesheet' href='/assets/bootstrap/css/bootstrap.min.css' />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Inter:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&amp;display=swap' />
        <link rel='stylesheet' href='/assets/css/bs-theme-overrides.css' />
        <link rel='stylesheet' href='/assets/css/Contact-Details-icons.css' />
        <link rel='stylesheet' href='/assets/css/Pretty-Search-Form-.css' />
      </Head>
      <body>
        <Main />
        <script src='/assets/bootstrap/js/bootstrap.min.js' />
        <script src='/assets/js/bs-init.js' />
        <script src='/assets/js/bold-and-bright.js' />
        <NextScript />
      </body>
    </Html>
  )
}
