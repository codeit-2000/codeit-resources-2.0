import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Codeit Resources" />
        <meta property="og:description" content="코드잇 자원 관리 시스템" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:url" content="https://resource.codeit.kr/" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image" content="/images/codeit_image.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
