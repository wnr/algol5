import React from "react";
import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html>
        <Head>
          <link rel="stylesheet" href="/components.css" />
          <link rel="stylesheet" href="/site.css" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}