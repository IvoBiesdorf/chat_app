import Head from 'next/head'
import { AppProps } from 'next/app'
import '../styles/index.css'
import 'font-awesome/css/font-awesome.min.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Chat-app-Ivo</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
