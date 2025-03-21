// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

// added a title since it was flagging on 'lighthouse' for accessibility issues.
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Escape from Tarkov Companion</title>
        <meta name="description" content="Interactive tools for Escape from Tarkov providing ammunition data and loadout building with progressive disclosure." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}